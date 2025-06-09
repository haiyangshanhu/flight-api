import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('AuthService.isLoggedIn()', await AuthService.isLoggedIn());
        if (await AuthService.isLoggedIn()) {
          console.log('User is logged in');
          // Check if the token is valid
          const user = AuthService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);

      if (response.success) {
        // const user = AuthService.getCurrentUser();
        console.log('Login successful:', response.data);
        setCurrentUser({
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
