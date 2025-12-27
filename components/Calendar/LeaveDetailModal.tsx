'use client';

import { X, Calendar, User, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LeaveDetailModalProps {
  leave: any;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export default function LeaveDetailModal({ leave, isOpen, onClose, currentUserId }: LeaveDetailModalProps) {
  if (!isOpen || !leave) return null;

  const isOwnLeave = leave.userId?._id === currentUserId;
  const startDate = new Date(leave.startDate);
  const endDate = new Date(leave.endDate);
  
  // Calculate number of days
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'SICK': 'bg-rose-100 text-rose-800 border-rose-200',
      'CASUAL': 'bg-sky-100 text-sky-800 border-sky-200',
      'PAID': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'UNPAID': 'bg-gray-100 text-gray-800 border-gray-200',
      'ANNUAL': 'bg-blue-100 text-blue-800 border-blue-200',
      'MATERNITY': 'bg-pink-100 text-pink-800 border-pink-200',
      'PATERNITY': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'BEREAVEMENT': 'bg-purple-100 text-purple-800 border-purple-200',
      'STUDY': 'bg-teal-100 text-teal-800 border-teal-200',
      'OTHER': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'APPROVED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'PENDING': 'bg-amber-100 text-amber-800 border-amber-200',
      'REJECTED': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Leave Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isOwnLeave ? 'Your leave request' : 'Team member leave'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {leave.userId?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{leave.userId?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{leave.userId?.email || ''}</p>
            </div>
          </div>

          {/* Leave Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Leave Type
              </label>
              <span className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border",
                getLeaveTypeColor(leave.type)
              )}>
                {leave.type}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Status
              </label>
              <span className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border",
                getStatusColor(leave.status)
              )}>
                {leave.status}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <p className="text-sm text-gray-900">
                  {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {daysDiff} {daysDiff === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            {/* Reason */}
            {leave.reason && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Reason
                  </label>
                  <p className="text-sm text-gray-700">{leave.reason}</p>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {leave.status === 'REJECTED' && leave.rejectionReason && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <X className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">
                    Rejection Reason
                  </label>
                  <p className="text-sm text-red-800">{leave.rejectionReason}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            {leave.createdAt && (
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Submitted
                  </label>
                  <p className="text-sm text-gray-600">
                    {format(new Date(leave.createdAt), 'MMM dd, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Read-only notice */}
          {!isOwnLeave && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Read-only:</span> You can view this leave request but cannot modify it.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
