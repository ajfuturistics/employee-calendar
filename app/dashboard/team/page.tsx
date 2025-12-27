import { getTeamData } from '@/app/actions/team';
import TeamList from '@/components/Team/TeamList';
import { Copy } from 'lucide-react';

export default async function TeamPage() {
  const { users, workspace, currentUserRole } = await getTeamData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-500">Manage your team and invites.</p>
         </div>
         
         <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 shadow-sm">
            <span className="text-sm font-medium text-gray-500">Invite Code:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-lg font-mono font-bold tracking-widest text-gray-800">
                {workspace?.inviteCode}
            </code>
            {/* Simple Copy button can be added here */}
         </div>
      </div>

      <TeamList initialUsers={users} currentUserRole={currentUserRole} />
    </div>
  );
}
