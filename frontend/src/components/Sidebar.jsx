import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    BookOpen,
    Library,
    Calendar,
    LogOut,
    Brain
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
        { path: '/notes', icon: BookOpen, label: 'Notes' },
        { path: '/resources', icon: Library, label: 'Resources' },
        { path: '/schedule', icon: Calendar, label: 'Schedule' },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen">
            <div className="p-6 flex items-center gap-3 text-indigo-400">
                <Brain size={32} />
                <span className="text-xl font-bold text-white tracking-tight">Second Brain</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-4">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm text-slate-300 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
