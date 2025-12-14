import React, { useEffect, useRef } from 'react';
import { useTimers } from '../context/TimerContext';
import { update, ref } from 'firebase/database';
import { db } from '../firebase';

const AudioManager = () => {
    const { timers, timersToAlert } = useTimers();
    const audioCtxRef = useRef(null);

    const playAlertSound = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    };

    useEffect(() => {
        const checkInterval = setInterval(() => {
            const now = Date.now();

            Object.entries(timers).forEach(([id, timer]) => {
                if (timer.status === 'running' && timer.expiryTimestamp) {
                    const timeLeft = timer.expiryTimestamp - now;

                    if (timeLeft <= 0) {
                        // 1. Play sound if monitored
                        if (timersToAlert.includes(id)) {
                            playAlertSound();
                        }

                        // 2. Mark as completed (idempotent, anyone can do this)
                        // We only want to trigger this once.
                        // To prevent spamming Firebase, maybe we only do it if timeLeft is "freshly" zero (e.g. between 0 and -1000)
                        // Or rely on the status change. 
                        // Ideally we just update status to 'completed'.

                        if (db) {
                            // To avoid race conditions, slightly risky, but acceptable for this app
                            update(ref(db, `timers/${id}`), {
                                status: 'completed',
                                remainingSeconds: 0,
                                expiryTimestamp: null
                            });
                        }
                    }
                }
            });
        }, 1000);

        return () => clearInterval(checkInterval);
    }, [timers, timersToAlert]);

    return null; // Invisible component
};

export default AudioManager;
