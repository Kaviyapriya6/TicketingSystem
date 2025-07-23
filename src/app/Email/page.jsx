'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import {
  Mail,
  MoreVertical,
  ChevronDown,
  Headphones,
  SmilePlus,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  RefreshCw,
  Trash2,
  PencilLine,
  Loader2
} from 'lucide-react';

const EmailList = () => {
  const router = useRouter();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'default' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/email', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch emails`);
      }
      
      const data = await response.json();
      setEmails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch emails error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleEditClick = (email) => {
    try {
      console.log('Editing email:', email);
      router.push(`/Email/edit/${email._id}`);
    } catch (err) {
      console.error('Edit navigation error:', err);
      showNotification('Failed to navigate to edit page', 'destructive');
    }
  };

  const handleDeleteClick = (email) => {
    console.log('Delete clicked for email:', email);
    setEmailToDelete(email);
    setConfirmDelete(true);
  };

  const deleteEmail = async (id) => {
    try {
      setActionLoading(true);
      console.log('Deleting email with ID:', id);
      
      const response = await fetch(`/api/email/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Delete request failed`);
      }

      setEmails(prev => prev.filter(t => t._id !== id));
      setSelectedEmails(prev => prev.filter(emailId => emailId !== id));
      showNotification('Email deleted successfully', 'default');
    } catch (err) {
      console.error('Delete email error:', err);
      showNotification(`Failed to delete email: ${err.message}`, 'destructive');
    } finally {
      setActionLoading(false);
    }
  };

  const updateEmailField = async (emailId, field, value) => {
    try {
      setUpdatingEmail(emailId);
      
      const response = await fetch(`/api/email/${emailId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: value })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Update request failed`);
      }

      setEmails(prev => prev.map(email => 
        email._id === emailId 
          ? { ...email, [field]: value }
          : email
      ));
      
      showNotification(`Email ${field} updated successfully`, 'default');
    } catch (err) {
      console.error('Update email error:', err);
      showNotification(`Failed to update email: ${err.message}`, 'destructive');
    } finally {
      setUpdatingEmail(null);
    }
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmails(emails.map(email => email._id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleConfirmDelete = async () => {
    if (emailToDelete) {
      await deleteEmail(emailToDelete._id);
      setConfirmDelete(false);
      setEmailToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setEmailToDelete(null);
  };

  const showNotification = (message, type = 'default') => {
    setNotification({ show: true, message, type });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      case 'urgent': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const generateAvatarColor = (name) => {
    const colors = ['bg-sky-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-purple-500'];
    return colors[(name?.length || 0) % colors.length];
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 60) return `${minutes} minutes ago`;
      if (hours < 24) return `${hours} hours ago`;
      return `${days} days ago`;
    } catch {
      return 'Unknown';
    }
  };

  const handleCreateEmail = () => {
    // router.push('/Email/create');
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">
                Emails ({emails.length})
              </h2>
              <p className="text-sm text-slate-500">
                Manage your email communications
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchEmails}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateEmail}>
              Create Email
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center gap-2 p-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading emails...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!loading && emails.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">
            No emails found.
          </p>
          <Button
            variant="outline"
            onClick={handleCreateEmail}
          >
            Create your first email
          </Button>
        </div>
      )}

      {/* Email List */}
      {emails.length > 0 && (
        <Card>
          {/* Select All Header */}
          <div className="p-4 border-b">
            <div className="flex items-center">
              <Checkbox
                checked={selectedEmails.length === emails.length}
                onCheckedChange={handleSelectAll}
              />
              {selectedEmails.length > 0 && (
                <span className="ml-2 text-sm">
                  {selectedEmails.length} selected
                </span>
              )}
            </div>
          </div>

          {/* Email Items */}
          <div className="divide-y">
            {emails.map((email) => (
              <div
                key={email._id}
                className="p-4 hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedEmails.includes(email._id)}
                    onCheckedChange={() => handleSelectEmail(email._id)}
                    className="mr-4"
                  />

                  <div className="flex items-center flex-1">
                    {/* Avatar */}
                    <Avatar className={`h-8 w-8 mr-4 ${generateAvatarColor(email.subject || email.to)}`}>
                      <span className="text-xs">
                        {getInitials(email.subject || email.to || 'Email')}
                      </span>
                    </Avatar>

                    {/* Email Details */}
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium mr-2">
                          {email.subject || 'No Subject'}
                        </h3>
                        <span className="text-sm text-slate-500">
                          #{email._id?.slice(-6) || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 text-sm text-slate-500">
                        <User className="h-4 w-4" />
                        <span>From: {email.from || 'Unknown'}</span>
                        <span>• To: {email.to || 'Unknown'}</span>
                        <span>• Created: {formatDate(email.createdAt)}</span>
                        {email.updatedAt && (
                          <span>• Updated: {formatDate(email.updatedAt)}</span>
                        )}
                      </div>

                      {/* Tags */}
                      {email.tags && email.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {email.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-4">
                      {/* Priority */}
                      <Select
                        value={email.priority || 'Low'}
                        onValueChange={(value) => updateEmailField(email._id, 'priority', value)}
                        disabled={updatingEmail === email._id}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Status */}
                      <Select
                        value={email.status || 'Open'}
                        onValueChange={(value) => updateEmailField(email._id, 'status', value)}
                        disabled={updatingEmail === email._id}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(email)}
                          disabled={actionLoading}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(email)}
                          disabled={actionLoading}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete email <strong>{emailToDelete?.subject || 'this email'}</strong>? 
              This action cannot be undone and will permanently remove the email and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification */}
      {notification.show && (
        <Alert
          variant={notification.type}
          className="fixed top-4 right-4 max-w-md z-50"
          onClose={() => setNotification({ ...notification, show: false })}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmailList;