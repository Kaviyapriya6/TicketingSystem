'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Calendar, X } from "lucide-react";

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
    type: 'default'
  });

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
    const value = event?.target?.value || event;
    setFormData((prev) => ({
      ...prev,
      [field]: value
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
    showNotification('Form cleared', 'default');
  };

  const showNotification = (message, type = 'default') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'default' });
    }, 4000);
  };

  const validateForm = () => {
    if (typeof formData.name !== 'string' || (formData.name || '').trim() === '') {
      showNotification('Company name is required', 'destructive');
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

      console.log('Making request to:', url);

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

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

      showNotification(`Company ${editMode ? 'updated' : 'added'} successfully`, 'default');
      router.push('/company');
    } catch (err) {
      console.error('Error in handleCreateCompany:', err);
      
      if (err.message.includes('Failed to fetch')) {
        showNotification('Network error. Please check your connection.', 'destructive');
      } else if (err.message.includes('non-JSON response')) {
        showNotification('Server error. Please try again later.', 'destructive');
      } else {
        showNotification(err.message, 'destructive');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Create New Company
          </h1>
          
          {/* Company Name - Mandatory Field */}
          <div className="space-y-4 mb-6">
            <p className="text-sm text-slate-500">This field is mandatory</p>
            
            <div className="space-y-2">
              <Label>Company Name*</Label>
              <Input
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter company name"
                className={`${(formData.name || '').trim() ? 'bg-blue-50 border-primary' : ''} ${!(formData.name || '').trim() && formData.name !== '' ? 'border-destructive' : ''}`}
              />
              {!(formData.name || '').trim() && formData.name !== '' && (
                <p className="text-sm text-destructive">Company name is required</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                rows={3}
                placeholder="Enter company description"
                value={formData.description}
                onChange={handleInputChange('description')}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                rows={3}
                placeholder="Enter additional notes"
                value={formData.notes}
                onChange={handleInputChange('notes')}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Domains */}
            <div className="space-y-2">
              <Label>Domains for this company</Label>
              <Select value={formData.domain} onValueChange={handleInputChange('domain')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Health Score */}
            <div className="space-y-2">
              <Label>Health Score</Label>
              <Select value={formData.healthScore} onValueChange={handleInputChange('healthScore')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select health score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (90-100)</SelectItem>
                  <SelectItem value="good">Good (70-89)</SelectItem>
                  <SelectItem value="average">Average (50-69)</SelectItem>
                  <SelectItem value="poor">Poor (0-49)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Tier */}
            <div className="space-y-2">
              <Label>Account Tier</Label>
              <Select value={formData.accountTier} onValueChange={handleInputChange('accountTier')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Renewal Date */}
            <div className="space-y-2">
              <Label>Renewal Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="date"
                  value={formData.renewalDate}
                  onChange={handleInputChange('renewalDate')}
                  min={today}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={formData.industry} onValueChange={handleInputChange('industry')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={loading || !(formData.name || '').trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create company'
              )}
            </Button>
          </div>
        </Card>

        {/* Notification */}
        {notification.show && (
          <Alert
            variant={notification.type}
            className="fixed top-4 right-4 max-w-md z-50"
            onClose={() => setNotification({ show: false, message: '', type: 'default' })}
          >
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}