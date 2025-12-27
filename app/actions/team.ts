'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Workspace from '@/models/Workspace';
import Membership from '@/models/Membership';
import { getSession } from '@/lib/auth';

export async function getTeamData() {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized', users: [], workspace: null };

  await dbConnect();

  /* 
     We must find all users who have a Membership in this workspace.
     User.find({ workspaceId }) is incorrect because it relies on the user's *active* workspace.
  */
  const memberships = await Membership.find({ workspaceId: session.workspaceId })
    .populate('userId', 'name email');

  // Map to a cleaner structure
  const users = memberships.map((m: any) => ({
      _id: m.userId._id, // User ID
      membershipId: m._id, // Membership ID for role updates
      name: m.userId.name,
      email: m.userId.email,
      role: m.role, // Role comes from Membership, not User
  }));
    
  const workspace = await Workspace.findById(session.workspaceId);

  return { 
     users: JSON.parse(JSON.stringify(users)),
     workspace: JSON.parse(JSON.stringify(workspace)),
     currentUserRole: session.role
  };
}
