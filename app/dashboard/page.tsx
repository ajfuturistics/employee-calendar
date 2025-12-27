import { getSession } from '@/lib/auth';
import { getUserLeaves, getPendingLeaves, getRejectedLeaves } from '@/app/actions/leave';
import LeaveList from '@/components/Leave/LeaveList';
import DashboardHeader from '@/components/DashboardHeader';

export default async function DashboardPage() {
  const session = await getSession();
  const userLeaves = await getUserLeaves();
  const rejectedLeaves = await getRejectedLeaves();

  // Fetch current workspace details for the invite code
  await import('@/lib/db').then(m => m.default());
  const Workspace = (await import('@/models/Workspace')).default;
  const workspace = await Workspace.findById(session?.workspaceId).lean();
  
  let pendingLeaves = { leaves: [] };
  if (session?.role !== 'EMPLOYEE') {
      pendingLeaves = await getPendingLeaves();
  }

  return (
    <div className='pb-10'>
        <DashboardHeader user={session} workspace={JSON.parse(JSON.stringify(workspace))} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="space-y-6">
                <LeaveList 
                    title="My Recent Leaves" 
                    leaves={userLeaves.leaves || []} 
                />
            </div>
            
            {session?.role !== 'EMPLOYEE' && (
                <div className="space-y-6">
                    <LeaveList 
                        title="Pending Approvals" 
                        leaves={pendingLeaves.leaves || []} 
                        isHrView={true} 
                    />
                </div>
            )}

            {/* Rejected Leaves Tab for all users */}
            {rejectedLeaves.leaves && rejectedLeaves.leaves.length > 0 && (
                <div className="space-y-6">
                    <LeaveList 
                        title="Rejected Leaves" 
                        leaves={rejectedLeaves.leaves || []} 
                        showRejectionReason={true}
                    />
                </div>
            )}
        </div>
    </div>
  );
}
