'use client';

import { generateReport } from '@/app/actions/report';
import { FileDown, Settings } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    async function handleExport() {
        setLoading(true);
        const result = await generateReport(new FormData());
        if (result.success && result.content) {
            // Trigger download
            const blob = new Blob([result.content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename!;
            a.click();
            window.URL.revokeObjectURL(url);
            
            Swal.fire({
                icon: 'success',
                title: 'Report Generated',
                text: 'Report has been downloaded successfully.',
                confirmButtonColor: '#2563eb',
                timer: 2000,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Generation Failed',
                text: 'Failed to generate report. Please try again.',
                confirmButtonColor: '#2563eb',
            });
        }
        setLoading(false);
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage workspace settings and exports.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <FileDown className="w-5 h-5 text-gray-500" />
            Export Data
        </h3>
        <p className="text-gray-600 mb-6">
            Download a text report of all approved employee leaves.
        </p>
        
        <button 
            onClick={handleExport}
            disabled={loading}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-gray-200 disabled:opacity-50"
        >
            {loading ? 'Generating...' : 'Download Report (.txt)'}
        </button>
      </div>
    </div>
  );
}
