'use client';

import { useState } from 'react';
import AccountInput from '../components/AccountInput';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (instagramUsername: string, facebookUsername: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('C:\Users\Max\Anna\app\api\fetchmetrics\metric.tsx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instagramUsername, facebookUsername }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Social Media Metrics Analyzer</h1>
      <AccountInput onSubmit={fetchMetrics} />
      {loading && <p className="text-blue-500">Loading metrics...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {metrics && <Dashboard metrics={metrics} />}
    </div>
  );
}
