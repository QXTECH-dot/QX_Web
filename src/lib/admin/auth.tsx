'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface AdminUser {
  email: string;
  role: string;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        // 如果不是在登录页面，重定向到登录页面
        if (window.location.pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      setError('Failed to verify authentication');
      setUser(null);
      if (window.location.pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, loading, error, logout, checkAuthStatus };
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};