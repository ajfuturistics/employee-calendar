'use server';

import dbConnect from '@/lib/db';
import Leave from '@/models/Leave';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';

export async function generateReport(formData: FormData) {
  const session = await getSession();
  if (!session || session.role === 'EMPLOYEE') return { error: 'Unauthorized' };
  
  // For MVP, just export all approved leaves for the current month/year or everything
  // Ideally, use formData to filter
  
  await dbConnect();

  const leaves = await Leave.find({ 
      workspaceId: session.workspaceId,
      status: 'APPROVED'
  })
  .populate('userId', 'name')
  .sort({ startDate: -1 });

  // Generate text format
  // EMP001 | JOHN DOE | 2025-01-10 → 2025-01-12 | PAID
  
  let reportContent = 'NAME | START DATE | END DATE | TYPE | REASON\n';
  reportContent += '-'.repeat(80) + '\n';

  leaves.forEach((leave: any) => {
      const line = `${leave.userId.name} | ${format(new Date(leave.startDate), 'yyyy-MM-dd')} | ${format(new Date(leave.endDate), 'yyyy-MM-dd')} | ${leave.type} | ${leave.reason || ''}`;
      reportContent += line + '\n';
  });

  return { success: true, content: reportContent, filename: `leaves_report_${format(new Date(), 'yyyy-MM-dd')}.txt` };
}
