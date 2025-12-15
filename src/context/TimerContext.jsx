import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, update, remove, serverTimestamp } from 'firebase/database';
import { differenceInSeconds } from 'date-fns';

const TimerContext = createContext();

export const useTimers = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    const [timers, setTimers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timersToAlert, setTimersToAlert] = useState(() => {
        // Load from local storage: array of timer IDs user wants alerts for
        const saved = localStorage.getItem('alertPrefs');
        return saved ? JSON.parse(saved) : [];
    });
    const [masterVolume, setMasterVolume] = useState(() => {
        const saved = localStorage.getItem('masterVolume');
        return saved ? parseFloat(saved) : 0.5;
    });

    // Listen to Firebase updates
    useEffect(() => {
        if (!db) {
            // Local fallback mode if firebase is not configured
            setLoading(false);
            return;
        }

        const timersRef = ref(db, 'timers');
        const unsubscribe = onValue(timersRef, (snapshot) => {
            const data = snapshot.val();
            setTimers(data || {});
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Save alert prefs
    useEffect(() => {
        localStorage.setItem('alertPrefs', JSON.stringify(timersToAlert));
    }, [timersToAlert]);

    useEffect(() => {
        localStorage.setItem('masterVolume', masterVolume.toString());
    }, [masterVolume]);

    const addTimer = async (name, type, durationSeconds) => {
        const newTimer = {
            name,
            type, // 'work' | 'break'
            durationSeconds,
            status: 'paused',
            remainingSeconds: durationSeconds,
            expiryTimestamp: null,
            createdAt: Date.now(),
            createdBy: 'user_' + Math.floor(Math.random() * 10000) // Simple anonymous ID
        };

        if (db) {
            const timersRef = ref(db, 'timers');
            await push(timersRef, newTimer);
        } else {
            // Local mode
            const id = Date.now().toString();
            setTimers(prev => ({ ...prev, [id]: newTimer }));
        }
    };

    const toggleTimer = async (timerId) => {
        const timer = timers[timerId];
        if (!timer) return;

        if (timer.status === 'running') {
            // Pause
            const now = Date.now();
            const remaining = Math.max(0, differenceInSeconds(timer.expiryTimestamp, now));

            const updates = {
                status: 'paused',
                remainingSeconds: remaining,
                expiryTimestamp: null
            };

            if (db) {
                await update(ref(db, `timers/${timerId}`), updates);
            } else {
                setTimers(prev => ({ ...prev, [timerId]: { ...prev[timerId], ...updates } }));
            }

        } else {
            // Start/Resume
            const now = Date.now();
            // We use Date.now() here, assuming clients are reasonably synced. 
            // Ideally we'd use a server time offset, but Date.now() + remaining is standard.
            // The key is that once SET, expiryTimestamp becomes the source of truth for everyone.
            const expiry = now + (timer.remainingSeconds * 1000);

            const updates = {
                status: 'running',
                expiryTimestamp: expiry,
            };

            if (db) {
                await update(ref(db, `timers/${timerId}`), updates);
            } else {
                setTimers(prev => ({ ...prev, [timerId]: { ...prev[timerId], ...updates } }));
            }
        }
    };

    const deleteTimer = async (timerId) => {
        if (db) {
            await remove(ref(db, `timers/${timerId}`));
        } else {
            setTimers(prev => {
                const next = { ...prev };
                delete next[timerId];
                return next;
            });
        }
    };

    const resetTimer = async (timerId) => {
        const timer = timers[timerId];
        if (!timer) return;

        const updates = {
            status: 'paused',
            remainingSeconds: timer.durationSeconds || (timer.durationMinutes * 60),
            expiryTimestamp: null
        };

        if (db) {
            await update(ref(db, `timers/${timerId}`), updates);
        } else {
            setTimers(prev => ({ ...prev, [timerId]: { ...prev[timerId], ...updates } }));
        }
    };

    const toggleAlert = (timerId) => {
        setTimersToAlert(prev => {
            if (prev.includes(timerId)) {
                return prev.filter(id => id !== timerId);
            } else {
                return [...prev, timerId];
            }
        });
    };

    return (
        <TimerContext.Provider value={{
            timers,
            loading,
            timersToAlert,
            masterVolume,
            setMasterVolume,
            addTimer,
            toggleTimer,
            deleteTimer,
            resetTimer,
            toggleAlert
        }}>
            {children}
        </TimerContext.Provider>
    );
};
