'use client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { scrapeInstagram } from '../../lib/scraper'

type ProfileMetrics = {
  followers: string;
  following: string;
  posts: string;
  engagementRate: string;
}

type PostMetrics = {
  likes: string;
  caption: string;
  date: string;
}

type MetricsData = {
  type: 'profile' | 'post';
  data: ProfileMetrics | PostMetrics;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetricsData | { error: string }>
) {
  if (req.method === 'POST') {
    const { input } = req.body;
    
    console.log('Received request with body:', req.body);

    try {
      console.log('Attempting to scrape Instagram...');
      const metrics = await scrapeInstagram(input);
      console.log('Instagram metrics:', metrics);

      const isPostMetrics = 'likes' in metrics;

      res.status(200).json({
        type: isPostMetrics ? 'post' : 'profile',
        data: metrics
      });
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}