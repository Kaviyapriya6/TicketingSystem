'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  Clock,
  CheckCircle2,
  Hourglass,
  User,
  Plus,
  ArrowUp,
  ArrowDown,
  Timer,
  SmilePlus,
  Meh,
  Frown,
  Bell,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTicketStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const stats = {
      unresolved: tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length,
      overdue: tickets.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate < now && t.status !== 'Resolved' && t.status !== 'Closed';
      }).length,
      dueToday: tickets.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      }).length,
      open: tickets.filter(t => t.status === 'Open').length,
      onHold: tickets.filter(t => t.status === 'On Hold').length,
      unassigned: tickets.filter(t => !t.assignedTo || (Array.isArray(t.assignedTo) && t.assignedTo.length === 0)).length,
      resolved: tickets.filter(t => t.status === 'Resolved').length,
      received: tickets.length
    };
    return stats;
  };

  // Fetch trends data from API
  const [trendsData, setTrendsData] = useState([]);
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch('/api/tickets/trends');
        if (res.ok) {
          const data = await res.json();
          setTrendsData(data);
        }
      } catch (err) {
        setTrendsData([]);
      }
    };
    fetchTrends();
  }, []);

  // Fetch unresolved breakdown from API
  const [unresolvedBreakdown, setUnresolvedBreakdown] = useState([]);
  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const res = await fetch('/api/tickets/unresolved-breakdown');
        if (res.ok) {
          const data = await res.json();
          setUnresolvedBreakdown(data);
        }
      } catch (err) {
        setUnresolvedBreakdown([]);
      }
    };
    fetchBreakdown();
  }, []);

  // Fetch satisfaction from API
  const [satisfaction, setSatisfaction] = useState({ responses: 0, positive: 0, neutral: 0, negative: 0 });
  useEffect(() => {
    const fetchSatisfaction = async () => {
      try {
        const res = await fetch('/api/tickets/satisfaction');
        if (res.ok) {
          const data = await res.json();
          setSatisfaction(data);
        }
      } catch (err) {
        setSatisfaction({ responses: 0, positive: 0, neutral: 0, negative: 0 });
      }
    };
    fetchSatisfaction();
  }, []);

  const stats = getTicketStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-3 flex items-center justify-center">
        <Progress value={null} className="w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Stats Cards */}
        <div className="mb-4">
          <div className="flex gap-3">
            <Card className="flex-1 border border-slate-200">
              <div className="p-3">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Unresolved
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.unresolved}
                </p>
              </div>
            </Card>
            <Card className="flex-1 border border-slate-200">
              <div className="p-3">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Overdue
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.overdue}
                </p>
              </div>
            </Card>
            <Card className="flex-1 border border-slate-200">
              <div className="p-3">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Due today
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.dueToday}
                </p>
              </div>
            </Card>
            <Card className="flex-1 border border-slate-200">
              <div className="p-3">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Open
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.open}
                </p>
              </div>
            </Card>
            <Card className="flex-1 border border-slate-200">
              <div className="p-3">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  On hold
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.onHold}
                </p>
              </div>
            </Card>
            <Card className="flex-1 border border-slate-200">
              <div className="p-3">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Unassigned
                </p>
                <p className="text-3xl font-bold text-brown-600">
                  {stats.unassigned}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts and Details Section */}
        <div className="grid grid-cols-[2fr_1fr] gap-3 mb-4">
          {/* Today's Trends Chart */}
          <Card className="border border-slate-200">
            <div className="p-3">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Today's trends
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                1st May 2018, 03:00 PM
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsData}>
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="border border-slate-200">
            <div className="p-3">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Resolved
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.resolved}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Received
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.received}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Average first response time
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    12m
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Average response time
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    24m 12s
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Resolution within SLA
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    91%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-3">
          {/* Unresolved Tickets */}
          <Card className="border border-slate-200">
            <div className="p-3">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Unresolved tickets
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                Across helpdesk
              </p>
              
              <div className="space-y-2">
                {unresolvedBreakdown.map((group, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-slate-800">
                        {group.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {group.count}
                      </p>
                    </div>
                    <Progress 
                      value={(group.count / 55) * 100}
                      className="h-1.5 rounded-full bg-slate-100"
                      indicatorClassName={cn(
                        "rounded-full",
                        group.color === "#1976d2" && "bg-blue-600",
                        group.color === "#f44336" && "bg-red-600",
                        group.color === "#4caf50" && "bg-green-600"
                      )}
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                variant="ghost"
                size="sm"
                className="mt-2 text-blue-600 font-medium hover:text-blue-700"
              >
                View details
              </Button>
            </div>
          </Card>

          {/* Customer Satisfaction */}
          <Card className="border border-slate-200">
            <div className="p-3">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Customer satisfaction
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                Across helpdesk this month
              </p>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Responses received
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {satisfaction.responses}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <SmilePlus className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-medium text-slate-800">
                      Positive
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-500">
                    {satisfaction.positive}%
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Meh className="w-5 h-5 text-orange-500" />
                    <p className="text-sm font-medium text-slate-800">
                      Neutral
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-orange-500">
                    {satisfaction.neutral}%
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Frown className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-medium text-slate-800">
                      Negative
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-red-500">
                    {satisfaction.negative}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* To-do */}
          <Card className="border border-slate-200">
            <div className="p-3">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                To-do (2)
              </h2>
              <Button 
                variant="ghost"
                size="sm"
                className="text-blue-600 font-medium hover:text-blue-700 mb-2 p-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add a to-do
              </Button>
              
              <div className="space-y-2">
                <div className="p-2 bg-slate-50 rounded">
                  <div className="flex items-start gap-1">
                    <Checkbox />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 mb-1">
                        Followup with customer about Upgrade
                      </p>
                      <div className="flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5 text-slate-500" />
                        <p className="text-xs text-slate-500">
                          Set two factor authentication by google authenticator
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        IN 4 DAYS
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 bg-slate-50 rounded">
                  <div className="flex items-start gap-1">
                    <Checkbox />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 mb-1">
                        Billing reminder
                      </p>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <p className="text-xs text-slate-500">
                          Ticket Sharing between groups
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        IN 6 DAYS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}