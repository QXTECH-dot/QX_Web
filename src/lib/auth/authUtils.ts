import { useState, useEffect } from 'react';

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  favorites: {
    companies: string[];
    states: string[];
  };
  createdAt: string;
  lastLogin: string;
}

// Local storage keys
const USER_KEY = 'qxnet_user';
const AUTH_TOKEN_KEY = 'qxnet_auth_token';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
};

// Get the current user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Login user
export const loginUser = (email: string, password: string): Promise<User> => {
  // This is a mock function for demo purposes
  // In a real app, this would call an API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful login
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 15),
          email,
          name: email.split('@')[0],
          favorites: {
            companies: [],
            states: [],
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Store user in localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${mockUser.id}`);

        resolve(mockUser);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

// Register user
export const registerUser = (name: string, email: string, password: string): Promise<User> => {
  // This is a mock function for demo purposes
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful registration
      if (name && email && password.length >= 6) {
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 15),
          email,
          name,
          favorites: {
            companies: [],
            states: [],
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Store user in localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${mockUser.id}`);

        resolve(mockUser);
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 1000);
  });
};

// Logout user
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Add a company to favorites
export const addCompanyToFavorites = (companyId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getCurrentUser();
  if (!user) return false;

  if (!user.favorites.companies.includes(companyId)) {
    user.favorites.companies.push(companyId);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return true;
};

// Remove a company from favorites
export const removeCompanyFromFavorites = (companyId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getCurrentUser();
  if (!user) return false;

  user.favorites.companies = user.favorites.companies.filter(id => id !== companyId);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return true;
};

// Add a state to favorites
export const addStateToFavorites = (stateId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getCurrentUser();
  if (!user) return false;

  if (!user.favorites.states.includes(stateId)) {
    user.favorites.states.push(stateId);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return true;
};

// Remove a state from favorites
export const removeStateFromFavorites = (stateId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getCurrentUser();
  if (!user) return false;

  user.favorites.states = user.favorites.states.filter(id => id !== stateId);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return true;
};

// Check if a company is in favorites
export const isCompanyFavorite = (companyId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getCurrentUser();
  if (!user) return false;

  return user.favorites.companies.includes(companyId);
};

// Check if a state is in favorites
export const isStateFavorite = (stateId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getCurrentUser();
  if (!user) return false;

  return user.favorites.states.includes(stateId);
};

// Get all favorite companies
export const getFavoriteCompanies = (): string[] => {
  if (typeof window === 'undefined') return [];

  const user = getCurrentUser();
  if (!user) return [];

  return user.favorites.companies;
};

// Get all favorite states
export const getFavoriteStates = (): string[] => {
  if (typeof window === 'undefined') return [];

  const user = getCurrentUser();
  if (!user) return [];

  return user.favorites.states;
};

// Custom hook to use authentication
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await loginUser(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const user = await registerUser(name, email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const toggleCompanyFavorite = (companyId: string) => {
    if (!user) return false;

    if (isCompanyFavorite(companyId)) {
      const success = removeCompanyFromFavorites(companyId);
      if (success) {
        setUser(getCurrentUser());
      }
      return success;
    } else {
      const success = addCompanyToFavorites(companyId);
      if (success) {
        setUser(getCurrentUser());
      }
      return success;
    }
  };

  const toggleStateFavorite = (stateId: string) => {
    if (!user) return false;

    if (isStateFavorite(stateId)) {
      const success = removeStateFromFavorites(stateId);
      if (success) {
        setUser(getCurrentUser());
      }
      return success;
    } else {
      const success = addStateToFavorites(stateId);
      if (success) {
        setUser(getCurrentUser());
      }
      return success;
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    toggleCompanyFavorite,
    toggleStateFavorite,
    isCompanyFavorite,
    isStateFavorite,
    getFavoriteCompanies,
    getFavoriteStates
  };
};
