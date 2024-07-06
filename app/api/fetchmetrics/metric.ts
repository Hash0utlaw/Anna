// app/api/fetchMetrics/route.ts

import { NextResponse } from 'next/server';
import { scrapeInstagram, scrapeFacebook } from '../../../lib/scraper';

export async function POST(request: Request) {
  try {
    const { instagramUsername, facebookUsername } = await request.json();

    // Fetch metrics
    const instagramMetrics = await scrapeInstagram(instagramUsername);
    const facebookMetrics = await scrapeFacebook(facebookUsername);

    // Return the metrics
    return NextResponse.json({ 
      instagram: instagramMetrics, 
      facebook: facebookMetrics 
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}