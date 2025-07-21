'use client';

import {
  Box, Button, TextField, Typography, MenuItem,
  Select, InputLabel, FormControl, Grid, Paper,
  Chip, Alert, Stack, LinearProgress, Container,
  Avatar, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleIssueTypeChange = (event) => {
    const value = event.target.value;
    if (value === 'Other') {
      setShowOtherIssueType(true);
      formik.setFieldValue('issueType', '');
    } else {
      setShowOtherIssueType(false);
      setOtherIssueType('');
      formik.setFieldValue('issueType', value);
    }
  };

  const handleOtherIssueTypeChange = (event) => {
    const value = event.target.value;
    setOtherIssueType(value);
    formik.setFieldValue('issueType', value);
  };

  // Common styles for fixed sizing
  const textFieldStyles = {
    minWidth: 200,
    '& .MuiInputBase-root': {
      minHeight: 56,
      height: 56,
    },
    '& .MuiInputBase-input': {
      padding: '16.5px 14px',
    }
  };

  const selectStyles = {
    minWidth: 200,
    '& .MuiSelect-select': {
      minHeight: '20px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      padding: '16.5px 14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  };

  const multilineTextFieldStyles = {
    minWidth: 200,
    '& .MuiInputBase-root': {
      minHeight: 120, // Fixed height for multiline
    },
    '& .MuiInputBase-input': {
      padding: '16.5px 14px',
    }
  };

  return (
   

        <form onSubmit={formik.handleSubmit}>
          {/* Single Container with All Fields */}
          <Paper sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Customer Information Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3,  fontWeight: 600 }}>
                  Customer Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={selectStyles}>
                      <InputLabel>Contact *</InputLabel>
                      <Select
                        name="contact"
                        value={formik.values.contact || ''}
                        onChange={e => {
                          const selectedId = e.target.value;
                          formik.setFieldValue('contact', selectedId);
                          const found = contacts.find(c => c._id === selectedId);
                          if (found) {
                            formik.setFieldValue('email', found.email || '');
                            formik.setFieldValue('phone', found.phone || '');
                            setShowAddContact(false);
                          } else {
                            setShowAddContact(true);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contact && Boolean(formik.errors.contact)}
                        label="Contact *"
                      >
                        <MenuItem value="">
                          <em>Select contact</em>
                        </MenuItem>
                        {contacts.map(contact => (
                          <MenuItem key={contact._id} value={contact._id}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#3B82F6', fontSize: '0.875rem' }}>
                                {contact.name?.charAt(0)?.toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {contact.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {contact.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.contact && formik.errors.contact && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 2 }}>
                          {formik.errors.contact}
                        </Typography>
                      )}
                    </FormControl>
                    {showAddContact && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => {
                          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                          router.push(`/contacts/create?returnUrl=${returnUrl}`);
                        }}
                      >
                        Add New Contact
                      </Button>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ticket ID"
                      name="ticketId"
                      value={formik.values.ticketId || ''}
                      disabled
                      sx={{
                        ...textFieldStyles,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#f8fafc',
                          minHeight: 56,
                          height: 56,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formik.values.email || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      placeholder="agent@company.com"
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number *"
                      name="phone"
                      value={formik.values.phone || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                      placeholder="10-digit phone number"
                      sx={textFieldStyles}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Issue Details Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                  Issue Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject *"
                      name="subject"
                      value={formik.values.subject || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subject && Boolean(formik.errors.subject)}
                      helperText={formik.touched.subject && formik.errors.subject}
                      placeholder="Brief summary of the issue"
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={selectStyles}>
                      <InputLabel>Issue Type *</InputLabel>
                      <Select
                        name="issueType"
                        value={showOtherIssueType ? 'Other' : (formik.values.issueType || '')}
                        onChange={handleIssueTypeChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.issueType && Boolean(formik.errors.issueType)}
                        label="Issue Type *"
                      >
                        <MenuItem value="Technical">Technical Issue</MenuItem>
                        <MenuItem value="Billing">Billing Issue</MenuItem>
                        <MenuItem value="Account">Account Issue</MenuItem>
                        <MenuItem value="General">General Inquiry</MenuItem>
                        <MenuItem value="Bug Report">Bug Report</MenuItem>
                        <MenuItem value="Feature Request">Feature Request</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {formik.touched.issueType && formik.errors.issueType && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 2 }}>
                          {formik.errors.issueType}
                        </Typography>
                      )}
                    </FormControl>
                    
                    {showOtherIssueType && (
                      <TextField
                        fullWidth
                        label="Specify Issue Type *"
                        value={otherIssueType}
                        onChange={handleOtherIssueTypeChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.issueType && Boolean(formik.errors.issueType)}
                        helperText={formik.touched.issueType && formik.errors.issueType}
                        placeholder="Please specify the issue type"
                        sx={{ mt: 2, ...textFieldStyles }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={selectStyles}>
                      <InputLabel>Priority Level *</InputLabel>
                      <Select
                        name="priority"
                        value={formik.values.priority || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.priority && Boolean(formik.errors.priority)}
                        label="Priority Level *"
                        renderValue={(selected) => {
                          if (!selected) return '';
                          return (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Chip 
                                label={selected} 
                                color={selected === 'High' ? 'error' : selected === 'Medium' ? 'warning' : 'success'} 
                                size="small" 
                              />
                              <Typography>{selected} Priority</Typography>
                            </Stack>
                          );
                        }}
                      >
                        <MenuItem value="Low">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip label="Low" color="success" size="small" />
                            <Typography>Low Priority</Typography>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="Medium">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip label="Med" color="warning" size="small" />
                            <Typography>Medium Priority</Typography>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="High">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip label="High" color="error" size="small" />
                            <Typography>High Priority</Typography>
                          </Stack>
                        </MenuItem>
                      </Select>
                      {formik.touched.priority && formik.errors.priority && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 2 }}>
                          {formik.errors.priority}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Detailed Description *"
                      name="description"
                      value={formik.values.description || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                      placeholder="Provide a comprehensive description of the issue..."
                      sx={multilineTextFieldStyles}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* File Upload Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                  Attachments
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Upload files to help describe your issue (Optional)
                </Typography>
                
                <Box sx={{ 
                  p: 4, 
                  border: '2px dashed #ddd', 
                  borderRadius: 2,
                  textAlign: 'center',
                  bgcolor: '#fafafa',
                  minHeight: 150, // Fixed height for upload area
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    bgcolor: '#f8fafc'
                  }
                }}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#999', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Drop files here or click to browse
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    Maximum file size: 5MB
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', mb: 3, display: 'block' }}>
                    Supported: JPG, PNG, GIF, PDF, DOC, DOCX, TXT
                  </Typography>
                  <Button 
                    variant="outlined" 
                    component="label"
                    startIcon={<AttachFileIcon />}
                    size="small"
                  >
                    Choose Files
                    <input hidden type="file" onChange={handleFileChange} />
                  </Button>
                  
                  {fileName && (
                    <Alert 
                      severity="success" 
                      sx={{ mt: 3, borderRadius: 1, maxWidth: 400 }}
                    >
                      <Typography variant="body2">
                        Attached: {fileName}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Grid>

              {/* Status Section (for edit mode) */}
              {mode === 'edit' && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                    Status
                  </Typography>
                  <Box sx={{ minHeight: 200 }}> {/* Fixed height for status section */}
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ mb: 2, color: '#333' }}>
                        Current Status
                      </FormLabel>
                      <RadioGroup
                        value={formik.values.status || 'Open'}
                        onChange={(e) => formik.setFieldValue('status', e.target.value)}
                      >
                        <FormControlLabel
                          value="Open"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Open
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Ticket is active and awaiting resolution
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="In Progress"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                In Progress
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Currently being worked on
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="Resolved"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Resolved
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Issue has been resolved
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="Closed"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Closed
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Ticket is closed and archived
                              </Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Loading Progress Bar */}
          {isSubmitting && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress sx={{ borderRadius: 1 }} />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.back()}
              sx={{ minWidth: 120 }} // Fixed button width
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !formik.isValid}
              sx={{ minWidth: 160 }} // Fixed button width
            >
              {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Ticket' : 'Update Ticket')}
            </Button>
          </Box>
        </form>
   
   
  );
}
