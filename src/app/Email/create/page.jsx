'use client';

import { useRouter } from 'next/navigation';
import EmailForm from '../../../components/EmailForm';
import { ToastProvider, ToastViewport, Toast, ToastDescription, ToastClose } from "@/components/ui/toast";
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const CreateEmailPage = () => {
  const router = useRouter();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'default'
  });

  const addEmail = async (formData) => {
    const res = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create email');
    }

    return await res.json();
  };

  const handleSubmit = async (formData) => {
    try {
      await addEmail(formData);
      setNotification({
        open: true,
        message: 'Email created successfully!',
        type: 'default',
      });

      setTimeout(() => {
        router.push('/Email');
      }, 1500);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Failed to create email. Please try again.',
        type: 'destructive',
      });
    }
  };

  return (
    <ToastProvider>
      <div className="p-6">
        <EmailForm onSubmit={handleSubmit} />

        {/* Toast Notifications */}
        <ToastViewport />
        {notification.open && (
          <Toast
            variant={notification.type}
            onOpenChange={(open) => {
              if (!open) setNotification({ ...notification, open: false });
            }}
          >
            <div className="flex">
              {notification.type === 'default' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <ToastDescription className="ml-2">
                {notification.message}
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        )}
      </div>
    </ToastProvider>
  );
};

export default CreateEmailPage;
