import { scrapeInstagram, scrapeFacebook } from 'lib/scraper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { instagramUsername, facebookUsername } = req.body;

    try {
      const instagramMetrics = await scrapeInstagram(instagramUsername);
      const facebookMetrics = await scrapeFacebook(facebookUsername);

      if (instagramMetrics.error || facebookMetrics.error) {
        throw new Error('Failed to fetch metrics');
      }

      res.status(200).json({ instagram: instagramMetrics, facebook: facebookMetrics });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


