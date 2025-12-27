'use server';

import dbConnect from '@/lib/db';
import Leave from '@/models/Leave';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function applyLeave(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const type = formData.get('type') as string;
  const reason = formData.get('reason') as string;

  if (!startDate || !endDate || !type) {
    return { error: 'Missing required fields' };
  }

  await dbConnect();

  try {
    await Leave.create({
      userId: session.userId,
      workspaceId: session.workspaceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type,
      reason,
      status: 'PENDING',
    });
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/calendar');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to apply leave' };
  }
}

export async function getUserLeaves() {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized', leaves: [] };

    await dbConnect();
    
    const leaves = await Leave.find({ userId: session.userId })
        .sort({ startDate: -1 })
        .populate('userId', 'name');

    return { leaves: JSON.parse(JSON.stringify(leaves)) };
}

export async function getPendingLeaves() {
    const session = await getSession();
    if (!session || session.role === 'EMPLOYEE') return { error: 'Unauthorized', leaves: [] };

    await dbConnect();
    
    // HR/Owner sees all pending leaves for the workspace
    const leaves = await Leave.find({ 
        workspaceId: session.workspaceId,
        status: 'PENDING'
    })
    .sort({ createdAt: 1 })
    .populate('userId', 'name email');

    return { leaves: JSON.parse(JSON.stringify(leaves)) };
}

export async function updateLeaveStatus(leaveId: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
    const session = await getSession();
    if (!session || session.role === 'EMPLOYEE') return { error: 'Unauthorized' };

    await dbConnect();
    
    try {
        const updateData: any = { status };
        if (status === 'REJECTED' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        
        await Leave.findByIdAndUpdate(leaveId, updateData);
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getRejectedLeaves() {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized', leaves: [] };

    await dbConnect();
    
    // Get rejected leaves for the current user
    const leaves = await Leave.find({ 
        userId: session.userId,
        status: 'REJECTED'
    })
    .sort({ updatedAt: -1 })
    .populate('userId', 'name email');

    return { leaves: JSON.parse(JSON.stringify(leaves)) };
}

export async function exportLeaves(userId?: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    await dbConnect();
    
    try {
        const query: any = { workspaceId: session.workspaceId };
        
        // If userId provided, filter by that user (HR/Owner can export for specific users)
        if (userId) {
            query.userId = userId;
        } else if (session.role === 'EMPLOYEE') {
            // Employees can only export their own leaves
            query.userId = session.userId;
        }
        
        const leaves = await Leave.find(query)
            .sort({ startDate: -1 })
            .populate('userId', 'name email');

        // Convert to CSV format
        const csvHeaders = 'Employee Name,Email,Start Date,End Date,Type,Status,Reason,Rejection Reason\n';
        const csvRows = leaves.map((leave: any) => {
            return `"${leave.userId?.name || 'N/A'}","${leave.userId?.email || 'N/A'}","${new Date(leave.startDate).toLocaleDateString()}","${new Date(leave.endDate).toLocaleDateString()}","${leave.type}","${leave.status}","${leave.reason || ''}","${leave.rejectionReason || ''}"`;
        }).join('\n');

        return { 
            success: true, 
            csv: csvHeaders + csvRows,
            filename: `leaves_export_${new Date().toISOString().split('T')[0]}.csv`
        };
    } catch (error: any) {
        return { error: error.message };
    }
}
