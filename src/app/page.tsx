'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-5xl font-bold text-gray-800">Welcome to Our App</h1>
        <p className="text-gray-600 text-lg">
          This is a modern platform to help you get started quickly. Please log
          in to access your dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Button variant="outline" disabled>
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
}
