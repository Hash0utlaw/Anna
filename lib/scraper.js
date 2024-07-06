// lib/scraper.js

import puppeteer from 'puppeteer';

export async function scrapeInstagram(username) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle0' });

    // Wait for the content to load
    await page.waitForSelector('header section ul');

    const metrics = await page.evaluate(() => {
      const listItems = document.querySelectorAll('header section ul li');
      
      const posts = listItems[0]?.querySelector('span')?.textContent;
      const followers = listItems[1]?.querySelector('span')?.textContent;
      const following = listItems[2]?.querySelector('span')?.textContent;

      return { posts, followers, following };
    });

    // Calculate engagement rate (this is a simplified version)
    const recentPostEngagements = await page.evaluate(() => {
      const postElements = document.querySelectorAll('article div > ul > li > div > span');
      return Array.from(postElements).slice(0, 3).map(el => parseInt(el.textContent.replace(/,/g, '') || '0'));
    });

    const avgEngagement = recentPostEngagements.reduce((a, b) => a + b, 0) / recentPostEngagements.length;
    const followersCount = parseInt(metrics.followers.replace(/,/g, ''));
    const engagementRate = ((avgEngagement / followersCount) * 100).toFixed(2) + '%';

    return {
      ...metrics,
      engagementRate
    };

  } catch (error) {
    console.error('Error scraping Instagram:', error);
    return { error: 'Failed to scrape Instagram data' };
  } finally {
    await browser.close();
  }
}

export async function scrapeFacebook(username) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://www.facebook.com/${username}/`, { waitUntil: 'networkidle0' });

    // Wait for the content to load
    await page.waitForSelector('div[role="main"]');

    const metrics = await page.evaluate(() => {
      const likesElement = document.querySelector('div[role="main"] div > div > div:nth-child(2) > div > div:nth-child(1)');
      const followersElement = document.querySelector('div[role="main"] div > div > div:nth-child(2) > div > div:nth-child(2)');
      
      const likes = likesElement?.textContent.split(' ')[0];
      const followers = followersElement?.textContent.split(' ')[0];

      return { likes, followers };
    });

    // Calculate engagement rate (this is a simplified version)
    const recentPostEngagements = await page.evaluate(() => {
      const postElements = document.querySelectorAll('div[role="article"] div[role="button"][tabindex="0"]');
      return Array.from(postElements).slice(0, 3).map(el => {
        const text = el.textContent;
        return parseInt(text.match(/\d+/)?.[0] || '0');
      });
    });

    const avgEngagement = recentPostEngagements.reduce((a, b) => a + b, 0) / recentPostEngagements.length;
    const followersCount = parseInt(metrics.followers.replace(/,/g, ''));
    const engagementRate = ((avgEngagement / followersCount) * 100).toFixed(2) + '%';

    return {
      ...metrics,
      engagementRate
    };

  } catch (error) {
    console.error('Error scraping Facebook:', error);
    return { error: 'Failed to scrape Facebook data' };
  } finally {
    await browser.close();
  }
}