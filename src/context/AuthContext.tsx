import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect, // Thêm useEffect
} from "react";
import { User } from "../type/types";
import { loginAdmin, getUserInfo } from "../service/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo.result.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("User not authenticated:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginAdmin(email, password);
      const userInfo = await getUserInfo();
      setIsAuthenticated(true);
      setUser(userInfo.data);
    } catch (e: any) {
      console.log(e);
      throw new Error(
        e?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
