'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const authToken = localStorage.getItem('admin-auth');
      const userEmail = localStorage.getItem('admin-email');
      const loginTime = localStorage.getItem('admin-login-time');

      if (authToken === 'true' && userEmail && loginTime) {
        // 检查登录是否过期 (24小时)
        const loginDate = new Date(loginTime);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - loginDate.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          // 登录已过期，清除状态
          localStorage.removeItem('admin-auth');
          localStorage.removeItem('admin-email');
          localStorage.removeItem('admin-login-time');
          router.push('/admin/login');
        }
      } else {
        // 未登录
        router.push('/admin/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}