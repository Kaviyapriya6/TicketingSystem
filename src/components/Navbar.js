'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  Plus,
  FileText,
  Settings,
  User,
  ChevronDown,
  Ticket,
  Mail,
  Building2,
  UserPlus,
  LogOut
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  // Function to get page title based on pathname
  const getPageTitle = () => {
    const pageTitles = {
      '/dashboard': 'Dashboard',
      '/contacts': 'Contacts',
      '/contacts/create': 'Create Contact',
      '/tickets': 'Tickets',
      '/tickets/create': 'Create Ticket',
      '/agents': 'Agents',
      '/agents/create': 'Create Agent',
      '/groups': 'Groups',
      '/groups/create': 'Create Group',
      '/company': 'Companies',
      '/company/create': 'Create Company',
      '/Email': 'Emails',
      '/Email/create': 'Create Email',
      '/admin': 'Admin',
      '/apps': 'Apps',
    };
    
    // Handle dynamic routes like edit and view pages
    if (pathname.includes('/contacts/edit/')) return 'Edit Contact';
    if (pathname.includes('/tickets/edit/')) return 'Edit Ticket';
    if (pathname.includes('/tickets/view/')) return 'View Ticket';
    if (pathname.includes('/agents/edit/')) return 'Edit Agent';
    if (pathname.includes('/groups/edit/')) return 'Edit Group';
    if (pathname.includes('/company/edit/')) return 'Edit Company';
    if (pathname.includes('/Email/edit/')) return 'Edit Email';
    
    return pageTitles[pathname] || 'Dashboard';
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path); // Debug log
    router.push(path);
  };

  return (
    <Card className="sticky top-0 z-30 border-b rounded-none bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Left side - Page title */}
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-4">
          {/* Trial notice */}
          <span className="text-sm text-slate-500">
            Your trial ends in{' '}
            <span className="font-semibold">14 days</span>
          </span>

          {/* Subscribe button */}
          <Button variant="default">
            Subscribe
          </Button>

          {/* Recommended features */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" className="relative">
                Recommended features
                <ChevronDown className="ml-1 h-4 w-4" />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="w-48 rounded-md border bg-white p-1 shadow-md" sideOffset={5}>
                <DropdownMenu.Item className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100">
                  Feature 1
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100">
                  Feature 2
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* New button */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-1 h-4 w-4" />
                New
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="w-48 rounded-md border bg-white p-1 shadow-md" sideOffset={5}>
                <DropdownMenu.Item 
                  className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100"
                  onClick={() => handleNavigation('/tickets/create')}
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Ticket
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100"
                  onClick={() => handleNavigation('/Email/create')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100"
                  onClick={() => handleNavigation('/contacts/create')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Contact
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100"
                  onClick={() => handleNavigation('/company/create')}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Company
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100"
                  onClick={() => handleNavigation('/agents/create')}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agent
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search"
              className="pl-8 bg-slate-50 hover:bg-slate-100 focus:bg-white w-64"
            />
          </div>

          {/* Action buttons */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <Button variant="ghost" size="icon">
            <FileText className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="w-48 rounded-md border bg-white p-1 shadow-md" sideOffset={5}>
                <DropdownMenu.Item className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;