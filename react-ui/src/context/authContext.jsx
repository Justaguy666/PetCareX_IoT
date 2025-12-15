import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}