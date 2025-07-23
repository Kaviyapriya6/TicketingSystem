'use client';

import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  PencilIcon,
  XIcon,
  RefreshCwIcon,
  PrinterIcon,
  DownloadIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  ClipboardListIcon,
  CloudIcon
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TicketView({ ticketData }) {
  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const handleEdit = () => {
    router.push(`/tickets/edit/${ticketData._id}`);
  };

  const handleReopen = () => {
    console.log('Reopening ticket...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      // If you have a direct file URL
      if (ticketData.fileUrl) {
        // Method 1: Direct download using file URL
        const link = document.createElement('a');
        link.href = ticketData.fileUrl;
        link.download = ticketData.fileName || 'attachment';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Method 2: API call to get file blob
        const response = await fetch(`/api/tickets/${ticketData._id}/download`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // if using auth
          },
        });

        if (!response.ok) {
          throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = ticketData.fileName || 'attachment';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      // You might want to show a toast notification here
      alert('Failed to download file. Please try again.');
    }
  };

  const handleClose = () => {
    router.push('/tickets');
  };

  if (!ticketData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Ticket data is missing.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-lg text-white">
                <ClipboardListIcon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {ticketData.ticketId}
                  </h1>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(ticketData.status)
                  )}>
                    {ticketData.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Created {formatDate(ticketData.createdAt)} • Last updated {formatDate(ticketData.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={handlePrint}>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="text-red-600 hover:bg-red-50"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </Card>

        {/* Ticket Details */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Ticket Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(ticketData.status)
              )}>
                {ticketData.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Priority</p>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getPriorityColor(ticketData.priority)
              )}>
                {ticketData.priority}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Issue Type</p>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {ticketData.issueType}
              </span>
            </div>
          </div>
        </Card>

        {/* Customer Information */}
        <Card className="p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <UserIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Customer Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Customer ID</p>
              <p className="font-medium">{ticketData.customerId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Email</p>
              <div className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{ticketData.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Phone</p>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{ticketData.phone}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Issue Description */}
        <Card className="p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <ClipboardListIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Issue Description</h2>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Subject</p>
            <h3 className="text-xl font-medium text-gray-900">
              {ticketData.subject}
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-700 leading-relaxed">
              {ticketData.description}
            </p>
          </div>
        </Card>

        {/* Associated Emails */}
        {Array.isArray(ticketData.emails) && ticketData.emails.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">Associated Emails</h2>
            <div className="space-y-4">
              {ticketData.emails.map((email) => (
                <div key={email._id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">{email.subject}</h3>
                  <p className="text-sm text-gray-500">From: {email.from}</p>
                  <p className="text-sm text-gray-500">To: {email.to}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(email.createdAt).toLocaleString()}</p>
                  <p className="mt-2 text-gray-700">{email.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Attachments */}
        {ticketData.fileName && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">Attachments</h2>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <CloudIcon className="h-5 w-5 text-blue-600" />
                  <p className="font-medium">{ticketData.fileName}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}