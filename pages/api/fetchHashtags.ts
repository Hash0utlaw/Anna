import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

puppeteer.use(StealthPlugin());

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
];

async function getRandomUserAgent(): Promise<string> {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrollPage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function scrapeHashtags(hashtag: string, retries = 3): Promise<string[]> {
  let browser: Browser | undefined;
  try {
    console.log(`Launching browser to scrape hashtag: ${hashtag}`);
    browser = await puppeteer.launch({
      headless: false,  // Change to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--lang=en-US,en']
    });

    const page = await browser.newPage();
    const userAgent = await getRandomUserAgent();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1920, height: 1080 });

    // Set the language to English
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    console.log(`Navigating to hashtag page: ${hashtag}`);
    const response = await page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(hashtag)}/`, { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log(`Response status: ${response?.status()}`);
    console.log(`Response URL: ${response?.url()}`);

    await delay(Math.random() * 5000 + 15000); // Random delay between 15-20 seconds

    await page.waitForSelector('body', { timeout: 60000 });

    const content = await page.content();
    console.log('Page content length:', content.length);

    // Check for login button
    const loginButtonSelector = 'button[type="submit"]';
    const hasLoginButton = await page.$(loginButtonSelector) !== null;
    console.log('Has login button:', hasLoginButton);

    if (hasLoginButton) {
      console.log('Redirected to login page. Instagram might be blocking the request.');
      throw new Error('Instagram requires login. Cannot scrape hashtags.');
    }

    // Scroll the page to load more content
    console.log('Scrolling page...');
    await scrollPage(page);
    await delay(5000);  // Wait for 5 seconds after scrolling

    // Extract all links from the page
    console.log('Extracting links...');
    const links = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a');
      return Array.from(anchors).map(a => a.href);
    });

    console.log(`Total links found: ${links.length}`);

    // Filter for post links
    const postLinks = links.filter(link => link.includes('/p/'));
    console.log(`Post links found: ${postLinks.length}`);

    if (postLinks.length === 0) {
      console.log('No post links found. Instagram might have changed its structure or is blocking the request.');
      console.log('Page HTML:', await page.content());
      throw new Error('Unable to find any post links.');
    }

    return postLinks;
  } catch (error) {
    console.error('Error scraping hashtags:', error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await delay(5000); // Wait 5 seconds before retrying
      return scrapeHashtags(hashtag, retries - 1);
    }
    throw new Error(`Failed to scrape hashtag data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { hashtag } = req.body;

    if (!hashtag || typeof hashtag !== 'string') {
      return res.status(400).json({ error: 'Invalid hashtag provided' });
    }

    try {
      const posts = await scrapeHashtags(hashtag);
      res.status(200).json({ posts });
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}