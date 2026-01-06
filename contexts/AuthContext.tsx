// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthCredentials } from '@/lib/types';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
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

// Demo users data - only for initial demo purposes
const DEMO_USERS: User[] = [
  {
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
  },
  {
    id: 2,
    email: 'morrison@gmail.com',
    username: 'mor_2314',
    password: '83r5^_',
    name: {
      firstname: 'David',
      lastname: 'Morrison'
    },
    address: {
      city: 'Cullman',
      street: 'Lovers Ln',
      number: 3327,
      zipcode: '29576-7873',
      geolocation: {
        lat: '40.3467',
        long: '-30.1310'
      }
    },
    phone: '1-570-236-7033'
  },
  {
    id: 3,
    email: 'kevin@gmail.com',
    username: 'kevinryan',
    password: 'kev02937@',
    name: {
      firstname: 'Kevin',
      lastname: 'Ryan'
    },
    address: {
      city: 'San Antonio',
      street: 'Prospect Rd',
      number: 332,
      zipcode: '78270',
      geolocation: {
        lat: '29.4572',
        long: '-98.5352'
      }
    },
    phone: '1-570-236-7033'
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(DEMO_USERS);
  const router = useRouter();

  useEffect(() => {
    // Load registered users from localStorage
    const loadRegisteredUsers = () => {
      const storedUsers = localStorage.getItem('registeredUsers');
      console.log('Stored registeredUsers from localStorage:', storedUsers);
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          setRegisteredUsers([...DEMO_USERS, ...parsedUsers]);
        } catch (error) {
          console.error('Error parsing registered users:', error);
        }
      }
    };

    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    console.log('Stored user from localStorage:', storedUser);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    loadRegisteredUsers();
    setLoading(false);
  }, []);

  const saveRegisteredUsers = (users: User[]) => {
    console.log('Saving registered users:', users);

    // Filter out demo users and save only registered ones
    const registeredOnly = users.filter(u => !DEMO_USERS.some(demo => demo.id === u.id));
    localStorage.setItem('registeredUsers', JSON.stringify(registeredOnly));

    // also save the full list for debugging
    localStorage.setItem('allUsersDebug', JSON.stringify(users));
  };

  const login = async (credentials: AuthCredentials) => {
    try {
      setLoading(true);

      console.log('Login attempt with:', credentials);
      console.log('Current registeredUsers:', registeredUsers);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user in registeredUsers (includes both demo and registered users)
      const foundUser = registeredUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Set user
      setUser(foundUser);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store session timestamp
      localStorage.setItem('session_start', Date.now().toString());
      
      // Redirect to home or profile
      router.push('/');
      
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('session_start');
    router.push('/login');
  };

  const register = async (userData: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if username already exists
      const existingUser = registeredUsers.find(u => u.username === userData.username);
      console.log('Existing user check:', existingUser);

      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Check if email already exists
      const existingEmail = registeredUsers.find(u => u.email === userData.email);
      if (existingEmail) {
        throw new Error('Email already registered');
      }
      
      // Create new user with next available ID
      const maxId = Math.max(...registeredUsers.map(u => u.id));
      const newId = maxId + 1;
      const newUser: User = {
        id: newId,
        ...userData
      };
      
      // Add new user to registered users
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      saveRegisteredUsers(updatedUsers);
      
      // Set user as logged in
      setUser(newUser);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('session_start', Date.now().toString());

      console.log('Registration successful, redirecting...');
      
      // Redirect to profile
      router.push('/');
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...userData };
      
      // Update state
      setUser(updatedUser);
      
      // Update registeredUsers array
      const updatedUsers = registeredUsers.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      );
      setRegisteredUsers(updatedUsers);
      saveRegisteredUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        loading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};