'use server';

import dbConnect from '@/lib/db';
import Holiday from '@/models/Holiday';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createHoliday(formData: FormData) {
  const session = await getSession();
  if (!session || session.role === 'EMPLOYEE') return { error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const date = formData.get('date') as string;

  if (!name || !date) {
    return { error: 'Missing required fields' };
  }

  await dbConnect();

  try {
    await Holiday.create({
      workspaceId: session.workspaceId,
      name,
      date: new Date(date),
      isNational: false // Default to company holiday for now
    });
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/calendar');
    revalidatePath('/dashboard/holidays');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to create holiday' };
  }
}

export async function deleteHoliday(holidayId: string) {
    const session = await getSession();
    if (!session || session.role === 'EMPLOYEE') return { error: 'Unauthorized' };

    await dbConnect();
    
    try {
        await Holiday.findByIdAndDelete(holidayId);
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/calendar');
        revalidatePath('/dashboard/holidays');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getHolidays() {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized', holidays: [] };

    await dbConnect();
    
    const holidays = await Holiday.find({ workspaceId: session.workspaceId })
        .sort({ date: 1 });

    return { holidays: JSON.parse(JSON.stringify(holidays)) };
}
