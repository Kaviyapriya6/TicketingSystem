'use client';

import './globals.css';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#059669',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});



function AppContent({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Routes that should not show sidebar/navbar
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/unauthorized' , '/auth/forgot-password'];
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </Box>
    );
  }

  // For public routes (landing, auth pages), show full-width layout
  if (isPublicRoute) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        {children}
      </Box>
    );
  }

  if ((!loading && !isPublicRoute && !user) || (user && user.role !== 'superadmin' && !isPublicRoute)) {
    return null;
  }

  // For protected routes, show sidebar and navbar
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar />
        
        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
            backgroundColor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <AppContent>
              {children}
            </AppContent>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}