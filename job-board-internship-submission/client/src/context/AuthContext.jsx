import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tb_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("tb_token")));

  useEffect(() => {
    const token = localStorage.getItem("tb_token");
    if (!token) return;

    apiFetch("/auth/me")
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem("tb_user", JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ user: nextUser, token }) => {
    localStorage.setItem("tb_token", token);
    localStorage.setItem("tb_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    const data = await apiFetch("/auth/login", { method: "POST", body: payload });
    saveSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const data = await apiFetch("/auth/register", { method: "POST", body: payload });
    saveSession(data);
    return data.user;
  };

  const updateUser = async (payload) => {
    const data = await apiFetch("/users/me", { method: "PUT", body: payload });
    localStorage.setItem("tb_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUser, isAuthed: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

