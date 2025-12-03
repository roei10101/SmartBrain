import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Welcome to your new Student Brain!", time: "Just now", read: false },
        { id: 2, text: "Don't forget to check your tasks for today.", time: "1 hour ago", read: false },
        { id: 3, text: "System update completed successfully.", time: "2 hours ago", read: true },
    ]);
    const notificationRef = useRef(null);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    // Extract name from email or use default
    const displayName = user?.email ? user.email.split('@')[0] : 'Student';

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 h-20 z-40 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur-sm border-b border-white/5">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white">Welcome back, {displayName}</h2>
                <p className="text-sm text-slate-400">{currentDate}</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="bg-slate-900/50 border border-slate-700 text-slate-100 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-500 focus:w-80"
                    />
                </div>

                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                        <Bell size={24} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                                <h3 className="font-semibold text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Check size={12} />
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors relative group ${notification.read ? 'opacity-60' : 'bg-indigo-500/5'}`}
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1">
                                                    <p className={`text-sm ${notification.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                                                        {notification.text}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNotification(notification.id);
                                                    }}
                                                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="absolute inset-0 w-full h-full cursor-pointer z-0"
                                                    aria-label="Mark as read"
                                                />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">{displayName}</p>
                        <p className="text-xs text-slate-400">Student</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            <User size={20} className="text-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
