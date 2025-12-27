'use client';

import { updateLeaveStatus } from '@/app/actions/leave';
import { format } from 'date-fns';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function LeaveList({ leaves, title, isHrView = false, showRejectionReason = false }: { leaves: any[]; title: string; isHrView?: boolean; showRejectionReason?: boolean }) {
    
    const [processing, setProcessing] = useState<string | null>(null);
    const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    async function handleAction(leaveId: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
        setProcessing(leaveId);
        await updateLeaveStatus(leaveId, status, reason);
        setProcessing(null);
        setRejectingLeaveId(null);
        setRejectionReason('');
    }

    function handleRejectClick(leaveId: string) {
        setRejectingLeaveId(leaveId);
    }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {leaves.length > 0 && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{leaves.length}</span>}
      </div>
      
      {leaves.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
            No leaves found.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
            {leaves.map((leave) => (
                <div key={leave._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0",
                                leave.type === 'SICK' ? "bg-rose-500" : 
                                leave.type === 'CASUAL' ? "bg-sky-500" : "bg-emerald-500"
                            )}>
                                {leave.type[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 leading-tight">
                                    {isHrView ? leave.userId.name : leave.type + ' Leave'}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                                     <span>{format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}</span>
                                     <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                     <span className="truncate">{leave.reason || 'No reason provided'}</span>
                                </div>
                                {showRejectionReason && leave.rejectionReason && (
                                    <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                        <div className="text-xs text-red-800">
                                            <span className="font-semibold">Rejection Reason: </span>
                                            {leave.rejectionReason}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                            {!isHrView && (
                                 <span className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium border shrink-0",
                                    leave.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    leave.status === 'REJECTED' ? "bg-red-50 text-red-700 border-red-200" :
                                    "bg-amber-50 text-amber-700 border-amber-200"
                                )}>
                                    {leave.status}
                                </span>
                            )}

                            {isHrView && leave.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <button 
                                        disabled={!!processing}
                                        onClick={() => handleAction(leave._id, 'APPROVED')}
                                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                        disabled={!!processing}
                                        onClick={() => handleRejectClick(leave._id)}
                                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {isHrView && leave.status !== 'PENDING' && (
                                 <span className="text-xs text-gray-400 font-medium">
                                    {leave.status}
                                 </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Reject Leave Request</h3>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (Optional)
                    </label>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                        rows={4}
                        placeholder="Provide a reason for rejecting this leave request..."
                    />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setRejectingLeaveId(null);
                            setRejectionReason('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleAction(rejectingLeaveId, 'REJECTED', rejectionReason || undefined)}
                        disabled={!!processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? 'Rejecting...' : 'Reject Leave'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
