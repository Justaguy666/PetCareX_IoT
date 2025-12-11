import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (username, password) => {
        if (username === "admin" && password === "password") {
            const userData = { username: "admin", name: "Administrator" };
            setUser(userData);
            navigate("/");
        }
    }

    const logout = () => {
        setUser(null);
        navigate("/login");
    }

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