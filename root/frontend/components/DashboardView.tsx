import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner'; // Assuming this component exists

interface AnalyticsData {
  contractTypes: { name: string; count: number }[];
  alerts: { name: string; count: number }[];
  autoRenewal: { timeFrame: string; count: number }[];
  terminationForConvenience: { party: string; count: number }[];
}

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

// A reusable card component for the dashboard
const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => (
  <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-md border border-[var(--border-primary)]">
    <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="h-48 overflow-y-auto pr-2">{children}</div>
  </div>
);

// A simple list item for dashboard cards
const DataListItem: React.FC<{ name: string; count: number }> = ({ name, count }) => (
  <li className="flex justify-between items-center text-sm mb-2 py-1 border-b border-[var(--border-primary)] last:border-b-0">
    <span className="text-[var(--text-primary)]">{name}</span>
    <span className="font-semibold text-brand-blue">{count}</span>
  </li>
);

export const DashboardView: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/api/dashboard-analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Contract Types List */}
        <DashboardCard title="Contract Types">
          <ul>
            {analytics.contractTypes.map((item) => (
              <DataListItem key={item.name} name={item.name} count={item.count} />
            ))}
          </ul>
        </DashboardCard>
        
        {/* Alerts List */}
        <DashboardCard title="Alerts">
          <ul>
            {analytics.alerts.map((item) => (
              <DataListItem key={item.name} name={item.name} count={item.count} />
            ))}
          </ul>
        </DashboardCard>

        {/* Termination List */}
        <DashboardCard title="Termination for Convenience">
          <ul>
            {analytics.terminationForConvenience.map((item) => (
              <DataListItem key={item.party} name={item.party} count={item.count} />
            ))}
          </ul>
        </DashboardCard>

        {/* --- Chart Placeholders --- */}
        {/* You would replace these with an actual chart library (e.g., Recharts, Chart.js) */}
        
        <DashboardCard title="Classes (Chart Placeholder)">
           <div className="flex items-center justify-center h-full text-[var(--text-primary)]/70">
            [Bar Chart Visual]
           </div>
        </DashboardCard>

        <DashboardCard title="Auto-Renewal (Chart Placeholder)">
           <div className="flex items-center justify-center h-full text-[var(--text-primary)]/70">
            [Bar Chart Visual]
           </div>
        </DashboardCard>
        
        <DashboardCard title="Another Metric (Placeholder)">
           <div className="flex items-center justify-center h-full text-[var(--text-primary)]/70">
            [Metric Placeholder]
           </div>
        </DashboardCard>

      </div>
    </div>
  );
};