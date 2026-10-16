import { createContext, useContext, useState } from "react";
import * as api from "../api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("fo_user") || "null"));

  const persist = (u) => { setUser(u); u ? localStorage.setItem("fo_user", JSON.stringify(u)) : localStorage.removeItem("fo_user"); };
  const login = async (data) => persist(await api.login(data));
  const register = async (data) => persist(await api.register(data));
  const logout = () => persist(null);

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
