'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Workspace from '@/models/Workspace';
import { createSession, deleteSession, hashPassword, comparePassword } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('companyName') as string;

  if (!name || !email || !password || !companyName) {
    return { error: 'All fields are required' };
  }

  await dbConnect();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Suggest login if user exists
      return { error: 'User already exists. Please login to join.' };
    }

    // Generate unique invite code for the new personal workspace
    const newInviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // IDs for new resources
    const personalWorkspaceId = new mongoose!.conn!.Types.ObjectId();
    const userId = new mongoose!.conn!.Types.ObjectId();
    const hashedPassword = await hashPassword(password);

    // 1. Create Personal Workspace
    const personalWorkspace = await Workspace.create({
      _id: personalWorkspaceId,
      name: companyName,
      inviteCode: newInviteCode,
      ownerId: userId,
    });

    let activeWorkspaceId = personalWorkspace._id;
    let activeRole = 'OWNER';

    // 2. Check for optional Invite Code (to join another workspace)
    const inviteCodeArg = formData.get('inviteCode') as string;
    let invitedWorkspace = null;
    
    if (inviteCodeArg) {
        invitedWorkspace = await Workspace.findOne({ inviteCode: inviteCodeArg });
        if (invitedWorkspace) {
            activeWorkspaceId = invitedWorkspace._id;
            activeRole = 'EMPLOYEE';
        }
    }

    // 3. Create User
    const newUser = await User.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role: activeRole,
      workspaceId: activeWorkspaceId,
    });

    // 4. Create Memberships
    // 4a. Personal Workspace Membership
    await import('@/models/Membership').then((mod) => {
        const Membership = mod.default;
        return Membership.create({
            userId: newUser._id,
            workspaceId: personalWorkspace._id,
            role: 'OWNER'
        });
    });

    // 4b. Invited Workspace Membership (if applicable)
    if (invitedWorkspace) {
        await import('@/models/Membership').then((mod) => {
            const Membership = mod.default;
            return Membership.create({
                userId: newUser._id,
                workspaceId: invitedWorkspace._id,
                role: 'EMPLOYEE'
            });
        });
    }

    await createSession(newUser._id.toString(), activeWorkspaceId.toString(), activeRole);
    
  } catch (error: any) {
    return { error: error.message || 'Registration failed' };
  }

  redirect('/dashboard');
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email });
    if (!user ||  !user.password) {
      return { error: 'Invalid credentials' };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid credentials' };
    }
    
    // In a full implementation, we might ask which workspace to log into if multiple exist.
    // For now, we Default to the last active one stored on User, 
    // OR we could check Memberships if User.workspaceId is null (migration case).
    
    let workspaceId = user.workspaceId?.toString();
    let role = user.role;
    
    // Safety check: ensure user still has access to this workspace
    if (workspaceId) {
         const Membership = (await import('@/models/Membership')).default;
         const membership = await Membership.findOne({ userId: user._id, workspaceId: workspaceId });
         
         if (!membership) {
             // Fallback: finding first workspace they belong to
             const firstMembership = await Membership.findOne({ userId: user._id });
             if (firstMembership) {
                 workspaceId = firstMembership.workspaceId.toString();
                 role = firstMembership.role;
                 
                 // Update user's default/active workspace
                 user.workspaceId = firstMembership.workspaceId;
                 user.role = role;
                 await user.save();
             } else {
                 // User has no workspaces? This shouldn't happen in normal flow unless wiped.
                 console.warn("User has no memberships");
             }
         } else {
             // Correct role if it drifted
             role = membership.role;
         }
    }

    await createSession(user._id.toString(), workspaceId, role);

    const callbackUrl = formData.get('callbackUrl') as string;
    if (callbackUrl) {
        redirect(callbackUrl);
    }

  } catch (error: any) {
    return { error: error.message || 'Login failed' };
  }

  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
