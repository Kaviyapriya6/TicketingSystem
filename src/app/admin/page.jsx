'use client';

import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UsersRound,
  Shield,
  Clock,
  Brain,
  CalendarCheck,
  Timer,
  Sparkles
} from 'lucide-react';

const teamSettings = [
  {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: 'Agents',
    description: "Define agents' scope of work, type, language, and other details.",
    link: '/agents', // 🔗 Route to app/agent/page.jsx
  },
  {
    icon: <UsersRound className="w-5 h-5 text-blue-600" />,
    title: 'Groups',
    description: 'Organize agents and receive notifications on unattended tickets.',
    link: '/groups', // 🔗 Route to app/groups/page.jsx
  },
  {
    icon: <Shield className="w-5 h-5 text-blue-600" />,
    title: 'Roles',
    description: 'Provide and restrict fine-grained levels of access and privileges for agents.',
    link: '/roles', // 🔗 Route to app/roles/page.jsx
  },
  {
    icon: <Clock className="w-5 h-5 text-blue-600" />,
    title: 'Business Hours',
    description: 'Define working hours and holidays to set expectations with customers.',
    link: '/business', 
  },
  {
    icon: <Brain className="w-5 h-5 text-blue-600" />,
    title: 'Skills',
    description: 'Automatically assign certain kind of tickets to agents based on their expertise.',
    link: '/skills', // 🔗 Route to app/skills/page.jsx
  },
  {
    icon: <CalendarCheck className="w-5 h-5 text-blue-600" />,
    title: 'Agent Shifts',
    description: 'Create and effectively manage agent schedules in one place.',
    link: '/shifts', // 🔗 Route to app/shifts/page.jsx
  },
  {
    icon: <Timer className="w-5 h-5 text-blue-600" />,
    title: 'Agent Statuses',
    description: 'Configure statuses to define agent availability and get clear visibility on where they spend their time.',
    isNew: true,
    link: '/status', // 🔗 Route to app/statuses/page.jsx
  },
];

export default function Admin() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Team
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teamSettings.map((item, index) => {
          const cardContent = (
            <Card className={`h-full p-6 flex flex-col justify-between border border-slate-200 bg-white rounded-lg ${item.link ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <div className="flex items-center">
                  <h2 className="text-base font-semibold">
                    {item.title}
                  </h2>
                  {item.isNew && (
                    <Badge variant="success" className="ml-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 flex-grow">
                {item.description}
              </p>
            </Card>
          );

          return (
            <div key={index}>
              {item.link ? (
                <Link href={item.link} className="block">
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
