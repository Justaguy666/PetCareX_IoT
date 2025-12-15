const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';


// Tự động refresh token nếu gặp 401
const handleResponse = async (response, originalRequest) => {
    if (response.status === 401 && originalRequest && !originalRequest._retry) {
        // Thử refresh token
        originalRequest._retry = true;
        try {
            const refreshRes = await authService.refreshToken();
            if (refreshRes && refreshRes.accessToken) {
                localStorage.setItem('token', refreshRes.accessToken);
                // Gọi lại request với token mới
                if (typeof originalRequest === 'function') {
                    return await originalRequest();
                }
            }
        } catch (e) {
            // Nếu refresh thất bại, xóa token
            localStorage.removeItem('token');
        }
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};


class AuthService {
    async login(email, password) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async register(name, email, password) {
        const doRequest = async () => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, email, password })
            });
            return handleResponse(response, doRequest);
        };
        return doRequest();
    }

    async refreshToken() {
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
        });
        // Không tự động refresh tiếp nếu refreshToken cũng lỗi
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Refresh token failed');
        }
        return data;
    }
}

export default new AuthService();
