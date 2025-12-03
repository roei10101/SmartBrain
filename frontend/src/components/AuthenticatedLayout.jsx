import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './ui/Header';

const AuthenticatedLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-300">
                <Header />
                <main className="flex-1 pt-24 px-8 pb-8 overflow-y-auto h-screen">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthenticatedLayout;
