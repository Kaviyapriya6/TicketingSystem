'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Users,
  Ticket,
  LineChart,
  Settings,
  Bot,
  BookOpen,
  ShieldCheck,
  AppWindow,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/contacts', icon: Users, label: 'Contacts' },
    { href: '/company', icon: Building2, label: 'Company' },
    { href: '/tickets', icon: Ticket, label: 'Tickets' },
    // { href: '/reports', icon: LineChart, label: 'Reports' },
    // { href: '/settings', icon: Settings, label: 'Settings' },
    // { href: '/automation', icon: Bot, label: 'Automation' },
    { href: '/solutions', icon: BookOpen, label: 'Solutions' },
    { href: '/admin', icon: ShieldCheck, label: 'Admin' },
  ];

  const bottomMenuItems = [
    { href: '/apps', icon: AppWindow, label: 'Apps' },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-slate-800 text-white transition-all duration-300 border-r border-slate-700",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            H
          </div>
          {!isCollapsed && (
            <span className="ml-2 font-semibold text-lg truncate">
              Bizdesk
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "text-slate-400 hover:text-white hover:bg-slate-700",
            isCollapsed && "ml-auto"
          )}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="h-px bg-slate-700" />

      {/* Main Menu */}
      <div className="flex-grow py-2 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center" : "justify-start",
                  isActive
                    ? "bg-blue-600 text-white border-r-2 border-blue-400"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="h-px bg-slate-700" />

      {/* Bottom Menu */}
      <div className="py-2">
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center" : "justify-start",
                  isActive
                    ? "bg-blue-600 text-white border-r-2 border-blue-400"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;