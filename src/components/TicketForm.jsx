'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Paperclip,
  X,
  Save,
  Upload,
  Clock,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

export default function TicketForm({ initialValues, onSubmit, mode = 'create' }) {
  const router = useRouter();
  const [fileName, setFileName] = useState(initialValues?.fileName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherIssueType, setShowOtherIssueType] = useState(false);
  const [otherIssueType, setOtherIssueType] = useState('');
  const [contacts, setContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);

  // Fetch contacts for dropdown and handle new contact from URL
  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data || []);
        const urlParams = new URLSearchParams(window.location.search);
        const newContactId = urlParams.get('contactId');
        if (newContactId && data) {
          formik.setFieldValue('contact', newContactId);
          const found = data.find(c => c._id === newContactId);
          if (found) {
            formik.setFieldValue('email', found.email || '');
            formik.setFieldValue('phone', found.phone || '');
          }
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      });
  }, []);

  const validationSchema = Yup.object({
    contact: Yup.string()
      .required('Contact is required')
      .min(3, 'Contact must be at least 3 characters')
      .max(50, 'Contact must not exceed 50 characters'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    issueType: Yup.string()
      .required('Issue type is required')
      .min(3, 'Issue type must be at least 3 characters')
      .max(100, 'Issue type must not exceed 100 characters'),
    priority: Yup.string()
      .required('Priority is required')
      .oneOf(['Low', 'Medium', 'High'], 'Please select a valid priority level'),
    subject: Yup.string()
      .required('Subject is required')
      .min(5, 'Subject must be at least 5 characters')
      .max(200, 'Subject must not exceed 200 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(2000, 'Description must not exceed 2000 characters'),
    file: Yup.mixed().nullable()
  });

  const formik = useFormik({
    initialValues: initialValues || {
      contact: '',
      email: '',
      phone: '',
      ticketId: '',
      issueType: '',
      priority: '',
      status: mode === 'create' ? 'Open' : '',
      subject: '',
      description: '',
      file: null
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const submissionValues = {
          ...values,
          status: mode === 'create' ? 'Open' : values.status
        };

        if (onSubmit) {
          await onSubmit({ ...submissionValues, fileName });
          return;
        }

        const { file, ...payloadData } = submissionValues;
        const payload = { ...payloadData, fileName };
        const url = mode === 'create' ? '/api/tickets' : `/api/tickets/${values._id}`;
        const method = mode === 'create' ? 'POST' : 'PUT';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to save ticket');
        }

        alert('Ticket saved successfully!');
        router.push('/tickets');
      } catch (err) {
        console.error('Error saving ticket:', err);
        alert(`Error saving ticket: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Only images, PDFs, and documents are allowed');
        return;
      }
      
      setFileName(file.name);
      formik.setFieldValue('file', file);
    }
  };

  const handleIssueTypeChange = (value) => {
    if (value === 'Other') {
      setShowOtherIssueType(true);
      formik.setFieldValue('issueType', '');
    } else {
      setShowOtherIssueType(false);
      setOtherIssueType('');
      formik.setFieldValue('issueType', value);
    }
  };

  const handleOtherIssueTypeChange = (e) => {
    const value = e.target.value;
    setOtherIssueType(value);
    formik.setFieldValue('issueType', value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="p-6">
        <div className="space-y-8">
          {/* Customer Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Customer Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>Contact *</Label>
                <Select
                  value={formik.values.contact || "none"}
                  onValueChange={value => {
                    if (value === "none") {
                      formik.setFieldValue('contact', '');
                      setShowAddContact(true);
                    } else {
                      formik.setFieldValue('contact', value);
                      const found = contacts.find(c => c._id === value);
                      if (found) {
                        formik.setFieldValue('email', found.email || '');
                        formik.setFieldValue('phone', found.phone || '');
                        setShowAddContact(false);
                      }
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select contact</SelectItem>
                    {contacts.map(contact => (
                      <SelectItem key={contact._id} value={contact._id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {contact.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{contact.name}</p>
                            <p className="text-xs text-slate-500">{contact.email}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.contact && formik.errors.contact && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.contact}</p>
                )}
                {showAddContact && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                      router.push(`/contacts/create?returnUrl=${returnUrl}`);
                    }}
                  >
                    Add New Contact
                  </Button>
                )}
              </div>

              <div>
                <Label>Ticket ID</Label>
                <Input
                  value={formik.values.ticketId || ''}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formik.values.email || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="agent@company.com"
                  error={formik.touched.email && formik.errors.email}
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  name="phone"
                  value={formik.values.phone || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="10-digit phone number"
                  error={formik.touched.phone && formik.errors.phone}
                />
              </div>
            </div>
          </div>

          {/* Issue Details Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Issue Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label>Subject *</Label>
                <Input
                  name="subject"
                  value={formik.values.subject || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Brief summary of the issue"
                  error={formik.touched.subject && formik.errors.subject}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>Issue Type *</Label>
                  <Select
                    value={showOtherIssueType ? 'Other' : (formik.values.issueType || "none")}
                    onValueChange={handleIssueTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select issue type</SelectItem>
                      <SelectItem value="Technical">Technical Issue</SelectItem>
                      <SelectItem value="Billing">Billing Issue</SelectItem>
                      <SelectItem value="Account">Account Issue</SelectItem>
                      <SelectItem value="General">General Inquiry</SelectItem>
                      <SelectItem value="Bug Report">Bug Report</SelectItem>
                      <SelectItem value="Feature Request">Feature Request</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.issueType && formik.errors.issueType && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.issueType}</p>
                  )}
                  
                  {showOtherIssueType && (
                    <Input
                      className="mt-2"
                      value={otherIssueType}
                      onChange={handleOtherIssueTypeChange}
                      onBlur={formik.handleBlur}
                      placeholder="Please specify the issue type"
                      error={formik.touched.issueType && formik.errors.issueType}
                    />
                  )}
                </div>

                <div>
                  <Label>Priority Level *</Label>
                  <Select
                    value={formik.values.priority || "none"}
                    onValueChange={(value) => formik.setFieldValue('priority', value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select priority</SelectItem>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Low</Badge>
                          <span>Low Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">Med</Badge>
                          <span>Medium Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="High">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">High</Badge>
                          <span>High Priority</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.priority && formik.errors.priority && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.priority}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Detailed Description *</Label>
                <Textarea
                  name="description"
                  value={formik.values.description || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Provide a comprehensive description of the issue..."
                  className="min-h-[120px]"
                  error={formik.touched.description && formik.errors.description}
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Attachments
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Upload files to help describe your issue (Optional)
            </p>
            
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors">
              <Upload className="h-10 w-10 text-slate-400 mx-auto mb-4" />
              <h3 className="text-base font-medium text-slate-900 mb-1">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Maximum file size: 5MB
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Supported: JPG, PNG, GIF, PDF, DOC, DOCX, TXT
              </p>
              <Button
                variant="outline"
                asChild
              >
                <label className="cursor-pointer">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Choose Files
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </Button>
              
              {fileName && (
                <Alert variant="success" className="mt-6 max-w-md mx-auto">
                  <AlertDescription>
                    Attached: {fileName}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Status Section (for edit mode) */}
          {mode === 'edit' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Status
              </h2>
              <div className="min-h-[200px]">
                <Label className="mb-4 block">Current Status</Label>
                <RadioGroup
                  value={formik.values.status || 'Open'}
                  onValueChange={(value) => formik.setFieldValue('status', value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Open" id="status-open" />
                    <Label htmlFor="status-open" className="flex-1">
                      <span className="font-medium">Open</span>
                      <p className="text-sm text-slate-500">
                        Ticket is active and awaiting resolution
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="In Progress" id="status-progress" />
                    <Label htmlFor="status-progress" className="flex-1">
                      <span className="font-medium">In Progress</span>
                      <p className="text-sm text-slate-500">
                        Currently being worked on
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Resolved" id="status-resolved" />
                    <Label htmlFor="status-resolved" className="flex-1">
                      <span className="font-medium">Resolved</span>
                      <p className="text-sm text-slate-500">
                        Issue has been resolved
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Closed" id="status-closed" />
                    <Label htmlFor="status-closed" className="flex-1">
                      <span className="font-medium">Closed</span>
                      <p className="text-sm text-slate-500">
                        Ticket is closed and archived
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Loading Progress Bar */}
      {isSubmitting && (
        <div className="mt-6">
          <Progress value={null} className="w-full" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          className="min-w-[120px]"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="min-w-[160px]"
          disabled={isSubmitting || !formik.isValid}
        >
          {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Ticket' : 'Update Ticket')}
        </Button>
      </div>
    </form>
  );
}
