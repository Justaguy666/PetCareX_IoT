import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import userService from "../services/userService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi mở app lên (hoặc F5), gọi API lấy profile để biết còn đăng nhập hay không
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await userService.getProfile();
        setUser(res.user || res);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);

      // Sau login gọi profile để lấy đầy đủ user
      const profile = await userService.getProfile();
      setUser(profile.user || profile);

      toast.success(res?.message || "Đăng nhập thành công");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Đăng nhập thất bại");
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register(name, email, password);
      toast.success(res?.message || "Đăng ký thành công");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Đăng ký thất bại");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Logout API failed:", error);
    } finally {
      setUser(null);
      toast.success("Đăng xuất thành công");
      navigate("/login", { replace: true });
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
