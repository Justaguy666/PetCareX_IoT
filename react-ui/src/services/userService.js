import authService from './authService';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const getAuthHeader = () => ({});

const handleResponse = async (response, originalRequest) => {
    if (response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshRes = await authService.refreshToken();
            if (refreshRes && refreshRes.AccessToken) {
                if (typeof originalRequest === 'function') {
                    return await originalRequest();
                }
            }
        } catch (e) {
            console.error('Error refreshing token:', e);
        }
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
    }
    return data;
};

class UserService {
    async getNewestFeeding() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/feeding/newest`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async getNextFeeding() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/feeding/next`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async getSchedules() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/settings`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async createSchedule(time) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ time }),
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async updateSchedule(oldTime, newTime, enabled) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/schedule`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ oldTime, newTime, enabled }),
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async deleteSchedule(time) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/schedule`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ time }),
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async getStatistics() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/statistics`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async getWeeklyReport() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/weekly-report`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async getSettings() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/settings`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async updateSettings(settings) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(settings),
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async getProfile() {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/profile`, {
                headers: { ...getAuthHeader() },
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async updateProfile(data) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async changePassword(data) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }
}

export default new UserService();
