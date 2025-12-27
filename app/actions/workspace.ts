'use server';

import dbConnect from '@/lib/db';
import Workspace from '@/models/Workspace';
import Membership from '@/models/Membership';
import User from '@/models/User';
import { createSession, getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function joinWorkspace(inviteCode: string) {
  const session = await getSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  await dbConnect();

  try {
    const workspace = await Workspace.findOne({ inviteCode });
    if (!workspace) {
      return { error: 'Invalid invite code' };
    }

    const existingMembership = await Membership.findOne({
      userId: session.userId,
      workspaceId: workspace._id,
    });

    if (existingMembership) {
      return { error: 'You are already a member of this workspace' };
    }

    await Membership.create({
      userId: session.userId,
      workspaceId: workspace._id,
      role: 'EMPLOYEE',
    });

    // Optionally switch to the new workspace immediately
    await switchWorkspace(workspace._id.toString());
    
  } catch (error: any) {
    return { error: error.message || 'Failed to join workspace' };
  }
}

export async function switchWorkspace(workspaceId: string) {
  const session = await getSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  await dbConnect();

  try {
    const membership = await Membership.findOne({
      userId: session.userId,
      workspaceId,
    });

    if (!membership) {
        return { error: 'You are not a member of this workspace' };
    }
    
    // Update user's last active workspace
    await User.findByIdAndUpdate(session.userId, {
        workspaceId: workspaceId,
        role: membership.role
    });

    await createSession(session.userId, workspaceId, membership.role);
    
  } catch (error: any) {
    return { error: error.message || 'Failed to switch workspace' };
  }

  redirect('/dashboard');
}

export async function getWorkspaces() {
    const session = await getSession();
    if (!session) return [];
    
    await dbConnect();
    
    // Populate the workspace details
    const memberships = await Membership.find({ userId: session.userId })
        .populate('workspaceId')
        .exec();
        
    return memberships.map(m => {
        const w = m.workspaceId as any; // Type assertion since it's populated
        return {
            workspace: {
                _id: w._id.toString(),
                name: w.name,
                inviteCode: w.inviteCode
            },
            role: m.role
        };
    });
}

export async function updateMemberRole(memberId: string, newRole: 'HR' | 'EMPLOYEE') {
    const session = await getSession();
    if (!session) return { error: 'Not authenticated' };
    
    if (session.role !== 'OWNER' && session.role !== 'HR') {
        return { error: 'Unauthorized' };
    }
    
    // HR cannot promote to HR (optional rule, but let's stick to Owner promotes for now? Or HR helps HR?)
    // Let's restrict: Only Owner can manage roles for now for simplicity, or HR can manage Employees.
    if (session.role === 'HR' && newRole === 'HR') {
         return { error: 'Only Owners can promote to HR' };
    }

    await dbConnect();
    
    // Ensure the target member is in the same workspace
    const targetMembership = await Membership.findOne({ 
        userId: memberId, 
        workspaceId: session.workspaceId 
    });
    
    if (!targetMembership) {
        return { error: 'Member not found in this workspace' };
    }
    
    targetMembership.role = newRole;
    await targetMembership.save();
    
    return { success: true };
}

export async function leaveWorkspace(workspaceId: string) {
    const session = await getSession();
    if (!session) return { error: 'Not authenticated' };

    await dbConnect();

    try {
        const membership = await Membership.findOne({ 
            userId: session.userId, 
            workspaceId: workspaceId 
        });

        if (!membership) {
            return { error: 'You are not a member of this workspace' };
        }

        if (membership.role === 'OWNER') {
            return { error: 'Workspace owners cannot leave the workspace. You must transfer ownership or delete the workspace.' };
        }

        await Membership.findByIdAndDelete(membership._id);

        // If user was currently active in this workspace, switch them to another one
        if (session.workspaceId === workspaceId) {
             const anotherMembership = await Membership.findOne({ userId: session.userId });
             
             if (anotherMembership) {
                 await switchWorkspace(anotherMembership.workspaceId.toString());
             } else {
                 // User left their last workspace? 
                 // We should probably create a default one or handle this edge case.
                 // For now, redirect to dashboard which might show empty state or redirect to setup.
                 // But switchWorkspace redirects.
                 // Update user's active workspace to null
                 await User.findByIdAndUpdate(session.userId, { workspaceId: null, role: null });
                 await createSession(session.userId, '', ''); // Clear session
             }
        }
        
        return { success: true };

    } catch (error: any) {
        return { error: error.message || 'Failed to leave workspace' };
    }
}
