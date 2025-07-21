"use client";
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f9fafb' }}>
      <Typography variant="h3" color="error" gutterBottom>
        Unauthorized
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You do not have permission to access this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/')}>Go to Home</Button>
    </Box>
  );
}
