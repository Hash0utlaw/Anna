'use client';

import { useState } from 'react';
import AccountInput from '../components/AccountInput';
import Dashboard from '../components/Dashboard';

interface ProfileMetrics {
  followers: string;
  posts: string;
  following: string;
  engagementRate: string;
}

interface PostMetrics {
  likes: string;
  caption: string;
  date: string;
}

interface Metrics {
  type: 'profile' | 'post';
  data: ProfileMetrics | PostMetrics;
}

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (input: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fetchmetrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Metrics = await response.json();
      console.log('API response:', data);
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testApi = async () => {
    try {
      const response = await fetch('/api/test');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Test API response:', data);
      alert('API test successful. Check console for details.');
    } catch (err) {
      console.error('Error testing API:', err);
      alert('API test failed. Check console for details.');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Instagram Metrics Analyzer</h1>
      <button onClick={testApi} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Test API
      </button>
      <AccountInput onSubmit={fetchMetrics} />
      {loading && <p className="text-blue-500">Loading metrics...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {metrics && <Dashboard metrics={metrics} />}
    </div>
  );
}