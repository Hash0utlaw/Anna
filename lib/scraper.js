const puppeteer = require('puppeteer');

async function scrapeInstagram(input) {
  let browser;
  try {
    console.log('Launching browser for Instagram...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a user agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Determine if the input is a username or a post URL
    const isPostUrl = input.includes('instagram.com/p/') || input.includes('instagram.com/reel/');
    const url = isPostUrl ? input : `https://www.instagram.com/${input}/`;

    console.log(`Navigating to Instagram ${isPostUrl ? 'post' : 'profile'}: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for a bit to allow any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Scraping data...');
    const data = await page.evaluate((isPostUrl) => {
      if (isPostUrl) {
        // Scraping post data
        const likesElement = document.querySelector('section._ae5m span');
        const captionElement = document.querySelector('div._a9zs');
        const dateElement = document.querySelector('time._aaqe');
        
        // Get all text content from the post
        const allText = document.body.innerText;

        // Check for alternative likes/views elements
        const alternativeLikesElement = document.querySelector('span._aacl._aacu');
        const viewsElement = document.querySelector('span.x1lliihq');

        // Attempt to find likes/views in the text content
        const likesMatch = allText.match(/(\d+(?:,\d+)*)\s+likes/);
        const viewsMatch = allText.match(/(\d+(?:,\d+)*)\s+views/);

        return {
          likes: likesElement ? likesElement.textContent : (likesMatch ? likesMatch[1] : 'N/A'),
          alternativeLikes: alternativeLikesElement ? alternativeLikesElement.textContent : 'N/A',
          views: viewsElement ? viewsElement.textContent : (viewsMatch ? viewsMatch[1] : 'N/A'),
          caption: captionElement ? captionElement.textContent : 'N/A',
          date: dateElement ? dateElement.getAttribute('datetime') : 'N/A',
          allText: allText.substring(0, 1000), // First 1000 characters of all text on the page
        };
      } else {
        // Scraping profile data
        const metaElement = document.querySelector('meta[property="og:description"]');
        if (!metaElement) return null;

        const content = metaElement.getAttribute('content');
        const [followers, following, posts] = content.split(' - ')[0].split(', ');

        return { followers, following, posts };
      }
    }, isPostUrl);

    console.log('Scraped data:', data);

    if (!data) {
      const pageContent = await page.content();
      console.error('Page content:', pageContent.substring(0, 1000)); // Log first 1000 characters of page content
      throw new Error('Failed to find data on page');
    }

    if (isPostUrl) {
      return data;
    } else {
      // Calculate engagement rate for profile (simplified version)
      const followersCount = parseInt(data.followers.replace(/,/g, ''), 10) || 1;
      const postsCount = parseInt(data.posts.replace(/,/g, ''), 10) || 1;
      const engagementRate = ((postsCount / followersCount) * 100).toFixed(2) + '%';

      return {
        ...data,
        engagementRate
      };
    }

  } catch (error) {
    console.error('Detailed error scraping Instagram:', error);
    throw new Error(`Failed to scrape Instagram data: ${error.message}`);
  } finally {
    if (browser) {
      console.log('Closing Instagram browser...');
      await browser.close();
    }
  }
}

module.exports = { scrapeInstagram };