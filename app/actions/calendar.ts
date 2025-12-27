'use server';

import dbConnect from '@/lib/db';
import Leave from '@/models/Leave';
import Holiday from '@/models/Holiday';
import { getSession } from '@/lib/auth';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function getCalendarData(month: Date, userId?: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized', leaves: [], holidays: [] };

  await dbConnect();

  const start = startOfMonth(month);
  const end = endOfMonth(month);

  // Build query for leaves
  const leaveQuery: any = {
    workspaceId: session.workspaceId,
    status: 'APPROVED',
    $or: [
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } }
    ]
  };

  // Add user filter if provided
  if (userId) {
    leaveQuery.userId = userId;
  }

  // Fetch leaves for the workspace that overlap with the current month
  const leaves = await Leave.find(leaveQuery).populate('userId', 'name email');

  // Fetch holidays
  const holidays = await Holiday.find({
    workspaceId: session.workspaceId,
    date: { $gte: start, $lte: end },
  });

  // Serialize data to simple objects to pass to client component
  return {
    leaves: JSON.parse(JSON.stringify(leaves)),
    holidays: JSON.parse(JSON.stringify(holidays)),
  };
}

export async function getWorkspaceUsers() {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized', users: [] };

  await dbConnect();

  const Membership = (await import('@/models/Membership')).default;
  const User = (await import('@/models/User')).default;

  try {
    const memberships = await Membership.find({ workspaceId: session.workspaceId })
      .populate('userId', 'name email');

    const users = memberships.map((m: any) => ({
      _id: m.userId._id.toString(),
      name: m.userId.name,
      email: m.userId.email,
    }));

    return { users };
  } catch (error: any) {
    return { error: error.message, users: [] };
  }
}
