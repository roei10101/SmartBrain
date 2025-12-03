const API_URL = 'https://smartbrainbackend.roeiduenyas.me';

let token = null;

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    setToken: (newToken) => {
        token = newToken;
    },

    // Auth
    login: async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    register: async (email, password) => {
        const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetch(`${API_URL}/users/me/`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    // Tasks
    getTasks: async () => {
        const response = await fetch(`${API_URL}/tasks/`, { headers: getHeaders() });
        return response.json();
    },
    createTask: async (task) => {
        const response = await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(task),
        });
        return response.json();
    },
    updateTask: async (id, task) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(task),
        });
        return response.json();
    },
    deleteTask: async (id) => {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    },

    // Notes
    getNotes: async () => {
        const response = await fetch(`${API_URL}/notes/`, { headers: getHeaders() });
        return response.json();
    },
    createNote: async (note) => {
        const response = await fetch(`${API_URL}/notes/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(note),
        });
        return response.json();
    },
    updateNote: async (id, note) => {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(note),
        });
        return response.json();
    },
    deleteNote: async (id) => {
        await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    },

    // Resources
    getResources: async () => {
        const response = await fetch(`${API_URL}/resources/`, { headers: getHeaders() });
        return response.json();
    },
    createResource: async (resource) => {
        const response = await fetch(`${API_URL}/resources/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(resource),
        });
        return response.json();
    },
    deleteResource: async (id) => {
        await fetch(`${API_URL}/resources/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    },

    // Study Sessions
    getStudySessions: async () => {
        const response = await fetch(`${API_URL}/study-sessions/`, { headers: getHeaders() });
        return response.json();
    },
    createStudySession: async (session) => {
        const response = await fetch(`${API_URL}/study-sessions/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(session),
        });
        return response.json();
    },
    updateStudySession: async (id, session) => {
        const response = await fetch(`${API_URL}/study-sessions/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(session),
        });
        return response.json();
    },
    deleteStudySession: async (id) => {
        await fetch(`${API_URL}/study-sessions/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    },

    // Stats
    getStats: async () => {
        const response = await fetch(`${API_URL}/stats/`, { headers: getHeaders() });
        return response.json();
    }
};
