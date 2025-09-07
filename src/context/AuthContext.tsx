import React, { createContext, useContext, useState, useEffect } from 'react';
import { User} from '../types/index';
import { mockData } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Combine all mock users from the mockData file
  const allMockUsers = [
  ...(mockData.mockPatients|| []),
  ...(mockData.mockProviders|| [])
];
  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);



//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
    
//     // Use the combined mock user data from mockData.ts
//     const foundUser = mockData.mockUsers.find(u => u.email === email);
// //     console.log("============================================")
// //     console.log(allMockUsers)
// //         console.log(mockData.mockProviders)
// // console.log(allMockUsers.find(u => u.email))
// // console.log(email)
//     console.log("AuthContext: User found during login:", foundUser);
    
//     // Keep the password logic the same
//     if (foundUser && password === foundUser.password) {
//       setUser(foundUser);
//       localStorage.setItem('currentUser', JSON.stringify(foundUser));
//     } else {
//       throw new Error('Invalid credentials');
//     }

//     setIsLoading(false);
//   };



const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
  } finally {
    setIsLoading(false);
  }
};


  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);

    // Mock registration with a check for existing email
    const existingUser = allMockUsers.find(u => u.email === userData.email);
    if (existingUser) {
        throw new Error('Email already registered');
    }
    
    // Create a new user with a generated ID
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      age: userData.age!,
      role: userData.role!,
      phone: userData.phone,
      profileImage: userData.profileImage,
      date_of_birth: userData.date_of_birth,
      createdAt: new Date()
    };
    //make an api call
    //
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };
  console.log(mockData.mockUsers)

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isLoading }}>
  {children}
</AuthContext.Provider>

  );
};