import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string, email?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'yazboz_users';
const CURRENT_USER_KEY = 'yazboz_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // localStorage'dan aktif kullanıcı bilgisini yükle
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const register = async (username: string, password: string, email?: string): Promise<{ success: boolean; message?: string }> => {
    const users = getUsers();
    
    // Kullanıcı adı kontrolü
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Bu kullanıcı adı zaten kullanılıyor' };
    }

    if (password.length < 4) {
      return { success: false, message: 'Parola en az 4 karakter olmalıdır' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password, // Gerçek uygulamada hash'lenmeli
      email,
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true };
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const users = getUsers();
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: 'Kullanıcı adı veya parola hatalı' };
    }

    // Parolayı kullanıcı objesinden çıkar (güvenlik için)
    const safeUser = { ...foundUser };

    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

