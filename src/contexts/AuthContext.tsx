
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: string;
  email: string;
  name?: string;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthState = async () => {
      try {
        // Here you would check if the user is authenticated
        // const { data: { user } } = await supabase.auth.getUser();
        
        // Mock authentication check
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    // Here you would implement your actual login logic
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    
    // For now, let's mock a successful login
    const mockUser = { id: "123", email };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string) => {
    // Here you would implement your actual registration logic
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });
    
    // For now, let's mock a successful registration
    const mockUser = { id: "123", email };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = async () => {
    // Here you would implement your actual logout logic
    // await supabase.auth.signOut();
    
    // For now, let's mock a successful logout
    setUser(null);
    localStorage.removeItem("user");
  };

  const requestPasswordReset = async (email: string) => {
    // Here you would implement your actual password reset request logic
    // await supabase.auth.resetPasswordForEmail(email);
    
    // For now, let's just simulate a successful request
    console.log(`Password reset email sent to ${email}`);
  };

  const resetPassword = async (password: string) => {
    // Here you would implement your actual password reset logic
    // await supabase.auth.updateUser({ password });
    
    // For now, let's just simulate a successful password reset
    console.log("Password reset successfully");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
