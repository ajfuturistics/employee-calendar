'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import ApplyLeaveModal from '@/components/Leave/ApplyLeaveModal';
import { getWorkspaceUsers } from '@/app/actions/calendar';
import { exportLeaves } from '@/app/actions/leave';
import Swal from 'sweetalert2';

interface CalendarHeaderProps {
  onUserFilterChange?: (userId: string) => void;
  selectedUserId?: string;
}

export default function CalendarHeader({ onUserFilterChange, selectedUserId }: CalendarHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const result = await getWorkspaceUsers();
      if (!result.error) {
        setUsers(result.users || []);
      }
    }
    fetchUsers();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    const result = await exportLeaves(selectedUserId);
    if (result.success && result.csv) {
      // Create download link
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename || 'leaves_export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'Leave data has been exported successfully.',
        confirmButtonColor: '#2563eb',
        timer: 2000,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: result.error || 'Failed to export leave data.',
        confirmButtonColor: '#2563eb',
      });
    }
    setIsExporting(false);
  };

  const selectedUser = users.find(u => u._id === selectedUserId);

  return (
    <div className='mb-6 flex justify-between items-center'>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Calendar</h1>
            <p className='text-gray-500'>View holidays and employee leaves.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* User Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserFilter(!showUserFilter)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">{selectedUser ? selectedUser.name : 'All Users'}</span>
            </button>
            
            {showUserFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                <button
                  onClick={() => {
                    onUserFilterChange?.('');
                    setShowUserFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  All Users
                </button>
                {users.map(user => (
                  <button
                    key={user._id}
                    onClick={() => {
                      onUserFilterChange?.(user._id);
                      setShowUserFilter(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>

          {/* Apply Leave Button */}
          <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-lg shadow-gray-200 hover:-translate-y-0.5 transform active:translate-y-0"
          >
              <Plus className="w-4 h-4" />
              <span>Apply Leave</span>
          </button>
        </div>

        {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
