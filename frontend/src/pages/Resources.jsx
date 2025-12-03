import React, { useEffect, useState } from 'react';
import { Link, FileText, Video, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', url: '', type: 'link', tags: '' });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const data = await api.getResources();
            setResources(data);
        } catch (error) {
            console.error("Failed to fetch resources:", error);
        }
    };

    const handleCreateResource = async (e) => {
        e.preventDefault();
        if (!newResource.title.trim()) return;

        try {
            await api.createResource(newResource);
            setNewResource({ title: '', url: '', type: 'link', tags: '' });
            setIsCreating(false);
            fetchResources();
        } catch (error) {
            console.error("Failed to create resource:", error);
        }
    };

    const handleDeleteClick = (resource) => {
        setResourceToDelete(resource);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!resourceToDelete) return;
        try {
            await api.deleteResource(resourceToDelete.id);
            fetchResources();
            setResourceToDelete(null);
        } catch (error) {
            console.error("Failed to delete resource:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'link': return <Link size={20} />;
            case 'video': return <Video size={20} />;
            default: return <FileText size={20} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Resources</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Add Resource</span>
                </button>
            </div>

            {isCreating && (
                <div className="glass-panel p-6">
                    <form onSubmit={handleCreateResource} className="space-y-4">
                        <input
                            type="text"
                            value={newResource.title}
                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                            placeholder="Resource Title"
                            className="w-full input-field"
                            autoFocus
                        />
                        <input
                            type="text"
                            value={newResource.url}
                            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                            placeholder="URL"
                            className="w-full input-field"
                        />
                        <select
                            value={newResource.type}
                            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                            className="w-full input-field"
                        >
                            <option value="link">Link</option>
                            <option value="video">Video</option>
                            <option value="file">File</option>
                        </select>
                        <input
                            type="text"
                            value={newResource.tags}
                            onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
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
                            <button type="submit" className="btn-primary">Add Resource</button>
                        </div>
                    </form>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Resource"
                message={`Are you sure you want to delete "${resourceToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete Resource"
                isDanger={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                    <div key={index} className="glass-card p-6 flex items-start gap-4 group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDeleteClick(resource)}
                                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            {getIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors pr-8">
                                {resource.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{resource.type}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span className="text-xs text-slate-400">{resource.tags}</span>
                            </div>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
                                Open Resource <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;

