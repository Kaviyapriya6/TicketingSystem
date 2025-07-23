'use client';

import './globals.css';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';

function AppContent({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Routes that should not show sidebar/navbar
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/unauthorized', '/auth/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Combined redirect logic for unauthorized or unauthenticated users
  useEffect(() => {
    if (!loading && !isPublicRoute && !user) {
      router.replace('/');
    } else if (!loading && user && user.role !== 'superadmin' && !isPublicRoute) {
      router.replace('/unauthorized');
    }
    // eslint-disable-next-line
  }, [user, loading, isPublicRoute]);

  // Show loading state while checking authentication
  if (loading && !isPublicRoute) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // For public routes (landing, auth pages), show full-width layout
  if (isPublicRoute) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  if ((!loading && !isPublicRoute && !user) || (user && user.role !== 'superadmin' && !isPublicRoute)) {
    return null;
  }

  // For protected routes, show sidebar and navbar
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar />
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <AppContent>
            {children}
          </AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}