import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, FileText, Zap } from 'lucide-react';
import { api } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState({
        pending_tasks: 0,
        notes_created: 0,
        study_hours: 0,
        focus_score: '0%'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getStats();
                setStatsData(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Pending Tasks', value: statsData.pending_tasks.toString(), icon: CheckCircle, color: 'from-orange-400 to-pink-500' },
        { label: 'Notes Created', value: statsData.notes_created.toString(), icon: FileText, color: 'from-blue-400 to-cyan-500' },
        { label: 'Study Hours', value: statsData.study_hours.toString(), icon: Clock, color: 'from-emerald-400 to-teal-500' },
        { label: 'Focus Score', value: statsData.focus_score, icon: Zap, color: 'from-purple-400 to-indigo-500' },
    ];

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card p-6 relative overflow-hidden group border border-white/5 hover:border-white/10 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.08] rounded-bl-full transition-transform group-hover:scale-110 duration-500`} />
                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-${stat.color.split('-')[1]}-500/20 transition-all`}>
                                <stat.icon className="text-white" size={28} />
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                        Recent Activity
                    </h2>
                    <div className="glass-panel p-8 border border-white/5 min-h-[300px] flex items-center justify-center">
                        <div className="space-y-4 w-full">
                            {/* Placeholder for recent activity - could be fetched from API later */}
                            <div className="text-slate-500 text-center py-8 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
                                    <Clock size={32} />
                                </div>
                                <p>No recent activity to show</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                        Quick Actions
                    </h2>
                    <div className="glass-panel p-6 space-y-4 border border-white/5">
                        <button
                            onClick={() => navigate('/tasks')}
                            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg group"
                        >
                            <CheckCircle size={22} className="group-hover:scale-110 transition-transform" />
                            <span>New Task</span>
                        </button>
                        <button
                            onClick={() => navigate('/notes')}
                            className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-lg group hover:bg-slate-800/80"
                        >
                            <FileText size={22} className="group-hover:scale-110 transition-transform" />
                            <span>New Note</span>
                        </button>
                        <button
                            onClick={() => navigate('/schedule')}
                            className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-lg group hover:bg-slate-800/80"
                        >
                            <Clock size={22} className="group-hover:scale-110 transition-transform" />
                            <span>Log Study Time</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
