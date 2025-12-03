import React, { useEffect, useState, useRef } from 'react';
import { Plus, MoreHorizontal, Calendar, Flag, X, Trash2, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const menuRef = useRef(null);

    const columns = [
        { title: 'Todo', color: 'bg-slate-500', status: 'Todo' },
        { title: 'In Progress', color: 'bg-indigo-500', status: 'In Progress' },
        { title: 'Done', color: 'bg-emerald-500', status: 'Done' },
    ];

    useEffect(() => {
        fetchTasks();

        // Close menu when clicking outside
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuTaskId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await api.getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const newTask = {
                title: newTaskTitle,
                status: 'Todo',
                priority: 'Medium'
            };
            await api.createTask(newTask);
            setNewTaskTitle('');
            setIsCreating(false);
            fetchTasks();
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!editingTask || !editingTask.title.trim()) return;

        try {
            await api.updateTask(editingTask.id, editingTask);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
        setActiveMenuTaskId(null);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await api.deleteTask(taskToDelete.id);
            fetchTasks();
            setTaskToDelete(null);
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col relative">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Tasks Board</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            {isCreating && (
                <div className="mb-6 glass-panel p-4">
                    <form onSubmit={handleCreateTask} className="flex gap-4">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="flex-1 input-field"
                            autoFocus
                        />
                        <button type="submit" className="btn-primary">Add</button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-panel p-6 w-full max-w-md space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Edit Task</h3>
                            <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                    className="w-full input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    value={editingTask.description || ''}
                                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                    className="w-full input-field min-h-[100px]"
                                    placeholder="Add a description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                    <select
                                        value={editingTask.status}
                                        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                                        className="w-full input-field"
                                    >
                                        {columns.map(col => (
                                            <option key={col.status} value={col.status}>{col.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                                    <select
                                        value={editingTask.priority}
                                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                                        className="w-full input-field"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={editingTask.due_date || ''}
                                    onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                                    className="w-full input-field"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingTask(null)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete Task"
                isDanger={true}
            />

            <div className="flex-1 flex gap-8 overflow-x-auto pb-6">
                {columns.map((col) => {
                    const colTasks = getTasksByStatus(col.status);
                    return (
                        <div key={col.title} className="flex-1 min-w-[320px] flex flex-col gap-4">
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${col.color} shadow-[0_0_8px_currentColor]`}></span>
                                    <h3 className="font-bold text-slate-200 tracking-wide">{col.title}</h3>
                                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-white/5">
                                        {colTasks.length}
                                    </span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="flex-1 bg-slate-900/20 rounded-2xl p-3 space-y-3 overflow-y-auto custom-scrollbar border border-white/5">
                                {colTasks.map((task) => (
                                    <div key={task.id} className="glass-card p-4 cursor-grab active:cursor-grabbing group relative border border-white/5 hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${task.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                }`}>
                                                {task.priority}
                                            </span>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                                                    }}
                                                    className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-white/10 rounded-md"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>

                                                {activeMenuTaskId === task.id && (
                                                    <div ref={menuRef} className="absolute right-0 top-8 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                        <button
                                                            onClick={() => {
                                                                setEditingTask(task);
                                                                setActiveMenuTaskId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(task)}
                                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="text-white font-semibold mb-2 leading-tight">{task.title}</h4>
                                        {task.description && (
                                            <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                                <Calendar size={14} />
                                                <span>{task.due_date || 'No Date'}</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md border border-white/10">
                                                JD
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tasks;

