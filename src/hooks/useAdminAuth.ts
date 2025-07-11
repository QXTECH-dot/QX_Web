'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
}

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = () => {
    if (typeof window === 'undefined') {
      return { isValid: false };
    }
    
    const isAuth = localStorage.getItem('admin-auth') === 'true';
    const userEmail = localStorage.getItem('admin-email');
    const loginTime = localStorage.getItem('admin-login-time');
    
    if (isAuth && userEmail && loginTime) {
      // 检查登录是否过期 (24小时)
      const loginDate = new Date(loginTime);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - loginDate.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      
      if (hoursDiff < 24) {
        return { isValid: true, email: userEmail };
      } else {
        // 登录已过期，清除状态
        localStorage.removeItem('admin-auth');
        localStorage.removeItem('admin-email');
        localStorage.removeItem('admin-login-time');
        return { isValid: false };
      }
    }
    return { isValid: false };
  };

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-auth');
      localStorage.removeItem('admin-email');
      localStorage.removeItem('admin-login-time');
    }
    setUser(null);
  };

  const login = (email: string, password: string): boolean => {
    const ADMIN_CREDENTIALS = {
      email: 'info@qixin.com.au',
      password: 'qixin@782540'
    };

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-auth', 'true');
        localStorage.setItem('admin-email', email);
        localStorage.setItem('admin-login-time', new Date().toISOString());
      }
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  useEffect(() => {
    const authResult = isAuthenticated();
    if (authResult.isValid) {
      setUser({ email: authResult.email! });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };
}