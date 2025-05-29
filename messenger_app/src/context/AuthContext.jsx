import { createContext, useContext, useState, useEffect } from "react";
import { register, login, me, logout } from "../api";
import { registerSocketUser } from "../socket";
import socket from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await me();
      if (res?.user) {
        setUser(res.user);
        registerSocketUser(res.user.id);
        setIsLoggedOut(false); // Reset on successful fetch
      } else {
        setUser(null);
        setIsLoggedOut(false); // Reset if no user is found
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const registerUser = async (email, password) => {
    const res = await register({ email, password });
    if (res.success) {
      setUser(res.user);
      registerSocketUser(res.user.id);
      setIsLoggedOut(false);
    }
    return res;
  };

  const loginUser = async (email, password) => {
    const res = await login({ email, password });
    if (res.success) {
      setUser(res.user);
      registerSocketUser(res.user.id);
      setIsLoggedOut(false);
    }
    return res;
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setIsLoggedOut(true);
    socket.emit("logout", { userId: user?.id });
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, registerUser, loginUser, logoutUser, isLoggedOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);