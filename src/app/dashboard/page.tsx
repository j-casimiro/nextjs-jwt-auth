'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface ApiError {
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(errorMessage);
    console.error('API Error:', error);
  };

  const logout = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
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
      router.push('/login');
    } catch (err) {
      handleApiError(err);
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to the Dashboard
        </h1>
        <div className="flex items-center justify-center">
          <Button
            onClick={logout}
            className="bg-black hover:bg-black-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
