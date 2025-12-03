import React, { useEffect, useState } from 'react';
import { Plus, Search, Tag, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
    const [editingNote, setEditingNote] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const data = await api.getNotes();
            setNotes(data);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newNote.title.trim()) return;

        try {
            await api.createNote(newNote);
            setNewNote({ title: '', content: '', tags: '' });
            setIsCreating(false);
            fetchNotes();
        } catch (error) {
            console.error("Failed to create note:", error);
        }
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        if (!editingNote || !editingNote.title.trim()) return;

        try {
            await api.updateNote(editingNote.id, editingNote);
            setEditingNote(null);
            fetchNotes();
        } catch (error) {
            console.error("Failed to update note:", error);
        }
    };

    const handleDeleteClick = (note) => {
        setNoteToDelete(note);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!noteToDelete) return;
        try {
            await api.deleteNote(noteToDelete.id);
            fetchNotes();
            setNoteToDelete(null);
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">My Notes</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Note</span>
                </button>
            </div>

            {isCreating && (
                <div className="glass-panel p-6">
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <input
                            type="text"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            placeholder="Note Title"
                            className="w-full input-field"
                            autoFocus
                        />
                        <textarea
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            placeholder="Note Content..."
                            className="w-full input-field h-32 resize-none"
                        />
                        <input
                            type="text"
                            value={newNote.tags}
                            onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                            placeholder="Tags (comma separated)"
                            className="w-full input-field"
                        />
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">Save Note</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Modal */}
            {editingNote && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-panel p-6 w-full max-w-2xl space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Edit Note</h3>
                            <button onClick={() => setEditingNote(null)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateNote} className="space-y-4">
                            <input
                                type="text"
                                value={editingNote.title}
                                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                className="w-full input-field"
                                required
                            />
                            <textarea
                                value={editingNote.content}
                                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                className="w-full input-field h-64 resize-none"
                            />
                            <input
                                type="text"
                                value={editingNote.tags}
                                onChange={(e) => setEditingNote({ ...editingNote, tags: e.target.value })}
                                className="w-full input-field"
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingNote(null)}
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
                title="Delete Note"
                message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete Note"
                isDanger={true}
            />

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full input-field pl-10"
                    />
                </div>
                <button className="btn-secondary flex items-center gap-2">
                    <Tag size={20} />
                    <span>Filter by Tag</span>
                </button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <div key={note.id} className="glass-card p-6 flex flex-col h-64 group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => setEditingNote(note)}
                                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(note)}
                                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors pr-16">
                            {note.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1 whitespace-pre-wrap">
                            {note.content}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <span className="text-xs text-slate-500">{note.created_at || 'No Date'}</span>
                            <div className="flex gap-2">
                                {note.tags && note.tags.split(',').map((tag, i) => (
                                    <span key={i} className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;

