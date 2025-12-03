import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus, X, Calendar as CalendarIcon, Trash2, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const Schedule = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [studySessions, setStudySessions] = useState([]);

    // Modal States
    const [isLogging, setIsLogging] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Form States
    const [sessionForm, setSessionForm] = useState({ subject: '', duration_minutes: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksData, sessionsData] = await Promise.all([
                api.getTasks(),
                api.getStudySessions()
            ]);
            setTasks(tasksData);
            setStudySessions(sessionsData);
        } catch (error) {
            console.error("Failed to fetch schedule data:", error);
        }
    };

    const handleLogSession = async (e) => {
        e.preventDefault();
        if (!sessionForm.subject || !sessionForm.duration_minutes) return;

        try {
            await api.createStudySession({
                ...sessionForm,
                duration_minutes: parseInt(sessionForm.duration_minutes)
            });
            setSessionForm({ subject: '', duration_minutes: '', date: new Date().toISOString().split('T')[0] });
            setIsLogging(false);
            fetchData();
        } catch (error) {
            console.error("Failed to log session:", error);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            if (editingEvent.type === 'task') {
                await api.updateTask(editingEvent.id, {
                    ...editingEvent,
                    title: editingEvent.title,
                    due_date: editingEvent.date
                });
            } else {
                await api.updateStudySession(editingEvent.id, {
                    subject: editingEvent.title,
                    duration_minutes: parseInt(editingEvent.duration),
                    date: editingEvent.date
                });
            }
            setEditingEvent(null);
            fetchData();
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    const handleDeleteEvent = () => {
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!editingEvent) return;
        try {
            if (editingEvent.type === 'task') {
                await api.deleteTask(editingEvent.id);
            } else {
                await api.deleteStudySession(editingEvent.id);
            }
            setEditingEvent(null);
            fetchData();
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    // Calendar Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const calendarDays = [];

        console.log(`Rendering calendar for ${currentDate.toISOString()}: ${daysInMonth} days, start index ${firstDay}`);

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2 border border-slate-800/50 bg-slate-900/30 min-h-[160px] rounded-xl"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            // Filter events for this day
            const dayTasks = tasks.filter(task => task.due_date === dateStr).map(t => ({ ...t, type: 'task', date: dateStr }));
            const daySessions = studySessions.filter(s => s.date === dateStr).map(s => ({ ...s, type: 'session', title: s.subject, duration: s.duration_minutes, date: dateStr }));
            const dayEvents = [...dayTasks, ...daySessions];

            calendarDays.push(
                <div key={`day-${day}`} className={`relative p-3 rounded-xl border transition-all group min-h-[160px] flex flex-col gap-2 shadow-lg ${isToday
                    ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.25)] z-10 ring-1 ring-indigo-400/30'
                    : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }`}>
                    <div className="flex justify-between items-start">
                        <span className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-slate-400 group-hover:text-white transition-colors'
                            }`}>
                            {day}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="text-[11px] font-bold text-white bg-slate-700/80 px-2 py-0.5 rounded-full border border-white/10 shadow-sm">
                                {dayEvents.length}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5 mt-1 overflow-y-auto custom-scrollbar pr-1">
                        {dayEvents.map((event, idx) => (
                            <button
                                key={`${event.type}-${event.id}-${idx}`}
                                onClick={() => setEditingEvent(event)}
                                className={`text-left px-3 py-2 rounded-lg text-sm font-medium truncate transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${event.type === 'task'
                                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/20 text-blue-100 border border-blue-500/30 hover:border-blue-400/50 hover:from-blue-600/40'
                                    : 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 text-emerald-100 border border-emerald-500/30 hover:border-emerald-400/50 hover:from-emerald-600/40'
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    {event.type === 'session' && <Clock size={12} className="text-emerald-300" />}
                                    <span className="truncate">{event.title}</span>
                                </div>
                                {event.type === 'session' && <div className="text-[10px] opacity-70 mt-0.5 font-normal">{event.duration} mins</div>}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white">Schedule</h1>
                    <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-white/5">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-4 font-semibold text-white min-w-[140px] text-center">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setEditingEvent({ type: 'task', status: 'Todo', priority: 'Medium' });
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingEvent({ type: 'session', duration: 60 });
                        }}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Clock size={20} />
                        <span>Log Session</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-slate-900/20 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                <div className="grid grid-cols-7 gap-6 mb-4 pr-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-slate-400 font-bold text-sm uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="flex-1 grid grid-cols-7 auto-rows-auto gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Log Session Modal */}
            {isLogging && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="glass-panel p-6 w-full max-w-md space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Log Study Session</h3>
                            <button onClick={() => setIsLogging(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleLogSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={sessionForm.subject}
                                    onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })}
                                    className="w-full input-field"
                                    placeholder="e.g. Math, Physics"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={sessionForm.duration_minutes}
                                    onChange={(e) => setSessionForm({ ...sessionForm, duration_minutes: e.target.value })}
                                    className="w-full input-field"
                                    placeholder="60"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={sessionForm.date}
                                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                                    className="w-full input-field"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsLogging(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Log Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="glass-panel p-6 w-full max-w-md space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Edit {editingEvent.type === 'task' ? 'Task' : 'Session'}
                                </h3>
                                <p className="text-sm text-slate-400">Make changes to your event</p>
                            </div>
                            <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    {editingEvent.type === 'task' ? 'Title' : 'Subject'}
                                </label>
                                <input
                                    type="text"
                                    value={editingEvent.title}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                    className="w-full input-field"
                                    required
                                />
                            </div>

                            {editingEvent.type === 'session' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={editingEvent.duration}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                                        className="w-full input-field"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={editingEvent.date}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                    className="w-full input-field"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-6">
                                <button
                                    type="button"
                                    onClick={handleDeleteEvent}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-md hover:bg-red-500/10"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingEvent(null)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Delete ${editingEvent?.type === 'task' ? 'Task' : 'Session'}`}
                message={`Are you sure you want to delete "${editingEvent?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default Schedule;
