'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { validateAndRefreshToken } from '@/lib/auth';
import { useAuthStore } from '@/store/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface ApiError {
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleApiError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(errorMessage);
    console.error('API Error:', error);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await validateAndRefreshToken();
      if (!token) {
        clearUser();
        router.push('/login');
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, clearUser]);

  const logout = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      clearUser();
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = (await res.json()) as ApiError;
        throw new Error(errorData.message || 'Failed to logout');
      }

      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      clearUser();
      router.push('/login');
    } catch (err) {
      handleApiError(err);
      clearUser();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to the Dashboard{user?.name ? `, ${user.name}` : ''}
        </h1>
        <div className="flex items-center justify-center">
          <Button
            onClick={logout}
            className="bg-black hover:bg-black/90 text-white px-6 py-2 rounded-md transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
