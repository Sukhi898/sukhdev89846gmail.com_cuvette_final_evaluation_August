import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext({
  user: "",
  saveUser: () => {},
  logout: () => {},
  isLoading: true,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("userToken");
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const saveUser = useCallback((data) => {
    setUser(data);
    localStorage.setItem("userToken", data);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userToken");
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          user,
          saveUser,
          logout,
          isLoading,
        }),
        [user, saveUser, logout, isLoading]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
}
