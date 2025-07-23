'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Camera, Trash2, Plus } from 'lucide-react';

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
      timezone: document.querySelector('select[name="timezone"]')?.value || '',
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
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="w-full h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            {isEdit ? 'Edit Contact' : 'Create New Contact'}
          </h1>
          <p className="text-slate-500">
            {isEdit ? 'Update contact information and details' : 'Add a new contact to your database'}
          </p>
        </div>

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
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Profile & Basic Info */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                      Profile Information
                    </h2>
                    
                    {/* Profile Image */}
                    <div className="flex items-center mb-8">
                      <Avatar className="w-20 h-20 mr-6">
                        <AvatarImage src={imagePreview} alt={values.name} />
                        <AvatarFallback>
                          {values.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <input
                          accept="image/*"
                          className="hidden"
                          id="profile-image-upload"
                          type="file"
                          onChange={(e) => handleImageUpload(e, setFieldValue)}
                        />
                        <label htmlFor="profile-image-upload">
                          <Button
                            variant="outline"
                            className="mr-2"
                            asChild
                          >
                            <span>
                              <Camera className="w-4 h-4 mr-2" />
                              Upload Photo
                            </span>
                          </Button>
                        </label>
                        {imagePreview && (
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveImage(setFieldValue)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Field name="name">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Full Name"
                              error={touched.name && errors.name}
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <Field name="title">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Job Title"
                              error={touched.title && errors.title}
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <Field name="email">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="email"
                              placeholder="Email Address"
                              error={touched.email && errors.email}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </Card>

                  {/* Contact Information */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                      Contact Details
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Field name="phone">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Phone Number"
                              error={touched.phone && errors.phone}
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <Field name="workPhone">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Work Phone"
                              error={touched.workPhone && errors.workPhone}
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <Field name="twitter">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Twitter Handle (@username)"
                              error={touched.twitter && errors.twitter}
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <Field name="facebook">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Facebook Profile"
                              error={touched.facebook && errors.facebook}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Tags */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                      Tags & Labels
                    </h2>
                    
                    <p className="text-sm text-slate-500 mb-4">
                      Add tags to categorize and organize your contacts
                    </p>
                    
                    <div className="flex gap-4 mb-4">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(values, setFieldValue);
                          }
                        }}
                        placeholder="Add tag"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleAddTag(values, setFieldValue)}
                        disabled={!currentTag.trim()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {values.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-slate-200"
                          onClick={() => handleRemoveTag(tag, values, setFieldValue)}
                        >
                          {tag}
                          <Trash2 className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    
                    {values.tags.length === 0 && (
                      <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center bg-slate-50 mt-4">
                        <p className="text-sm text-slate-500">
                          No tags added yet. Add tags to organize your contacts.
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Organization & Settings */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                      Organization & Settings
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Select
                          value={values.company || "none"}
                          onValueChange={(value) => {
                            if (value === 'CREATE_NEW') {
                              handleCreateNewCompany();
                            } else if (value === 'none') {
                              setFieldValue('company', '');
                            } else {
                              setFieldValue('company', value);
                            }
                          }}
                          disabled={loadingCompanies}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              No company selected
                            </SelectItem>
                            <SelectItem value="CREATE_NEW" className="text-blue-600 font-medium">
                              <Plus className="w-4 h-4 mr-2 inline-block" />
                              Create New Company
                            </SelectItem>
                            {companies.map((company) => (
                              <SelectItem key={company._id} value={company.name}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {loadingCompanies && (
                          <p className="text-xs text-slate-500 mt-1">
                            Loading companies...
                          </p>
                        )}
                        {!loadingCompanies && companies.length === 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            No companies available. Create companies first.
                          </p>
                        )}
                      </div>

                      <div>
                        <Select
                          value={values.timezone || "none"}
                          onValueChange={(value) => setFieldValue('timezone', value === 'none' ? '' : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              Select timezone
                            </SelectItem>
                            {timezones.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Error Message */}
              {serverError && (
                <div className="mt-8">
                  <Alert variant="destructive">
                    <AlertDescription>
                      {serverError}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/contacts')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEdit ? 'Update Contact' : 'Create Contact'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContactForm;
