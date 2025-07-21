'use client';

import { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Avatar, Paper, Grid, Alert, MenuItem,
  FormControl, InputLabel, Select, IconButton, Chip, Container, Stack
} from '@mui/material';
import { PhotoCamera, Delete, Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ContactForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const router = useRouter();
  // Restore form data from sessionStorage if available
  const savedFormData = typeof window !== 'undefined' ? sessionStorage.getItem('contactFormData') : null;
  const parsedFormData = savedFormData ? JSON.parse(savedFormData) : {};
  const [imagePreview, setImagePreview] = useState(parsedFormData.profileImage || initialData.profileImage || null);
  const [currentTag, setCurrentTag] = useState('');
  const [serverError, setServerError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(parsedFormData.company || initialData.company || '');

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await fetch('/api/company');
        if (response.ok) {
          const data = await response.json();
          const companiesData = data.success ? data.data : data;
          setCompanies(companiesData || []);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Check for newly created company from URL params and restore form data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newCompanyId = urlParams.get('companyId');
    const newCompanyName = urlParams.get('companyName');
    if (newCompanyId && newCompanyName) {
      setCompanies(prev => {
        const exists = prev.some(company => company._id === newCompanyId);
        if (!exists) {
          return [...prev, { _id: newCompanyId, name: newCompanyName }];
        }
        return prev;
      });
      setSelectedCompany(newCompanyName);
      // Clear URL params
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    // Restore form data from sessionStorage if available
    if (savedFormData) {
      sessionStorage.removeItem('contactFormData');
    }
  }, []);

  const handleCreateNewCompany = () => {
    // Save current form data to sessionStorage
    const formData = {
      name: document.querySelector('input[name="name"]').value,
      title: document.querySelector('input[name="title"]').value,
      company: selectedCompany,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="phone"]').value,
      workPhone: document.querySelector('input[name="workPhone"]').value,
      twitter: document.querySelector('input[name="twitter"]').value,
      facebook: document.querySelector('input[name="facebook"]').value,
      tags: currentTag ? [currentTag] : [],
      timezone: document.querySelector('input[name="timezone"]')?.value || '',
      profileImage: imagePreview,
    };
    sessionStorage.setItem('contactFormData', JSON.stringify(formData));
    // Navigate to company creation with return URL
    const currentPath = window.location.pathname;
    const isEditMode = currentPath.includes('/edit/');
    const contactId = isEditMode ? currentPath.split('/').pop() : null;
    const returnUrl = encodeURIComponent(window.location.pathname);
    router.push(`/company/create?returnUrl=${returnUrl}&mode=contact&contactId=${contactId || ''}`);
  };

  const timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
    'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
    'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
    'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+05:30', 'UTC+06:00',
    'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00',
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^\+?[\d\s-()]+$/, 'Invalid phone').nullable(),
    workPhone: Yup.string().matches(/^\+?[\d\s-()]+$/, 'Invalid work phone').nullable(),
    twitter: Yup.string().matches(/^@/, 'Twitter must start with @').nullable(),
  });

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setImagePreview(imageUrl);
      setFieldValue('profileImage', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (setFieldValue) => {
    setImagePreview(null);
    setFieldValue('profileImage', null);
  };

  const handleAddTag = (values, setFieldValue) => {
    const tag = currentTag.trim();
    if (tag && !values.tags.includes(tag)) {
      setFieldValue('tags', [...values.tags, tag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag, values, setFieldValue) => {
    setFieldValue(
      'tags',
      values.tags.filter((t) => t !== tag)
    );
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 3,
        px: 2
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600, 
            color: '#333',
            mb: 1
          }}>
            {isEdit ? 'Edit Contact' : 'Create New Contact'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update contact information and details' : 'Add a new contact to your database'}
          </Typography>
        </Box>

        <Formik
          enableReinitialize={true}
          initialValues={{
            name: parsedFormData.name || initialData.name || '',
            title: parsedFormData.title || initialData.title || '',
            company: selectedCompany || parsedFormData.company || initialData.company || '',
            email: parsedFormData.email || initialData.email || '',
            phone: parsedFormData.phone || initialData.phone || '',
            workPhone: parsedFormData.workPhone || initialData.workPhone || '',
            twitter: parsedFormData.twitter || initialData.twitter || '',
            facebook: parsedFormData.facebook || initialData.facebook || '',
            tags: parsedFormData.tags || initialData.tags || [],
            timezone: parsedFormData.timezone || initialData.timezone || '',
            profileImage: parsedFormData.profileImage || initialData.profileImage || null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setServerError('');
            try {
              await onSubmit(values);
            } catch (err) {
              setServerError(err.message || 'Something went wrong.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Horizontal Layout - Two Column Structure */}
              <Grid container spacing={4}>
                {/* Left Column */}
                <Grid item xs={12} lg={6}>
                  <Stack spacing={4}>
                    {/* Profile & Basic Info */}
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                        Profile Information
                      </Typography>
                      
                      {/* Profile Image */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar 
                          src={imagePreview} 
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mr: 3,
                            bgcolor: '#e0e0e0',
                            fontSize: '2rem'
                          }}
                        >
                          {values.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-image-upload"
                            type="file"
                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                          />
                          <label htmlFor="profile-image-upload">
                            <Button 
                              variant="outlined" 
                              component="span"
                              startIcon={<PhotoCamera />}
                              size="small"
                            >
                              Upload Photo
                            </Button>
                          </label>
                          {imagePreview && (
                            <Button
                              onClick={() => handleRemoveImage(setFieldValue)}
                              size="small"
                              sx={{ ml: 1, color: 'error.main' }}
                            >
                              Remove
                            </Button>
                          )}
                        </Box>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="name"
                            label="Full Name *"
                            helperText={<ErrorMessage name="name" />}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="title"
                            label="Job Title"
                            helperText={<ErrorMessage name="title" />}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="email"
                            label="Email Address *"
                            type="email"
                            helperText={<ErrorMessage name="email" />}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Contact Information */}
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                        Contact Details
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            helperText={<ErrorMessage name="phone" />}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="workPhone"
                            label="Work Phone"
                            helperText={<ErrorMessage name="workPhone" />}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="twitter"
                            label="Twitter Handle"
                            placeholder="@username"
                            helperText={<ErrorMessage name="twitter" />}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="facebook"
                            label="Facebook Profile"
                            helperText={<ErrorMessage name="facebook" />}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Stack>
                </Grid>

                {/* Right Column - Reordered sections */}
                <Grid item xs={12} lg={6}>
                  <Stack spacing={4}>
                    {/* Tags - Now positioned BEHIND Organization & Settings */}
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                        Tags & Labels
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        Add tags to categorize and organize your contacts
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Add tag"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(values, setFieldValue);
                            }
                          }}
                        />
                        <Button 
                          variant="outlined"
                          onClick={() => handleAddTag(values, setFieldValue)}
                          disabled={!currentTag.trim()}
                          startIcon={<Add />}
                        >
                          Add
                        </Button>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {values.tags.map((tag) => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            onDelete={() => handleRemoveTag(tag, values, setFieldValue)}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      {values.tags.length === 0 && (
                        <Box sx={{ 
                          border: '1px dashed #ccc', 
                          borderRadius: 1, 
                          p: 2, 
                          textAlign: 'center',
                          bgcolor: '#fafafa',
                          mt: 2
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            No tags added yet. Add tags to organize your contacts.
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {/* Organization & Settings - Now positioned AFTER Tags */}
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                        Organization & Settings
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Company</InputLabel>
                            <Select
                              name="company"
                              value={values.company}
                              onChange={(e) => {
                                if (e.target.value === 'CREATE_NEW') {
                                  handleCreateNewCompany();
                                } else {
                                  setFieldValue('company', e.target.value);
                                }
                              }}
                              disabled={loadingCompanies}
                              label="Company"
                            >
                              <MenuItem value="">
                                <em>No company selected</em>
                              </MenuItem>
                              <MenuItem value="CREATE_NEW" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                <Add sx={{ mr: 1, fontSize: '1rem' }} />
                                + Create New Company
                              </MenuItem>
                              {companies.map((company) => (
                                <MenuItem key={company._id} value={company.name}>
                                  {company.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {loadingCompanies && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                Loading companies...
                              </Typography>
                            )}
                            {!loadingCompanies && companies.length === 0 && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                No companies available. Create companies first.
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                              name="timezone"
                              value={values.timezone}
                              onChange={(e) => setFieldValue('timezone', e.target.value)}
                              label="Timezone"
                            >
                              <MenuItem value="">
                                <em>Select timezone</em>
                              </MenuItem>
                              {timezones.map((tz) => (
                                <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>

              {/* Error Message */}
              {serverError && (
                <Box sx={{ mt: 4 }}>
                  <Alert severity="error">
                    {serverError}
                  </Alert>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => router.push('/contacts')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={isSubmitting}
                >
                  {isEdit ? 'Update Contact' : 'Create Contact'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ContactForm;
