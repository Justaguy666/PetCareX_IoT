import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import userService from "../services/userService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    userService
      .getProfile()
      .then((res) => {
        if (res.user) {
          setUser(res.user);
        } else {
          setUser(res);
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      setUser({ id: res.data.id });
      navigate("/");
      toast.success(res?.message || "Đăng nhập thành công");
    } catch (error) {
      throw Error(error?.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register(name, email, password);
      setUser(null);
      navigate("/login");
      toast.success(res?.message || "Đăng ký thành công");
    } catch (error) {
      throw Error(error?.message);
    }
  };

  const logout = async () => {
    try {
        await authService.logout();
    } catch {}
    setUser(null);
    navigate("/login");
  };

  const isAuthenticated = !!user;

  if (loading) return null;
  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
