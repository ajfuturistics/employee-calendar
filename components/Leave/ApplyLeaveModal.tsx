'use client';

import { useState } from 'react';
import { applyLeave } from '@/app/actions/leave';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ApplyLeaveModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await applyLeave(formData);
    setLoading(false);
    
    if (result?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Submit',
        text: result.error,
        confirmButtonColor: '#2563eb',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Leave Request Submitted',
        text: 'Your leave request has been submitted for approval.',
        confirmButtonColor: '#2563eb',
        timer: 2000,
      });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  required 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700" 
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  required 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700" 
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
            <select 
              name="type" 
              required 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-700"
            >
                <option value="">Select leave type</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="PAID">Paid Leave</option>
                <option value="UNPAID">Unpaid Leave</option>
                <option value="ANNUAL">Annual Leave</option>
                <option value="MATERNITY">Maternity Leave</option>
                <option value="PATERNITY">Paternity Leave</option>
                <option value="BEREAVEMENT">Bereavement Leave</option>
                <option value="STUDY">Study Leave</option>
                <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Reason (Optional)</label>
             <textarea 
               name="reason" 
               rows={3} 
               className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-700" 
               placeholder="Provide details about your leave request..."
             />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
              disabled={loading} 
              type="submit" 
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
