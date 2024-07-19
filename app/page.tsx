'use client';

import { useState } from 'react';
import AccountInput from '../components/AccountInput';
import Dashboard from '../components/Dashboard';
import HashtagFetcher from '../components/HashtagFetcher';
import InstagramPoster from '../components/InstagramPost';
import '/Users/hashoutlaw/Anna/app/globals.css';

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
      console.log('API response:', data); // Debug log
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
    <h1 className="text-5xl font-bold mb-12 animate-color-change text-center">
      Instagram Toolkit
    
    </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-bold mb-6 gradient-text">Metrics Analyzer</h2>
          <div className="card glassmorphism">
            <AccountInput onSubmit={fetchMetrics} />
            {loading && <p className="text-center text-indigo-500">Loading metrics...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {metrics && <Dashboard metrics={metrics} />}
          </div>
        </div>
        
        <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h2 className="text-4xl font-bold mb-6 gradient-text">Post to Instagram</h2>
          <div className="card glassmorphism">
            <InstagramPoster />
          </div>
        </div>
      </div>
      
      <div className="mt-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
        <h2 className="text-4xl font-bold mb-6 gradient-text">Hashtag Fetcher</h2>
        <div className="card glassmorphism">
          <HashtagFetcher />
        </div>
      </div>
    </div>
  );
}