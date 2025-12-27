'use client';

import { useState, useEffect } from 'react';
import MonthView from '@/components/Calendar/MonthView';
import CalendarHeader from '@/components/Calendar/CalendarHeader';

export default function CalendarPage() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // Fetch current user ID from session
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (data.userId) {
          setCurrentUserId(data.userId);
        }
      })
      .catch(err => console.error('Failed to fetch session:', err));
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
       <CalendarHeader 
         onUserFilterChange={setSelectedUserId}
         selectedUserId={selectedUserId}
       />
      <div className="flex-1">
        <MonthView 
          userId={selectedUserId || undefined} 
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
