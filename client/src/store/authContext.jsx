import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext({
  user: null,
  saveUser: () => {},
  logout: () => {},
  isLoading: true,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(window.atob(base64));

      return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
      return true; 
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("userToken");
    if (savedUser) {
      if (isTokenExpired(savedUser)) {
        localStorage.removeItem("userToken");
        setUser(null);
      } else {
        setUser(savedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const saveUser = useCallback((token) => {
    setUser(token);
    localStorage.setItem("userToken", token);
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
