const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

class UserService {
    async getNewestFeeding() {
        const response = await fetch(`${API_URL}/users/feeding/newest`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async getNextFeeding() {
        const response = await fetch(`${API_URL}/users/feeding/next`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async getSchedules() {
        const response = await fetch(`${API_URL}/users/settings`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async createSchedule(time) {
        const response = await fetch(`${API_URL}/users/schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ time })
        });
        return handleResponse(response);
    }

    async updateSchedule(oldTime, newTime, enabled) {
        const response = await fetch(`${API_URL}/users/schedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ oldTime, newTime, enabled })
        });
        return handleResponse(response);
    }

    async deleteSchedule(time) {
        const response = await fetch(`${API_URL}/users/schedule`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ time })
        });
        return handleResponse(response);
    }

    async getStatistics() {
        const response = await fetch(`${API_URL}/users/statistics`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async getWeeklyReport() {
        const response = await fetch(`${API_URL}/users/weekly-report`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async getSettings() {
        const response = await fetch(`${API_URL}/users/settings`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async updateSettings(settings) {
        const response = await fetch(`${API_URL}/users/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(settings)
        });
        return handleResponse(response);
    }

    async getProfile() {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }

    async updateProfile(data) {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
}

export default new UserService();
