'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Ticket,
  ClipboardList,
  LineChart,
  Bell,
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock, // Changed from Timeline to Clock
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LandingPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Ticket className="w-10 h-10 text-blue-500" />,
      title: 'Smart Ticket Management',
      description: 'Automatically categorize, prioritize, and route tickets to the right agents based on content, urgency, and expertise.'
    },
    {
      icon: <ClipboardList className="w-10 h-10 text-emerald-500" />,
      title: 'Automated Assignment',
      description: 'Intelligent ticket assignment based on agent workload, skills, and availability to ensure balanced distribution.'
    },
    {
      icon: <Clock className="w-10 h-10 text-amber-500" />, // Changed from Timeline to Clock
      title: 'SLA Tracking',
      description: 'Monitor response times and resolution deadlines with automated escalations and SLA compliance reporting.'
    },
    {
      icon: <LineChart className="w-10 h-10 text-purple-500" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting on ticket volume, resolution times, agent performance, and customer satisfaction metrics.'
    },
    {
      icon: <Sparkles className="w-10 h-10 text-red-500" />,
      title: 'Workflow Automation',
      description: 'Create custom workflows with triggers and actions to automate repetitive tasks and standardize processes.'
    },
    {
      icon: <Users className="w-10 h-10 text-cyan-500" />,
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
      icon: <Bell className="w-8 h-8 text-blue-500" />,
      title: 'Smart Notifications',
      description: 'Never miss important updates with intelligent notification system'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with GDPR and SOC 2 compliance'
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-purple-500" />,
      title: 'Unified Dashboard',
      description: 'Complete overview of all tickets, metrics, and team performance'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              TicketFlow
              <span className="text-blue-500 ml-1">Pro</span>
            </h1>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={() => router.push('/auth/login')}
                className="text-gray-500 hover:text-gray-900"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/auth/signup')}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 mb-6">
                <Star className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Trusted by 2000+ support teams worldwide</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Professional Ticketing System
              </h2>
              <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed">
                Transform your customer support with intelligent ticket management, automated workflows, 
                and powerful analytics. Resolve tickets faster and keep customers happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Start 14-Day Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/demo')}
                  className="border-gray-300 hover:border-blue-500"
                >
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                No credit card required • Full feature access • Setup in minutes
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 text-center border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-700 font-medium mb-1">{stat.label}</p>
                  <p className="text-gray-400 text-sm">{stat.subtext}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Management Features */}
      <div className="container mx-auto max-w-7xl py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Ticket Lifecycle Management
          </h2>
          <p className="text-xl text-gray-500">
            From creation to resolution, manage every aspect of your tickets
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ticketFeatures.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Features Section */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto max-w-7xl py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Advanced Ticketing Features
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need to streamline your support operations and deliver exceptional service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits and Testimonials Section */}
      <div className="container mx-auto max-w-7xl py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose TicketFlow?
            </h2>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Our comprehensive ticketing platform includes everything your support team needs to deliver exceptional customer service efficiently.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Customer Success Stories
            </h3>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 border border-gray-200">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.role}, {testimonial.company}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Professional CTA Section */}
      <div className="container mx-auto max-w-4xl py-16 md:py-24">
        <Card className="bg-gray-900 text-white p-8 md:p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Streamline Your Ticketing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of support teams using TicketFlow to resolve tickets faster, 
            improve customer satisfaction, and boost team productivity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Start Free 14-Day Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="h-px bg-gray-700 my-6" />
          <p className="text-gray-400">
            No setup fees • Free migration assistance • 24/7 support included
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
