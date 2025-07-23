'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Camera,
  Trash2,
  Info,
  User,
  Mail,
  Globe,
  Clock,
  Settings,
  Users,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AgentForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(initialData.profileImage || null);
  const [currentRole, setCurrentRole] = useState('none');
  const [serverError, setServerError] = useState('');
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [formData, setFormData] = useState({
    agentType: initialData.agentType || 'support',
    workType: initialData.workType || 'fulltime',
    email: initialData.email || '',
    profileImage: initialData.profileImage || null,
    timezone: initialData.timezone || 'GMT-04:00',
    language: initialData.language || 'english',
    signature: initialData.signature || '',
    roles: initialData.roles || ['Agent'],
    ticketVisibility: initialData.ticketVisibility || 'all',
    group: initialData.groups && initialData.groups.length > 0 ? initialData.groups[0] : 'none',
  });

  const agentTypes = [
    { value: 'support', label: 'Support Agent' },
    { value: 'sales', label: 'Sales Agent' },
    { value: 'admin', label: 'Admin Agent' },
    { value: 'manager', label: 'Manager' },
  ];

  const timezones = [
    { value: 'GMT-04:00', label: '(GMT-04:00) Eastern Time (US & Canada)' },
    { value: 'GMT-05:00', label: '(GMT-05:00) Central Time (US & Canada)' },
    { value: 'GMT-06:00', label: '(GMT-06:00) Mountain Time (US & Canada)' },
    { value: 'GMT-07:00', label: '(GMT-07:00) Pacific Time (US & Canada)' },
    { value: 'GMT+00:00', label: '(GMT+00:00) Greenwich Mean Time' },
    { value: 'GMT+01:00', label: '(GMT+01:00) Central European Time' },
    { value: 'GMT+05:30', label: '(GMT+05:30) India Standard Time' },
    { value: 'GMT+08:00', label: '(GMT+08:00) China Standard Time' },
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
  ];

  const availableRoles = [
    'Agent', 'Admin', 'Manager', 'Support Lead', 'Sales Lead', 
    'Customer Success', 'Technical Support', 'Billing Support'
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const response = await fetch('/api/groups');
        if (response.ok) {
          const data = await response.json();
          const groups = data.success ? data.data : data;
          setAvailableGroups(groups.map(group => group.name));
        } else {
          setAvailableGroups([]);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setAvailableGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setImagePreview(imageUrl);
      handleInputChange('profileImage', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    handleInputChange('profileImage', null);
  };

  const handleAddRole = () => {
    const role = currentRole.trim();
    if (role && !formData.roles.includes(role)) {
      handleInputChange('roles', [...formData.roles, role]);
      setCurrentRole('');
    }
  };

  const handleRemoveRole = (role) => {
    handleInputChange('roles', formData.roles.filter(r => r !== role));
  };

  const handleSubmit = async () => {
    setServerError('');
    try {
      const submitData = {
        ...formData,
        groups: formData.group !== 'none' ? [formData.group] : []
      };
      delete submitData.group;
      
      await onSubmit(submitData);
    } catch (err) {
      setServerError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {isEdit ? 'Edit Agent' : 'Create New Agent'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update agent information and permissions' : 'Add a new agent to your team'}
          </p>
        </div>

        <form>
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Basic Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Basic Information
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Agent Type *</Label>
                    <Select
                      value={formData.agentType}
                      onValueChange={(value) => handleInputChange('agentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="agent@company.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timezone *</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => handleInputChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language *</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleInputChange('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Work Type & Profile Photo */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Work Configuration
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Work Type *</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="fulltime"
                          checked={formData.workType === 'fulltime'}
                          onChange={(e) => handleInputChange('workType', e.target.value)}
                          className="form-radio"
                        />
                        <span>Full Time (8 seats available)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="occasional"
                          checked={formData.workType === 'occasional'}
                          onChange={(e) => handleInputChange('workType', e.target.value)}
                          className="form-radio"
                        />
                        <span>Occasional (3 day passes)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center bg-gray-200",
                        imagePreview ? "overflow-hidden" : ""
                      )}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          accept="image/*"
                          className="hidden"
                          id="profile-image-upload"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="profile-image-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span>
                              <Camera className="w-4 h-4 mr-2" />
                              Upload
                            </span>
                          </Button>
                        </label>
                        {imagePreview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Email Signature */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Email Signature
                </h2>
                <Textarea
                  value={formData.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  placeholder="Enter agent's email signature..."
                  rows={4}
                />
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Permissions & Access */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Permissions & Access
                </h2>

                {/* Roles Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <h3 className="text-base font-medium text-gray-900">Roles</h3>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Determines the features that an agent can access
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <Select
                      value={currentRole}
                      onValueChange={setCurrentRole}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddRole}
                      disabled={!currentRole.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {role}
                        <button
                          onClick={() => handleRemoveRole(role)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ticket Visibility */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    Scope for ticket visibility
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-start space-x-2">
                      <input
                        type="radio"
                        value="all"
                        checked={formData.ticketVisibility === 'all'}
                        onChange={(e) => handleInputChange('ticketVisibility', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">All tickets</p>
                        <p className="text-sm text-gray-600">Can view and edit all tickets</p>
                      </div>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input
                        type="radio"
                        value="group"
                        checked={formData.ticketVisibility === 'group'}
                        onChange={(e) => handleInputChange('ticketVisibility', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">Group tickets</p>
                        <p className="text-sm text-gray-600">Can view and edit tickets in their group(s) and assigned tickets</p>
                      </div>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input
                        type="radio"
                        value="assigned"
                        checked={formData.ticketVisibility === 'assigned'}
                        onChange={(e) => handleInputChange('ticketVisibility', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">Assigned tickets</p>
                        <p className="text-sm text-gray-600">Can view and edit only tickets assigned to them</p>
                      </div>
                    </label>
                  </div>
                </div>
              </Card>

              {/* Groups */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Group Assignment
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Assign agent to a group for better collaboration
                </p>
                
                {loadingGroups ? (
                  <div className="py-4">
                    <p className="text-sm text-gray-600">Loading groups...</p>
                  </div>
                ) : availableGroups.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No groups available. Create groups from the Groups section to organize agents.
                    </p>
                  </div>
                ) : (
                  <Select
                    value={formData.group}
                    onValueChange={(value) => handleInputChange('group', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No group assigned</SelectItem>
                      {availableGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Card>
            </div>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="mt-8">
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Agent' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;
