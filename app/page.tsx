'use client'
import Head from 'next/head';
import InstagramAnalytics from '../components/InstagramAnalytics';
import FacebookAnalytics from '../components/FacebookAnalytics';

export default function Home() {
  const instagramAccessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN as string;
  const instagramAccountId = process.env.NEXT_PUBLIC_INSTAGRAM_ACCOUNT_ID as string;
  const facebookAccessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN as string;
  const facebookPageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID as string;

  return (
    <div>
      <Head>
        <title>Social Media Analytics</title>
      </Head>
      <main>
        <h1>Social Media Analytics Dashboard</h1>
        <InstagramAnalytics accessToken={instagramAccessToken} accountId={instagramAccountId} />
        <FacebookAnalytics accessToken={facebookAccessToken} pageId={facebookPageId} />
      </main>
    </div>
  );
}

