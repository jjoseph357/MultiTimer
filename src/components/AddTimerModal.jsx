import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Coffee } from 'lucide-react';
import { useTimers } from '../context/TimerContext';

const AddTimerModal = ({ isOpen, onClose }) => {
    const { addTimer } = useTimers();
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(25);
    const [type, setType] = useState('work'); // 'work' | 'break'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        addTimer(name, type, parseInt(duration));
        setName('');
        // Keep last duration/type or reset? Let's keep for convenience or reset?
        // Resetting seems cleaner for multi-user
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md p-6 glass-panel relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyber-neonBlue to-cyber-neonPink bg-clip-text text-transparent">
                        New Timer
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Label / Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Asher"
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-neonBlue transition-colors"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                min="1"
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-neonBlue transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Type</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setType('work')}
                                    className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${type === 'work'
                                            ? 'bg-cyber-neonBlue/20 border-cyber-neonBlue text-cyber-neonBlue shadow-neon-blue'
                                            : 'bg-black/20 border-white/10 text-gray-400'
                                        } border`}
                                >
                                    <Clock size={18} /> Work
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('break')}
                                    className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${type === 'break'
                                            ? 'bg-cyber-neonPink/20 border-cyber-neonPink text-cyber-neonPink shadow-neon-pink'
                                            : 'bg-black/20 border-white/10 text-gray-400'
                                        } border`}
                                >
                                    <Coffee size={18} /> Break
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors mt-2"
                        >
                            Create Timer
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddTimerModal;
