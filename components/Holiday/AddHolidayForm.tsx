'use client';

import { createHoliday } from '@/app/actions/holiday';
import { useRef } from 'react';
import { Plus } from 'lucide-react';

export default function AddHolidayForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createHoliday(formData);
    formRef.current?.reset();
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Add New Holiday</h3>
        <form ref={formRef} action={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="e.g. Company Retreat" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
            </div>
            <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                    type="date" 
                    name="date" 
                    required 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
            </div>
            <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add
            </button>
        </form>
    </div>
  );
}
