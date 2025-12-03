import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Header from './ui/Header';

const Layout = () => {
    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Header />
                <main className="flex-1 pt-24 px-8 pb-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
