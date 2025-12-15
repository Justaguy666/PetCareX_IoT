import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
        useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                userService.getProfile()
                    .then((res) => {
                        if (res.user) {
                            setUser(res.user);
                        } else {
                            setUser(res);
                        }
                    })
                    .catch(() => {
                        setUser(null);
                        localStorage.removeItem('token');
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }, []);
    const navigate = useNavigate();


    const login = async (email, password) => {
        try {
            const res = await authService.login(email, password);
            setUser({ id: res.data.id });
            localStorage.setItem('token', res.data.accessToken);
            navigate("/");
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate("/login");
    };

    const isAuthenticated = !!user;

    if (loading) return null;
    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}