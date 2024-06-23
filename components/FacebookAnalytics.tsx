'use client'
import React from 'react';
import useFetchData from '../hooks/useFetchData ';
import { AnalyticsProps } from '../types';

const FacebookAnalytics: React.FC<AnalyticsProps> = ({ accessToken, pageId }) => {
  const url = `/api/facebook?accessToken=${accessToken}&pageId=${pageId}`;
  const { data, loading, error } = useFetchData<any>(url);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Facebook Analytics</h2>
      <p>Followers: {data.followers_count}</p>
      {/* Add more metrics here */}
    </div>
  );
};

export default FacebookAnalytics;
