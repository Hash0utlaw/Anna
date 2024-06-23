'use client'
import React from 'react';
import useFetchData from '../hooks/useFetchData ';
import { AnalyticsProps } from '../types';

const InstagramAnalytics: React.FC<AnalyticsProps> = ({ accessToken, accountId }) => {
  const url = `/api/instagram?accessToken=${accessToken}&accountId=${accountId}`;
  const { data, loading, error } = useFetchData<any>(url);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Instagram Analytics</h2>
      <p>Followers: {data.followers_count}</p>
      {/* Add more metrics here */}
    </div>
  );
};

export default InstagramAnalytics;


