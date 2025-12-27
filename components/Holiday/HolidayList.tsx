'use client';

import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { deleteHoliday } from '@/app/actions/holiday';

export default function HolidayList({ holidays, isAdmin }: { holidays: any[]; isAdmin: boolean }) {
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Upcoming Holidays</h3>
        </div>
        
        {holidays.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
                No holidays scheduled.
            </div>
        ) : (
            <div className="divide-y divide-gray-100">
                {holidays.map((holiday) => (
                    <div key={holiday._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                            <p className="font-semibold text-gray-900">{holiday.name}</p>
                            <p className="text-sm text-gray-500">{format(new Date(holiday.date), 'EEEE, MMMM d, yyyy')}</p>
                        </div>
                        {isAdmin && (
                            <button 
                                onClick={() => deleteHoliday(holiday._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
