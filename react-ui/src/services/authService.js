const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const safeParse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }
  const text = await response.text();

  return { message: text };
};

const handleResponse = async (response, originalRequest) => {
  if (response.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshRes = await authService.refreshToken();
      if (refreshRes?.AccessToken) {
        return await originalRequest();
      }
    } catch (e) {
        console.error("Error handling response:", e);
    }
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  const data = await safeParse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

class AuthService {
  async login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw Error(data.error);
        }

        return data;
    } catch (error) {
        throw Error(error?.message);
    }
  }

  async register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: name, email, password }),
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw Error(data.error);
        }

        return data;
    } catch (error) {
        throw Error(error?.message);
    }
  }

  async refreshToken() {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    const data = await safeParse(response);

    if (!response.ok) {
      throw new Error(data?.message || "Refresh token failed");
    }
    return data;
  }

  async logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await safeParse(response);

    if (!response.ok) {
      throw new Error(data?.message || "Logout failed");
    }

    return data;
  }
}

const authService = new AuthService();
export default authService;
