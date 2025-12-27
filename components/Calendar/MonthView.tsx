'use client';

import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  isWithinInterval,
  startOfDay,
  endOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCalendarData } from '@/app/actions/calendar';
import { getSession } from '@/lib/auth';
import LeaveDetailModal from './LeaveDetailModal';

interface MonthViewProps {
  userId?: string;
  currentUserId?: string;
}

export default function MonthView({ userId, currentUserId }: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState<{ leaves: any[]; holidays: any[] }>({ leaves: [], holidays: [] });
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLeaveClick = (leave: any) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getCalendarData(currentMonth, userId);
      console.log('Calendar data fetched:', result);
      if (!result.error) {
        setData({ leaves: result.leaves, holidays: result.holidays });
        console.log('Leaves:', result.leaves);
        console.log('Holidays:', result.holidays);
      } else {
        console.error('Error fetching calendar data:', result.error);
      }
      setLoading(false);
    }
    fetchData();
  }, [currentMonth, userId]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1.5 text-sm font-medium hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-transparent hover:border-gray-200">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center py-2 bg-gray-50 border-b border-gray-100">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-gray-50">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const dayStart = startOfDay(day);
          const dayEnd = endOfDay(day);
          
          const dayLeaves = data.leaves.filter(leave => {
            const leaveStart = startOfDay(new Date(leave.startDate));
            const leaveEnd = endOfDay(new Date(leave.endDate));
            
            // Check if the day falls within the leave period
            return isWithinInterval(dayStart, { start: leaveStart, end: leaveEnd });
          });
          
          const dayHolidays = data.holidays.filter(holiday => isSameDay(new Date(holiday.date), day));
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors relative group",
                !isCurrentMonth ? "bg-gray-50/50" : "bg-white",
                "hover:bg-gray-50"
              )}
            >
              <div className="flex justify-between items-start">
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                    isToday(day) 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                      : !isCurrentMonth ? "text-gray-300" : "text-gray-700"
                  )}>
                    {format(day, 'd')}
                  </span>
              </div>

              <div className="mt-2 space-y-1.5 overflow-hidden">
                {dayHolidays.map((holiday: any) => (
                  <div key={holiday._id} className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800 font-medium truncate border border-amber-200" title={holiday.name}>
                    🎉 {holiday.name}
                  </div>
                ))}
                
                {dayLeaves.map((leave: any) => (
                  <div 
                    key={leave._id} 
                    onClick={() => handleLeaveClick(leave)}
                    className={cn(
                        "text-xs px-2 py-1 rounded font-medium flex items-center gap-1.5 truncate border cursor-pointer hover:shadow-md transition-shadow",
                         leave.type === 'SICK' && "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
                         leave.type === 'CASUAL' && "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200",
                         leave.type === 'PAID' && "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
                         leave.type === 'UNPAID' && "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
                         leave.type === 'ANNUAL' && "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
                         leave.type === 'MATERNITY' && "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
                         leave.type === 'PATERNITY' && "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
                         leave.type === 'BEREAVEMENT' && "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
                         leave.type === 'STUDY' && "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200",
                         leave.type === 'OTHER' && "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
                    )}
                    title={`Click to view details - ${leave.userId?.name || 'Unknown'} - ${leave.type}`}
                  >
                     <UserIcon className="w-3 h-3 flex-shrink-0 opacity-70" />
                     <span className="truncate">{leave.userId?.name || 'Unknown'}</span>
                  </div>
                ))}
              </div>
              
              {/* Hover effect to show 'Add' (Future feature) */}
              <div className="absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                {/* <div className="w-5 h-5 bg-blue-500 rounded text-white flex items-center justify-center cursor-pointer shadow-sm hover:scale-110 transition-transform">+</div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave Detail Modal */}
      <LeaveDetailModal 
        leave={selectedLeave}
        isOpen={isModalOpen}
        onClose={closeModal}
        currentUserId={currentUserId || ''}
      />
    </div>
  );
}
