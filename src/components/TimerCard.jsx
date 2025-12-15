import React, { useState, useEffect } from 'react';
import { Play, Pause, Trash2, RotateCcw, Bell, BellOff } from 'lucide-react';
import { useTimers } from '../context/TimerContext';
import clsx from 'clsx';
import { format } from 'date-fns';

const TimerCard = ({ id, timer }) => {
    const { toggleTimer, deleteTimer, resetTimer, toggleAlert, timersToAlert } = useTimers();
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            if (timer.status === 'running' && timer.expiryTimestamp) {
                const offset = parseInt(localStorage.getItem('serverTimeOffset') || '0');
                const now = Date.now() + offset;
                const remaining = Math.max(0, Math.ceil((timer.expiryTimestamp - now) / 1000));
                setTimeLeft(remaining);
            } else {
                setTimeLeft(Math.floor(timer.remainingSeconds));
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const progress = Math.min(100, Math.max(0, (timeLeft / (timer.durationMinutes * 60)) * 100));
    const isWork = timer.type === 'work';
    const themeColor = isWork ? 'text-cyber-neonBlue' : 'text-cyber-neonPink';
    const borderColor = isWork ? 'border-cyber-neonBlue' : 'border-cyber-neonPink';
    const glowShadow = isWork ? 'shadow-neon-blue' : 'shadow-neon-pink';
    const isAlerting = timersToAlert.includes(id);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={clsx(
            "glass-panel p-6 relative group transition-all duration-300 hover:-translate-y-1",
            timer.status === 'running' && isAlerting && "shadow-lg",
            timer.status === 'running' && isAlerting && (isWork ? "shadow-cyber-neonBlue/20" : "shadow-cyber-neonPink/20")
        )}>
            {/* Alert Toggle */}
            <button
                onClick={() => toggleAlert(id)}
                className={clsx(
                    "absolute top-4 right-4 p-2 rounded-full transition-colors",
                    isAlerting ? "text-yellow-400 bg-yellow-400/10" : "text-gray-600 hover:text-gray-400"
                )}
                title={isAlerting ? "Alerts Enabled" : "Alerts Disabled"}
            >
                {isAlerting ? <Bell size={18} /> : <BellOff size={18} />}
            </button>

            {/* Timer Info */}
            <div className="flex flex-col items-center justify-center mb-6">
                <h3 className="text-xl font-bold mb-1 truncate max-w-full">{timer.name}</h3>
                <span className={clsx("text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded",
                    isWork ? "bg-cyber-neonBlue/10 text-cyber-neonBlue" : "bg-cyber-neonPink/10 text-cyber-neonPink"
                )}>
                    {timer.type}
                </span>
            </div>

            {/* Time Display */}
            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                {/* Progress Ring Background */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="stroke-white/10 fill-none" strokeWidth="4" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className={clsx("fill-none transition-all duration-1000", themeColor)}
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Digital Time */}
                <div className="text-4xl font-mono font-bold tracking-wider">
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => toggleTimer(id)}
                    className={clsx("p-3 rounded-full text-black transition-all hover:scale-110",
                        isWork ? "bg-cyber-neonBlue hover:bg-white" : "bg-cyber-neonPink hover:bg-white"
                    )}
                >
                    {timer.status === 'running' ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <button onClick={() => resetTimer(id)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all">
                    <RotateCcw size={20} />
                </button>

                <button onClick={() => deleteTimer(id)} className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-white transition-all">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default TimerCard;
