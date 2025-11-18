import React from 'react';
import { ChartBarIcon } from '@heroicons/react/outline';

export default function DashboardTab({ documents }) {
  const totalDocs = documents.length;
  
  // Mock data for visuals
  const recentRisk = 75; 

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-tertiary)] p-6 rounded-xl border border-[var(--border-primary)]">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Total Contracts</h4>
            <p className="text-3xl font-bold mt-2">{totalDocs}</p>
        </div>
        <div className="bg-[var(--bg-tertiary)] p-6 rounded-xl border border-[var(--border-primary)]">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Avg. Risk Score</h4>
            <div className="flex items-end gap-2 mt-2">
                <p className={`text-3xl font-bold ${recentRisk > 50 ? 'text-amber-500' : 'text-green-500'}`}>{recentRisk}/100</p>
                <span className="text-sm text-gray-400 mb-1">Moderate</span>
            </div>
        </div>
        <div className="bg-[var(--bg-tertiary)] p-6 rounded-xl border border-[var(--border-primary)]">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Pending Review</h4>
            <p className="text-3xl font-bold mt-2">2</p>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-primary)] flex flex-col items-center justify-center min-h-[300px] text-center">
         <ChartBarIcon className="w-12 h-12 text-gray-300 mb-4" />
         <h3 className="text-lg font-medium text-[var(--text-primary)]">Legal Insights Visualizer</h3>
         <p className="text-[var(--text-secondary)] max-w-md mt-2">
            Upload more contracts to see detailed charts on contract types, expiration dates, and risk distribution.
         </p>
      </div>
    </div>
  );
}