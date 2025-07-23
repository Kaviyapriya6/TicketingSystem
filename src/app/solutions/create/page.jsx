'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import EditorPage from '../../../components/SolutionForm'; // Your form component
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from 'react';

const CreateSolutionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const mode = searchParams.get('mode');
  const ticketId = searchParams.get('ticketId');

  console.log('Solution create page - returnUrl:', returnUrl);
  console.log('Solution create page - mode:', mode);
  console.log('Solution create page - ticketId:', ticketId);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'default',
  });

  const addSolution = async (formData) => {
    const res = await fetch('/api/solution', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create solution');
    }

    return await res.json();
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await addSolution(formData);
      console.log('Solution created successfully:', result);

      setNotification({
        open: true,
        message: 'Solution created successfully!',
        type: 'default',
      });

      setTimeout(() => {
        if (returnUrl) {
          const decodedReturnUrl = decodeURIComponent(returnUrl);
          const separator = decodedReturnUrl.includes('?') ? '&' : '?';
          const redirectUrl = `${decodedReturnUrl}${separator}solutionId=${result._id}&solutionTitle=${encodeURIComponent(result.title)}`;
          router.push(redirectUrl);
        } else {
          router.push('/solution');
        }
      }, 1500);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Failed to create solution. Please try again.',
        type: 'destructive',
      });
    }
  };

  return (
    <div className="p-6">
      <EditorPage onSubmit={handleSubmit} mode={mode} ticketId={ticketId} />

      {notification.open && (
        <Alert
          variant={notification.type}
          className="fixed top-4 right-4 max-w-md z-50"
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CreateSolutionPage;
