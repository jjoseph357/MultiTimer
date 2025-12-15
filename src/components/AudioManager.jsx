import React, { useEffect, useRef } from 'react';
import { useTimers } from '../context/TimerContext';
import { update, ref } from 'firebase/database';
import { db } from '../firebase';

const AudioManager = () => {
    const { timers, timersToAlert, masterVolume } = useTimers();
    const audioCtxRef = useRef(null);

    // Expose unlock function to be called on user interaction
    useEffect(() => {
        const unlockAudio = () => {
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            } else if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };
    }, []);

    const playPleasantChime = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;

        // Ensure context is running (iOS fix)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;

        // Master Gain for Volume Control
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(masterVolume, now);
        masterGain.connect(ctx.destination);

        // Create a nice chord (C Major Major 7th ish: C5, E5, G5, B5)
        // Frequencies: 523.25, 659.25, 783.99, 987.77
        const frequencies = [523.25, 659.25, 783.99, 987.77];

        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Use triangle wave for a softer, bell-like tone
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Stagger entries slightly for a strummed feel
            const startTime = now + (index * 0.05);

            // Envelope: Attack, Decay, Sustain, Release
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05); // Attack
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.0); // Long decay

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(startTime);
            osc.stop(startTime + 2.5);
        });
    };

    useEffect(() => {
        const checkInterval = setInterval(() => {
            const now = Date.now();

            Object.entries(timers).forEach(([id, timer]) => {
                if (timer.status === 'running' && timer.expiryTimestamp) {
                    const timeLeft = timer.expiryTimestamp - now;

                    if (timeLeft <= 0) {
                        // 1. Play sound
                        if (timersToAlert.includes(id)) {
                            playPleasantChime();

                            // Send System Notification
                            if ('Notification' in window && Notification.permission === 'granted') {
                                try {
                                    new Notification(`Timer Done: ${timer.name}`, {
                                        body: "Your timer has finished!",
                                        icon: '/favicon.png'
                                    });
                                } catch (e) {
                                    console.log('Notification failed:', e);
                                }
                            }
                        }

                        // 2. Mark as completed
                        if (db) {
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
    }, [timers, timersToAlert, masterVolume]);

    return null;
};

export default AudioManager;
