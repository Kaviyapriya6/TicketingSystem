'use client'
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Rating,
  Divider
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  Assignment as AssignmentIcon,
  Insights as InsightsIcon,
  Notifications as NotificationsIcon,
  AutoAwesome as AutomationIcon,
  Groups as CollaborationIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <TicketIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
      title: 'Smart Ticket Management',
      description: 'Automatically categorize, prioritize, and route tickets to the right agents based on content, urgency, and expertise.'
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      title: 'Automated Assignment',
      description: 'Intelligent ticket assignment based on agent workload, skills, and availability to ensure balanced distribution.'
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#F59E0B' }} />,
      title: 'SLA Tracking',
      description: 'Monitor response times and resolution deadlines with automated escalations and SLA compliance reporting.'
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting on ticket volume, resolution times, agent performance, and customer satisfaction metrics.'
    },
    {
      icon: <AutomationIcon sx={{ fontSize: 40, color: '#EF4444' }} />,
      title: 'Workflow Automation',
      description: 'Create custom workflows with triggers and actions to automate repetitive tasks and standardize processes.'
    },
    {
      icon: <CollaborationIcon sx={{ fontSize: 40, color: '#06B6D4' }} />,
      title: 'Team Collaboration',
      description: 'Internal notes, ticket handoffs, and knowledge sharing tools to improve team coordination and efficiency.'
    }
  ];

  const stats = [
    { number: '2M+', label: 'Tickets Processed', subtext: 'Monthly' },
    { number: '85%', label: 'Faster Resolution', subtext: 'Average improvement' },
    { number: '< 2min', label: 'First Response', subtext: 'Average time' },
    { number: '98%', label: 'Customer Satisfaction', subtext: 'Rating' }
  ];

  const testimonials = [
    {
      name: 'David Martinez',
      role: 'IT Director',
      company: 'GlobalTech Solutions',
      rating: 5,
      comment: 'Our ticket resolution time improved by 60% within the first month. The automation features are game-changing.',
      avatar: '/avatars/david.jpg'
    },
    {
      name: 'Lisa Wang',
      role: 'Customer Success Manager',
      company: 'ServiceFirst Inc',
      rating: 5,
      comment: 'The SLA tracking and reporting features help us maintain our service commitments consistently.',
      avatar: '/avatars/lisa.jpg'
    }
  ];

  const benefits = [
    'Multi-channel ticket creation (email, web, phone)',
    'Customizable ticket fields and workflows',
    'Real-time collaboration and internal notes',
    'SLA monitoring and escalation management',
    'Advanced search and filtering capabilities',
    'Mobile app for agents on-the-go',
    'Integration with popular business tools',
    'Comprehensive audit trails and reporting'
  ];

  const ticketFeatures = [
    {
      icon: <NotificationsIcon sx={{ color: '#3B82F6' }} />,
      title: 'Smart Notifications',
      description: 'Never miss important updates with intelligent notification system'
    },
    {
      icon: <SecurityIcon sx={{ color: '#10B981' }} />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with GDPR and SOC 2 compliance'
    },
    {
      icon: <DashboardIcon sx={{ color: '#8B5CF6' }} />,
      title: 'Unified Dashboard',
      description: 'Complete overview of all tickets, metrics, and team performance'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      {/* Professional Navigation Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: '#1f2937',
                fontSize: '1.75rem'
              }}
            >
              TicketFlow
              <Box component="span" sx={{ color: '#3B82F6', ml: 0.5 }}>Pro</Box>
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="text"
                onClick={() => router.push('/auth/login')}
                sx={{
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    color: '#1f2937'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/signup')}
                sx={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  boxShadow: '0 1px 3px rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }
                }}
              >
                Start Free Trial
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Professional Hero Section */}
      <Box sx={{ 
        backgroundColor: '#fafbfc',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Chip 
                  icon={<StarIcon sx={{ fontSize: 16 }} />}
                  label="Trusted by 2000+ support teams worldwide" 
                  sx={{ 
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    mb: 3,
                    fontWeight: 500,
                    border: '1px solid #bfdbfe'
                  }}
                />
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 3,
                    lineHeight: 1.1,
                    fontSize: { xs: '2.5rem', md: '3.75rem' },
                    color: '#1f2937',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Professional Ticketing System
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4,
                    color: '#6b7280',
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 400
                  }}
                >
                  Transform your customer support with intelligent ticket management, automated workflows, 
                  and powerful analytics. Resolve tickets faster and keep customers happy.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/auth/signup')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                      '&:hover': {
                        backgroundColor: '#2563eb',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                      }
                    }}
                  >
                    Start 14-Day Free Trial
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/demo')}
                    sx={{
                      color: '#3B82F6',
                      borderColor: '#d1d5db',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '1rem',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#3B82F6',
                        backgroundColor: '#f8fafc'
                      }
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  No credit card required • Full feature access • Setup in minutes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Card sx={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 2,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3B82F6',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                      }
                    }}>
                      <CardContent sx={{ py: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#1f2937' }}>
                          {stat.number}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#374151', fontWeight: 500, mb: 0.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                          {stat.subtext}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Ticket Management Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>
            Complete Ticket Lifecycle Management
          </Typography>
          <Typography variant="h6" sx={{ color: '#6b7280', fontWeight: 400 }}>
            From creation to resolution, manage every aspect of your tickets
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {ticketFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  border: '1px solid #e5e7eb'
                }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Professional Features Section */}
      <Box sx={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: '#1f2937',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Advanced Ticketing Features
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#6b7280',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Everything you need to streamline your support operations and deliver exceptional service
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits and Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#1f2937' }}>
              Why Choose TicketFlow?
            </Typography>
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
              Our comprehensive ticketing platform includes everything your support team needs to deliver exceptional customer service efficiently.
            </Typography>
            <Grid container spacing={2}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} key={index}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: '#374151', fontWeight: 500 }}>
                      {benefit}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
                Customer Success Stories
              </Typography>
              <Stack spacing={3}>
                {testimonials.map((testimonial, index) => (
                  <Card key={index} sx={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 2
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 48, height: 48, backgroundColor: '#3B82F6' }}>
                          {testimonial.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {testimonial.role}, {testimonial.company}
                          </Typography>
                          <Rating value={testimonial.rating} size="small" readOnly />
                        </Box>
                      </Stack>
                      <Typography variant="body2" sx={{ color: '#374151', fontStyle: 'italic' }}>
                        "{testimonial.comment}"
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Professional CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Card sx={{ 
          backgroundColor: '#1f2937',
          color: 'white',
          textAlign: 'center',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Streamline Your Ticketing?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
              Join thousands of support teams using TicketFlow to resolve tickets faster, 
              improve customer satisfaction, and boost team productivity.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/auth/signup')}
                sx={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#2563eb'
                  }
                }}
              >
                Start Free 14-Day Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/contact')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Schedule Demo
              </Button>
            </Stack>
            <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              No setup fees • Free migration assistance • 24/7 support included
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LandingPage;
