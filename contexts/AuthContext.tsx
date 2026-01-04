import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthCredentials } from '@/lib/types';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      
      // In a real app, you would decode the token and get user info
      // For FakeStore API, we'll simulate user data
      const mockUser: User = {
        id: 1,
        email: 'john@gmail.com',
        username: 'johnd',
        password: 'm38rmF$',
        name: {
          firstname: 'John',
          lastname: 'Doe'
        },
        address: {
          city: 'kilcoole',
          street: '7835 new road',
          number: 3,
          zipcode: '12926-3874',
          geolocation: {
            lat: '-37.3159',
            long: '81.1496'
          }
        },
        phone: '1-570-236-7033'
      };
      
      setToken(response.data.token);
      setUser(mockUser);
      
      // Store in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const register = async (userData: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      
      // FakeStore API returns the created user
      setUser(response.data);
      
      // Auto login after registration
      await login({
        username: userData.username,
        password: userData.password,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};