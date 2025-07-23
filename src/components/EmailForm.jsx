'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast";
import {
  Plus,
  X,
  Send,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link2
} from 'lucide-react';

const EmailForm = ({ onSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: 'ihub (support@smsgroup-support.freshdesk.com)',
    to: '',
    cc: [],
    bcc: [],
    subject: '',
    description: '',
    priority: 'Low',
    status: 'Open',
    tags: '',
    group: '',
    type: '',
    referenceNumber: '',
    sendAnother: false,
    attachments: []
  });

  const [showMoreFields, setShowMoreFields] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'default'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email?.trim());
  };

  const validateForm = () => {
    const errors = {};

    // Required field validations
    if (!formData.to?.trim()) {
      errors.to = 'Recipient email is required';
    } else if (!validateEmail(formData.to)) {
      errors.to = 'Please enter a valid email address';
    }

    if (!formData.subject?.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters long';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    // Validate CC emails
    const invalidCcEmails = formData.cc.filter(email => !validateEmail(email));
    if (invalidCcEmails.length > 0) {
      errors.cc = `Invalid CC emails: ${invalidCcEmails.join(', ')}`;
    }

    // Validate BCC emails
    const invalidBccEmails = formData.bcc.filter(email => !validateEmail(email));
    if (invalidBccEmails.length > 0) {
      errors.bcc = `Invalid BCC emails: ${invalidBccEmails.join(', ')}`;
    }

    // Validate tags format
    if (formData.tags?.trim()) {
      const tags = formData.tags.split(',').map(tag => tag.trim());
      const invalidTags = tags.filter(tag => tag.length > 0 && (tag.length < 2 || tag.length > 20));
      if (invalidTags.length > 0) {
        errors.tags = 'Each tag must be between 2-20 characters';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real-time validation for touched fields
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const errors = {};
      
      if (touched.to) {
        if (!formData.to?.trim()) {
          errors.to = 'Recipient email is required';
        } else if (!validateEmail(formData.to)) {
          errors.to = 'Please enter a valid email address';
        }
      }

      if (touched.subject) {
        if (!formData.subject?.trim()) {
          errors.subject = 'Subject is required';
        } else if (formData.subject.trim().length < 3) {
          errors.subject = 'Subject must be at least 3 characters long';
        }
      }

      if (touched.description) {
        if (!formData.description?.trim()) {
          errors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
          errors.description = 'Description must be at least 10 characters long';
        }
      }

      setValidationErrors(prev => {
        // Only update if there are actual changes
        const newErrors = { ...prev };
        Object.keys(errors).forEach(key => {
          if (errors[key] !== newErrors[key]) {
            newErrors[key] = errors[key];
          }
        });
        
        // Clear errors for fields that are now valid
        Object.keys(newErrors).forEach(key => {
          if (!errors[key] && touched[key]) {
            newErrors[key] = '';
          }
        });
        
        return newErrors;
      });
    }
  }, [formData.to, formData.subject, formData.description, touched]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSelectChange = (field) => (value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      sendAnother: checked
    });
  };

  const handleAddCc = () => {
    if (ccInput.trim()) {
      if (!validateEmail(ccInput.trim())) {
        setNotification({
          open: true,
          message: 'Please enter a valid email address',
          type: 'error'
        });
        return;
      }
      
      if (!formData.cc.includes(ccInput.trim())) {
        setFormData({
          ...formData,
          cc: [...formData.cc, ccInput.trim()]
        });
        setCcInput('');
        // Clear CC validation errors
        setValidationErrors(prev => ({ ...prev, cc: '' }));
      } else {
        setNotification({
          open: true,
          message: 'Email already added to CC',
          type: 'warning'
        });
      }
    }
  };

  const handleAddBcc = () => {
    if (bccInput.trim()) {
      if (!validateEmail(bccInput.trim())) {
        setNotification({
          open: true,
          message: 'Please enter a valid email address',
          type: 'error'
        });
        return;
      }
      
      if (!formData.bcc.includes(bccInput.trim())) {
        setFormData({
          ...formData,
          bcc: [...formData.bcc, bccInput.trim()]
        });
        setBccInput('');
        // Clear BCC validation errors
        setValidationErrors(prev => ({ ...prev, bcc: '' }));
      } else {
        setNotification({
          open: true,
          message: 'Email already added to BCC',
          type: 'warning'
        });
      }
    }
  };

  const handleRemoveCc = (emailToRemove) => {
    setFormData({
      ...formData,
      cc: formData.cc.filter(email => email !== emailToRemove)
    });
  };

  const handleRemoveBcc = (emailToRemove) => {
    setFormData({
      ...formData,
      bcc: formData.bcc.filter(email => email !== emailToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    setTouched({
      to: true,
      subject: true,
      description: true,
      priority: true,
      status: true
    });

    if (!validateForm()) {
      setNotification({
        open: true,
        message: 'Please fix the validation errors before submitting',
        type: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for API
      const submissionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Send to your API
      const response = await fetch('/api/Email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      // Check if response is ok first
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to send email.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // If both fail, use default message
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      let result;
      try {
        result = await response.json();
      } catch {
        // If the response is not JSON but was successful, that's still ok
        result = { success: true };
      }

      setNotification({
        open: true,
        message: 'Email sent successfully!',
        type: 'default'
      });

      if (!formData.sendAnother) {
        handleReset();
        // Navigate to email dashboard after successful creation
        router.push('/Email/Create');
        return;
      }

    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Failed to send email. Please try again.',
        type: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      from: 'ihub (support@smsgroup-support.freshdesk.com)',
      to: '',
      cc: [],
      bcc: [],
      subject: '',
      description: '',
      priority: 'Low',
      status: 'Open',
      tags: '',
      group: '',
      type: '',
      referenceNumber: '',
      sendAnother: false,
      attachments: []
    });
    setValidationErrors({});
    setTouched({});
    setShowMoreFields(false);
    setShowCc(false);
    setShowBcc(false);
    setCcInput('');
    setBccInput('');
  };

  const handleCancel = () => {
    handleReset();
  };

  const handleKeyPress = (callback) => (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Check if form has validation errors (only show errors that aren't empty)
  const hasValidationErrors = Object.keys(validationErrors).some(key => validationErrors[key]);

  return (
    <ToastProvider>
      <div className="max-w-[900px] mx-auto p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Create Email
          </h1>

          {/* Header Info */}
          <Alert variant="info" className="mb-6">
            <AlertDescription>
              When you hit send, the contact will receive an email and it will be associated with them.{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Learn more
              </a>
            </AlertDescription>
          </Alert>

          {/* Validation Summary */}
          {hasValidationErrors && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold">
                  Please fix the following errors before submitting:
                </p>
                <ul className="mt-2 ml-5 list-disc">
                  {Object.entries(validationErrors).map(([field, error]) => 
                    error && (
                      <li key={field} className="text-sm mb-1">
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {error}
                      </li>
                    )
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* From Field */}
            <div className="mb-6">
              <Label>From</Label>
              <Select
                value={formData.from}
                onValueChange={handleSelectChange('from')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ihub (support@smsgroup-support.freshdesk.com)">
                    ihub (support@smsgroup-support.freshdesk.com)
                  </SelectItem>
                  <SelectItem value="admin (admin@smsgroup-support.freshdesk.com)">
                    admin (admin@smsgroup-support.freshdesk.com)
                  </SelectItem>
                  <SelectItem value="noreply (noreply@smsgroup-support.freshdesk.com)">
                    noreply (noreply@smsgroup-support.freshdesk.com)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* To Field */}
            <div className="mb-6">
              <Label>To *</Label>
              <Input
                value={formData.to}
                onChange={handleChange('to')}
                onBlur={handleBlur('to')}
                placeholder="Enter recipient email address"
                error={validationErrors.to}
              />
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowCc(!showCc)}
                >
                  {showCc ? 'Hide Cc' : 'Add Cc'}
                </button>
                <span className="text-slate-400">|</span>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowBcc(!showBcc)}
                >
                  {showBcc ? 'Hide Bcc' : 'Add Bcc'}
                </button>
              </div>
            </div>

            {/* CC Field */}
            {showCc && (
              <div className="mb-6">
                <Label>Cc</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={ccInput}
                    onChange={(e) => setCcInput(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={handleKeyPress(handleAddCc)}
                    error={validationErrors.cc}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCc}
                    disabled={!ccInput.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.cc.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.cc.map((email, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50"
                      >
                        {email}
                        <button
                          type="button"
                          className="ml-1 hover:text-red-500"
                          onClick={() => handleRemoveCc(email)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BCC Field */}
            {showBcc && (
              <div className="mb-6">
                <Label>Bcc</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={bccInput}
                    onChange={(e) => setBccInput(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={handleKeyPress(handleAddBcc)}
                    error={validationErrors.bcc}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddBcc}
                    disabled={!bccInput.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.bcc.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.bcc.map((email, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-slate-50"
                      >
                        {email}
                        <button
                          type="button"
                          className="ml-1 hover:text-red-500"
                          onClick={() => handleRemoveBcc(email)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subject Field */}
            <div className="mb-6">
              <Label>Subject *</Label>
              <Input
                value={formData.subject}
                onChange={handleChange('subject')}
                onBlur={handleBlur('subject')}
                placeholder="Enter subject"
                error={validationErrors.subject}
                maxLength={100}
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.subject.length}/100 characters
              </p>
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <Label>Description *</Label>
              <RichTextEditor
                value={formData.description}
                onChange={handleChange('description')}
                onBlur={handleBlur('description')}
                placeholder="Enter detailed description of the issue..."
                error={validationErrors.description}
                maxLength={2000}
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* Priority and Status Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={handleSelectChange('priority')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleSelectChange('status')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Field */}
            <div className="mb-6">
              <Label>Tags</Label>
              <Input
                value={formData.tags}
                onChange={handleChange('tags')}
                placeholder="Enter tags separated by commas (e.g., bug, urgent, ui)"
                error={validationErrors.tags}
              />
              <p className="mt-1 text-xs text-slate-500">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Show More Fields Link */}
            <div className="mb-6">
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm flex items-center"
                onClick={() => setShowMoreFields(!showMoreFields)}
              >
                {showMoreFields ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show fewer fields
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show more fields
                  </>
                )}
              </button>
            </div>

            {/* Additional Fields */}
            {showMoreFields && (
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Group</Label>
                    <Select
                      value={formData.group}
                      onValueChange={handleSelectChange('group')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical Support">Technical Support</SelectItem>
                        <SelectItem value="Customer Service">Customer Service</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                        <SelectItem value="Account Management">Account Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleSelectChange('type')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bug Report">Bug Report</SelectItem>
                        <SelectItem value="Feature Request">Feature Request</SelectItem>
                        <SelectItem value="Question">Question</SelectItem>
                        <SelectItem value="Complaint">Complaint</SelectItem>
                        <SelectItem value="Feedback">Feedback</SelectItem>
                        <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                        <SelectItem value="Account Issue">Account Issue</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Label>Reference Number</Label>
                    <Input
                      value={formData.referenceNumber}
                      onChange={handleChange('referenceNumber')}
                      placeholder="Enter reference number if applicable (e.g., existing ticket ID)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendAnother"
                  checked={formData.sendAnother}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="sendAnother" className="text-sm">
                  Send another email after this one
                </Label>
              </div>
              
              <div className="ml-auto flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Toast Notifications */}
        <ToastViewport />
        {notification.open && (
          <Toast
            variant={notification.type}
            onOpenChange={(open) => {
              if (!open) closeNotification();
            }}
          >
            <div className="flex">
              {notification.type === 'default' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : notification.type === 'destructive' ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
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

export default EmailForm;
