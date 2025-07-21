import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, TextField, Button, Typography, Avatar, Paper, Grid, Alert, MenuItem,
  FormControl, InputLabel, Select, IconButton, Chip, RadioGroup, FormControlLabel,
  Radio, FormLabel, Autocomplete, Card, CardContent, Divider, Stack, Container
} from '@mui/material';
import { 
  PhotoCamera, 
  Delete, 
  Info, 
  Person, 
  Email, 
  Language, 
  Schedule, 
  Settings, 
  Group, 
  Add 
} from '@mui/icons-material';

const AgentForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(initialData.profileImage || null);
  const [currentRole, setCurrentRole] = useState('');
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
    group: initialData.groups && initialData.groups.length > 0 ? initialData.groups[0] : '',
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
        groups: formData.group ? [formData.group] : []
      };
      delete submitData.group;
      
      await onSubmit(submitData);
    } catch (err) {
      setServerError(err.message || 'Something went wrong.');
    }
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
            {isEdit ? 'Edit Agent' : 'Create New Agent'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update agent information and permissions' : 'Add a new agent to your team'}
          </Typography>
        </Box>

        <form>
          {/* Horizontal Layout - Two Column Structure */}
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} lg={6}>
              <Stack spacing={4}>
                {/* Basic Information */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                    Basic Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Agent Type *</InputLabel>
                        <Select
                          value={formData.agentType}
                          onChange={(e) => handleInputChange('agentType', e.target.value)}
                          label="Agent Type *"
                        >
                          {agentTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="agent@company.com"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timezone *</InputLabel>
                        <Select
                          value={formData.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          label="Timezone *"
                        >
                          {timezones.map((tz) => (
                            <MenuItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Language *</InputLabel>
                        <Select
                          value={formData.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          label="Language *"
                        >
                          {languages.map((lang) => (
                            <MenuItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Work Type & Profile Photo */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                    Work Configuration
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ mb: 1, color: '#333' }}>Work Type *</FormLabel>
                        <RadioGroup
                          value={formData.workType}
                          onChange={(e) => handleInputChange('workType', e.target.value)}
                        >
                          <FormControlLabel
                            value="fulltime"
                            control={<Radio />}
                            label="Full Time (8 seats available)"
                          />
                          <FormControlLabel
                            value="occasional"
                            control={<Radio />}
                            label="Occasional (3 day passes)"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                          Profile Photo
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={imagePreview} 
                            sx={{ 
                              width: 64, 
                              height: 64,
                              bgcolor: '#e0e0e0'
                            }}
                          >
                            {formData.email ? formData.email.charAt(0).toUpperCase() : <Person />}
                          </Avatar>
                          <Box>
                            <input
                              accept="image/*"
                              style={{ display: 'none' }}
                              id="profile-image-upload"
                              type="file"
                              onChange={handleImageUpload}
                            />
                            <label htmlFor="profile-image-upload">
                              <Button 
                                variant="outlined" 
                                component="span" 
                                startIcon={<PhotoCamera />}
                                size="small"
                              >
                                Upload
                              </Button>
                            </label>
                            {imagePreview && (
                              <Button
                                onClick={handleRemoveImage}
                                size="small"
                                sx={{ ml: 1, color: 'error.main' }}
                              >
                                Remove
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Email Signature */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                    Email Signature
                  </Typography>
                  <TextField
                    fullWidth
                    label="Email Signature"
                    multiline
                    rows={4}
                    value={formData.signature}
                    onChange={(e) => handleInputChange('signature', e.target.value)}
                    placeholder="Enter agent's email signature..."
                  />
                </Paper>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} lg={6}>
              <Stack spacing={4}>
                {/* Permissions & Access */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                    Permissions & Access
                  </Typography>

                  {/* Roles Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: '#333', fontWeight: 500 }}>
                      Roles
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <Info fontSize="small" />
                      </IconButton>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Determines the features that an agent can access
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
                      <Autocomplete
                        sx={{ flexGrow: 1 }}
                        options={availableRoles}
                        value={currentRole}
                        onChange={(event, newValue) => setCurrentRole(newValue || '')}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select a role"
                            size="small"
                          />
                        )}
                      />
                      <Button 
                        variant="outlined"
                        onClick={handleAddRole}
                        disabled={!currentRole.trim()}
                        size="small"
                        startIcon={<Add />}
                      >
                        Add
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          onDelete={() => handleRemoveRole(role)}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Ticket Visibility */}
                  <Box>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ mb: 2, color: '#333', fontWeight: 500 }}>
                        Scope for ticket visibility
                      </FormLabel>
                      <RadioGroup
                        value={formData.ticketVisibility}
                        onChange={(e) => handleInputChange('ticketVisibility', e.target.value)}
                      >
                        <FormControlLabel
                          value="all"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                All tickets
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Can view and edit all tickets
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="group"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Group tickets
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Can view and edit tickets in their group(s) and assigned tickets
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="assigned"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Assigned tickets
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Can view and edit only tickets assigned to them
                              </Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Paper>

                {/* Groups */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                    Group Assignment
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    Assign agent to a group for better collaboration
                  </Typography>
                  
                  {loadingGroups ? (
                    <Box sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading groups...
                      </Typography>
                    </Box>
                  ) : availableGroups.length === 0 ? (
                    <Box sx={{ 
                      border: '1px dashed #ccc', 
                      borderRadius: 1, 
                      p: 3, 
                      textAlign: 'center',
                      bgcolor: '#fafafa'
                    }}>
                      <Group sx={{ fontSize: 40, color: '#bbb', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No groups available. Create groups from the Groups section to organize agents.
                      </Typography>
                    </Box>
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel>Select Group</InputLabel>
                      <Select
                        value={formData.group}
                        onChange={(e) => handleInputChange('group', e.target.value)}
                        label="Select Group"
                      >
                        <MenuItem value="">
                          <em>No group assigned</em>
                        </MenuItem>
                        {availableGroups.map((group) => (
                          <MenuItem key={group} value={group}>
                            {group}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
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
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Agent' : 'Create Agent'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AgentForm;
