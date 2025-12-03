import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Notebook, CheckSquare, Calendar, Library, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Notebook, label: 'Notes', path: '/notes' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: Calendar, label: 'Schedule', path: '/schedule' },
        { icon: Library, label: 'Resources', path: '/resources' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 p-4 z-50 hidden md:block">
            <div className="glass-panel h-full flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Brain.OS
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10 border border-indigo-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`
                            }
                        >
                            <item.icon size={20} className="transition-transform group-hover:scale-110" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all duration-300 group">
                        <Settings size={20} className="transition-transform group-hover:rotate-90" />
                        <span className="font-medium">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
