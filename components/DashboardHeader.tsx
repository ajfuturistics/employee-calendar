'use client';

import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import WorkspaceSwitcher from '@/components/WorkspaceSwitcher';
import InviteModal from '@/components/InviteModal';

export default function DashboardHeader({ user, workspace }: { user: any, workspace: any }) {
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <WorkspaceSwitcher currentWorkspaceId={workspace?._id} />
          <Link 
              href="/dashboard/calendar"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
          >
              <Plus className="w-4 h-4" />
              <span>Apply Leave</span>
          </Link>
          <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors shadow-sm"
          >
              <Users className="w-4 h-4" />
              <span>Invite</span>
          </button>
        </div>
      </div>
      
      <InviteModal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
        inviteCode={workspace?.inviteCode || ''} 
      />
    </div>
  );
}
