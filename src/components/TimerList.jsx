import React from 'react';
import { useTimers } from '../context/TimerContext';
import TimerCard from './TimerCard';
import { motion } from 'framer-motion';

const TimerList = () => {
    const { timers, loading } = useTimers();

    if (loading) {
        return <div className="text-center text-gray-500 mt-20">Loading timers...</div>;
    }

    const timerList = Object.entries(timers);

    if (timerList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-400">
                <p className="text-xl mb-4">No Active Timers</p>
                <p className="max-w-md text-sm text-gray-600">
                    Be the first to start a session. Click "Add Timer" to notify your team you are working (or taking a break!).
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {timerList.map(([id, timer]) => (
                <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                >
                    <TimerCard id={id} timer={timer} />
                </motion.div>
            ))}
        </div>
    );
};

export default TimerList;
