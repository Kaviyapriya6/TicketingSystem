'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from 'lucide-react';

const businessHoursOptions = [
  'General working hours',
  '24/7 Support',
  'Business hours (9 AM - 6 PM)',
  'Extended hours (8 AM - 10 PM)',
  'Weekend only',
  'Weekdays only'
];

const CreateGroupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessHours: 'General working hours',
    addAgentsInNextStep: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (field) => (event) => {
    const value = event?.target?.type === 'checkbox' ? event.target.checked : (event?.target?.value || event);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }
    
    if (!formData.businessHours) {
      newErrors.businessHours = 'Business hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Group created successfully!'
        });
        
        // Redirect to groups list after a short delay
        setTimeout(() => {
          router.push('/groups');
        }, 1500);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: data.error || 'Failed to create group'
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to create group'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/groups');
  };

  return (
    <div className="p-6 max-w-[800px] mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-4 text-sm">
        <button
          onClick={handleBack}
          className="text-blue-600 hover:underline"
        >
          Groups
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900">
          Create New Group
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-slate-900">
          Create New Group
        </h1>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert 
          variant={alert.type === 'error' ? 'destructive' : 'success'} 
          className="mb-6"
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Name *</Label>
            <Input
              placeholder="e.g. Refund group"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="e.g. This group will answer all queries related to refunds."
              value={formData.description}
              onChange={handleChange('description')}
              rows={4}
            />
          </div>
          
          <div>
            <Label>Business Hours *</Label>
            <Select
              value={formData.businessHours}
              onValueChange={handleChange('businessHours')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business hours" />
              </SelectTrigger>
              <SelectContent>
                {businessHoursOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessHours && (
              <p className="text-sm text-red-500 mt-1">{errors.businessHours}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="addAgents"
              checked={formData.addAgentsInNextStep}
              onCheckedChange={handleChange('addAgentsInNextStep')}
            />
            <Label htmlFor="addAgents">
              Add agents in the next step
            </Label>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Group
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateGroupPage;