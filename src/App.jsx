import React, { useState } from 'react';
import { TimerProvider, useTimers } from './context/TimerContext';
import TimerList from './components/TimerList';
import AddTimerModal from './components/AddTimerModal';
import AudioManager from './components/AudioManager';
import { Plus, Users, Volume2, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

function AppContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { masterVolume, setMasterVolume } = useTimers();
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

    const requestNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyber-neonBlue/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyber-neonPink/10 rounded-full blur-[120px]" />
            </div>

            <header className="flex flex-col md:flex-row items-center justify-between mb-8 max-w-7xl mx-auto gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-neonBlue to-cyber-neonPink flex items-center justify-center shadow-lg shadow-cyber-neonBlue/20">
                        <Users size={24} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        TeamSync
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Volume Control */}
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                        <Volume2 size={20} className="text-white/70" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            className="w-24 accent-cyber-neonBlue h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Notification Permission Button */}
                    {notificationPermission !== 'granted' && (
                        <button
                            onClick={requestNotificationPermission}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                            title="Enable Notifications for background alerts"
                        >
                            <BellOff size={20} />
                        </button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-white/20 transition-all"
                    >
                        <Plus size={20} />
                        New Timer
                    </motion.button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <TimerList />
            </main>

            <AddTimerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <AudioManager />
        </div>
    );
}

function App() {
    return (
        <TimerProvider>
            <AppContent />
        </TimerProvider>
    );
}

export default App;
