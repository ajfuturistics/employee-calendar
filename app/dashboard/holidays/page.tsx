import { getSession } from '@/lib/auth';
import { getHolidays } from '@/app/actions/holiday';
import HolidayList from '@/components/Holiday/HolidayList';
import AddHolidayForm from '@/components/Holiday/AddHolidayForm';

export default async function HolidaysPage() {
  const session = await getSession();
  const { holidays } = await getHolidays();
  const isAdmin = session?.role !== 'EMPLOYEE';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Holiday Management</h1>
        <p className="text-gray-500">Manage company holidays and off-days.</p>
      </div>

      {isAdmin && <AddHolidayForm />}

      <HolidayList holidays={holidays} isAdmin={isAdmin} />
    </div>
  );
}
