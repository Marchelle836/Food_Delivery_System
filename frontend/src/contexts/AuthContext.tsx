import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginRequest } from '../types/auth';
import { login as loginService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        console.log('🔄 Initializing authentication...');
        const authenticated = isAuthenticated();
        const user = getCurrentUser();
        
        console.log('🔐 Auth initialization:');
        console.log('   - authenticated:', authenticated);
        console.log('   - user:', user);
        
        if (authenticated) {
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
          });
          console.log('✅ Auth initialized: User is authenticated');
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
          console.log('❌ Auth initialized: User is NOT authenticated');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      console.log('🔄 AuthContext: Starting login process...');
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await loginService(credentials);
      
      console.log('✅ AuthContext: Login successful, updating state');
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('❌ AuthContext: Login failed', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = (): void => {
    console.log('🚪 AuthContext: Logging out...');
    logoutService();
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};