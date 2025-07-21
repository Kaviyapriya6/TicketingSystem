'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, CircularProgress, Alert, Box } from '@mui/material';

export default function AddCompanyForm({ editMode = false, initialData = {} }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    fieldView: 'allFields',
    searchField: '',
    description: '',
    notes: '',
    domain: '',
    healthScore: '',
    accountTier: '',
    renewalDate: '',
    industry: ''
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // ✅ Load initial data for edit mode (use correct field names!)
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || '',
        fieldView: initialData.fieldView || 'allFields',
        searchField: initialData.searchField || '',
        description: initialData.description || '',
        notes: initialData.notes || '',
        domain: initialData.domain || '',
        healthScore: initialData.healthScore || '',
        accountTier: initialData.accountTier || '',
        renewalDate: initialData.renewalDate || '',
        industry: initialData.industry || ''
      });
    }
  }, [editMode, initialData]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      fieldView: 'allFields',
      searchField: '',
      description: '',
      notes: '',
      domain: '',
      healthScore: '',
      accountTier: '',
      renewalDate: '',
      industry: ''
    });
    showNotification('Form cleared', 'info');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // ✅ Safe validation check
  const validateForm = () => {
    if (typeof formData.name !== 'string' || (formData.name || '').trim() === '') {
      showNotification('Company name is required', 'error');
      return false;
    }
    return true;
  };

  const handleCreateCompany = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `/api/company/${initialData._id}` : '/api/company';

      console.log('Making request to:', url); // Debug log

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', res.status); // Debug log
      console.log('Response headers:', res.headers); // Debug log

      // Check if response is actually JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response. Status: ${res.status}`);
      }

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || `Failed to ${editMode ? 'update' : 'add'} company`);
      }

      showNotification(`Company ${editMode ? 'updated' : 'added'} successfully`, 'success');
      router.push('/company');
    } catch (err) {
      console.error('Error in handleCreateCompany:', err);
      
      // Better error handling for different types of errors
      if (err.message.includes('Failed to fetch')) {
        showNotification('Network error. Please check your connection.', 'error');
      } else if (err.message.includes('non-JSON response')) {
        showNotification('Server error. Please try again later.', 'error');
      } else {
        showNotification(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  const today = new Date().toISOString().split('T')[0];

  const SearchIcon = () => (
    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const XIcon = () => (
    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const AlertIcon = () => (
    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  const NotificationIcon = ({ type }) => {
    const iconStyle = { color: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6' };
    switch (type) {
      case 'success':
        return <div style={iconStyle}><CheckIcon /></div>;
      case 'error':
        return <div style={iconStyle}><XIcon /></div>;
      case 'info':
        return <div style={iconStyle}><AlertIcon /></div>;
      default:
        return <div style={iconStyle}><CheckIcon /></div>;
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '32px 16px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    formWrapper: {
      maxWidth: '768px',
      margin: '0 auto'
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '32px'
    },
    title: {
     fontSize: '1.8rem',
          // fontWeight: 'bold',
          marginBottom: '1.5rem',
          textAlign: 'center',
    },
    fieldGroup: {
      marginBottom: '24px'
    },
    mandatoryText: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    mandatoryInput: {
      backgroundColor: '#eff6ff',
      borderColor: '#10b981'
    },
    errorInput: {
      borderColor: '#ef4444'
    },
    errorText: {
      marginTop: '4px',
      fontSize: '14px',
      color: '#ef4444'
    },
    radioGroup: {
      display: 'flex',
      gap: '24px',
      marginBottom: '24px'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    radioInput: {
      marginRight: '8px',
      accentColor: '#3b82f6'
    },
    radioText: {
      fontSize: '14px',
      color: '#374151'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '24px'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '8px',
      paddingBottom: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    dateContainer: {
      position: 'relative'
    },
    dateIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    dateInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '16px',
      marginTop: '32px'
    },
    cancelButton: {
      padding: '12px 24px',
      border: '1px solid #d1d5db',
      backgroundColor: '#ffffff',
      color: '#374151',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    cancelButtonHover: {
      backgroundColor: '#f9fafb'
    },
    cancelButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    createButton: {
      padding: '12px 24px',
      backgroundColor: '#1f2937',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      transition: 'background-color 0.2s ease'
    },
    createButtonHover: {
      backgroundColor: '#111827'
    },
    createButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    },
    notification: {
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 1000,
      maxWidth: '384px',
      padding: '16px',
      borderRadius: '6px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    notificationSuccess: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0'
    },
    notificationError: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca'
    },
    notificationInfo: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe'
    },
    notificationText: {
      fontSize: '14px',
      fontWeight: 500,
      flex: 1
    },
    notificationTextSuccess: {
      color: '#166534'
    },
    notificationTextError: {
      color: '#991b1b'
    },
    notificationTextInfo: {
      color: '#1e40af'
    },
    closeButton: {
      color: '#9ca3af',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      padding: '4px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .cancel-button:hover:not(:disabled) {
            background-color: #f9fafb;
          }
          
          .create-button:hover:not(:disabled) {
            background-color: #111827;
          }
          
          .close-button:hover {
            color: #4b5563;
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <div style={styles.formCard}>
            <h1 style={styles.title}>
              Create New Company
            </h1>
            
            {/* Company Name - Mandatory Field */}
            <div style={styles.fieldGroup}>
              <p style={styles.mandatoryText}>This field is mandatory</p>
              
              <label style={styles.label}>Company Name*</label>
              
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                className="form-input"
                style={{
                  ...styles.input,
                  ...((formData.name || '').trim() ? styles.mandatoryInput : {}),
                  ...(!(formData.name || '').trim() && formData.name !== '' ? styles.errorInput : {})
                }}
                placeholder="Enter company name"
              />
              
              {!(formData.name || '').trim() && formData.name !== '' && (
                <p style={styles.errorText}>Company name is required</p>
              )}
            </div>

            {/* Field View Radio Buttons */}
            <div style={styles.radioGroup}>
              {/* <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="fieldView"
                  value="mandatoryFields"
                  checked={formData.fieldView === 'mandatoryFields'}
                  onChange={handleInputChange('fieldView')}
                  style={styles.radioInput}
                />
                
              </label> */}
              {/* <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="fieldView"
                  value="allFields"
                  checked={formData.fieldView === 'allFields'}
                  onChange={handleInputChange('fieldView')}
                  style={styles.radioInput}
                />
                
              </label> */}
            </div>

            {/* Search Field */}
            {/* <div style={styles.searchContainer}>
              <div style={styles.searchIcon}>
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search for a field"
                value={formData.searchField}
                onChange={handleInputChange('searchField')}
                className="form-input"
                style={styles.searchInput}
              />
            </div> */}

            {/* Form Fields */}
            <div>
              {/* Description */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter company description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  className="form-textarea"
                  style={styles.textarea}
                />
              </div>

              {/* Notes */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter additional notes"
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  className="form-textarea"
                  style={styles.textarea}
                />
              </div>

              {/* Domains */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Domains for this company
                </label>
                <select
                  value={formData.domain}
                  onChange={handleInputChange('domain')}
                  className="form-select"
                  style={styles.select}
                >
                  <option value="">Select domain</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="education">Education</option>
                </select>
              </div>

              {/* Health Score */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Health Score
                </label>
                <select
                  value={formData.healthScore}
                  onChange={handleInputChange('healthScore')}
                  className="form-select"
                  style={styles.select}
                >
                  <option value="">Select health score</option>
                  <option value="excellent">Excellent (90-100)</option>
                  <option value="good">Good (70-89)</option>
                  <option value="average">Average (50-69)</option>
                  <option value="poor">Poor (0-49)</option>
                </select>
              </div>

              {/* Account Tier */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Account Tier
                </label>
                <select
                  value={formData.accountTier}
                  onChange={handleInputChange('accountTier')}
                  className="form-select"
                  style={styles.select}
                >
                  <option value="">Select account tier</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="professional">Professional</option>
                  <option value="standard">Standard</option>
                  <option value="basic">Basic</option>
                </select>
              </div>

              {/* Renewal Date with Calendar */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Renewal Date
                </label>
                <div style={styles.dateContainer}>
                  <div style={styles.dateIcon}>
                    <CalendarIcon />
                  </div>
                  <input
                    type="date"
                    value={formData.renewalDate}
                    onChange={handleInputChange('renewalDate')}
                    min={today}
                    className="form-input"
                    style={styles.dateInput}
                  />
                </div>
              </div>

              {/* Industry */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={handleInputChange('industry')}
                  className="form-select"
                  style={styles.select}
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="consulting">Consulting</option>
                  <option value="real-estate">Real Estate</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="cancel-button"
                style={{
                  ...styles.cancelButton,
                  ...(loading ? styles.cancelButtonDisabled : {})
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCompany}
                disabled={loading || !(formData.name || '').trim()}
                className="create-button"
                style={{
                  ...styles.createButton,
                  ...(loading || !(formData.name || '').trim() ? styles.createButtonDisabled : {})
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Creating...
                  </>
                ) : (
                  'Create company'
                )}
              </button>
            </div>
          </div>

          {/* Notification Toast */}
          {notification.show && (
            <div style={{
              ...styles.notification,
              ...(notification.type === 'success' ? styles.notificationSuccess :
                  notification.type === 'error' ? styles.notificationError :
                  styles.notificationInfo)
            }}>
              <NotificationIcon type={notification.type} />
              <p style={{
                ...styles.notificationText,
                ...(notification.type === 'success' ? styles.notificationTextSuccess :
                    notification.type === 'error' ? styles.notificationTextError :
                    styles.notificationTextInfo)
              }}>
                {notification.message}
              </p>
              <button
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className="close-button"
                style={styles.closeButton}
              >
                <XIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}