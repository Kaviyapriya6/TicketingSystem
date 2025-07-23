'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Settings,
  FileText,
  HelpCircle,
  Wrench,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { cn } from "@/lib/utils";

const KnowledgeBaseUI = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-1">
            <Search className="text-slate-400 mr-2 h-5 w-5" />
            <Input
              placeholder="Search articles..."
              className="flex-1 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-blue-600 text-sm font-normal"
            >
              Manage
            </Button>
            <Button
              onClick={() => router.push('/solutions/create')}
              className="text-sm font-normal"
            >
              <Plus className="h-4 w-4 mr-2" />
              New article
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* My drafts section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-slate-800">
              My drafts
            </h2>
            <Link href="#" className="text-blue-600 text-sm hover:underline">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-slate-200 hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="text-base font-medium text-blue-600 mb-1">
                  How to Create a New User Account
                </h3>
                <p className="text-sm text-slate-500">
                  Last edited 7 days ago
                </p>
              </div>
            </Card>
            <Card className="border border-slate-200 hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="text-base font-medium text-blue-600 mb-1">
                  How to Update Software Settings
                </h3>
                <p className="text-sm text-slate-500">
                  Last edited 7 days ago
                </p>
              </div>
            </Card>
            <Card className="border border-slate-200 hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="text-base font-medium text-blue-600 mb-1">
                  What to Do if the Software Crashes Frequently
                </h3>
                <p className="text-sm text-slate-500">
                  Last edited 7 days ago
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Categories section */}
        <div>
          <h2 className="text-xl font-medium text-slate-800 mb-4">
            Categories (3)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* How tos */}
            <Card className="border border-slate-200 hover:shadow-md transition-shadow min-h-[200px]">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <FileText className="text-blue-600 h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium text-slate-800">
                    How tos
                  </h3>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-blue-600">
                    Installation
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    01
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">
                    Account creation
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    01
                  </Badge>
                </div>
              </div>
            </Card>

            {/* FAQs */}
            <Card className="border border-slate-200 hover:shadow-md transition-shadow min-h-[200px]">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <HelpCircle className="text-blue-600 h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium text-slate-800">
                    FAQs
                  </h3>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">
                    Updating software
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    01
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Troubleshooting */}
            <Card className="border border-slate-200 hover:shadow-md transition-shadow min-h-[200px]">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <Wrench className="text-blue-600 h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium text-slate-800">
                    Troubleshooting
                  </h3>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-blue-600">
                    Software glitches and crashing
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    01
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">
                    Login issues
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    01
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat widget */}
      <div className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 shadow-lg">
        <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white">
          1
        </div>
        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseUI;