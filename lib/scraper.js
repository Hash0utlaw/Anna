const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Ensure the chromedriver binary is in your PATH
const service = new chrome.ServiceBuilder(path.resolve('node_modules', 'chromedriver', 'bin', 'chromedriver')).build();

async function scrapeInstagram(username) {
  let driver = await new Builder().forBrowser('chrome').setChromeService(service).build();
  try {
    await driver.get(`https://www.instagram.com/${username}/`);

    // Wait for the content to load
    await driver.wait(until.elementLocated(By.css('header section ul')), 10000);

    const metrics = await driver.findElements(By.css('header section ul li'));
    const posts = await metrics[0].findElement(By.css('span')).getText();
    const followers = await metrics[1].findElement(By.css('span')).getText();
    const following = await metrics[2].findElement(By.css('span')).getText();

    // Calculate engagement rate (this is a simplified version)
    const postElements = await driver.findElements(By.css('article div > ul > li > div > span'));
    const recentPostEngagements = await Promise.all(postElements.slice(0, 3).map(el => el.getText()));
    const avgEngagement = recentPostEngagements.reduce((a, b) => a + parseInt(b.replace(/,/g, '')), 0) / recentPostEngagements.length;
    const followersCount = parseInt(followers.replace(/,/g, ''));
    const engagementRate = ((avgEngagement / followersCount) * 100).toFixed(2) + '%';

    return {
      posts,
      followers,
      following,
      engagementRate
    };

  } catch (error) {
    console.error('Error scraping Instagram:', error);
    return { error: 'Failed to scrape Instagram data' };
  } finally {
    await driver.quit();
  }
}

async function scrapeFacebook(username) {
  let driver = await new Builder().forBrowser('chrome').setChromeService(service).build();
  try {
    await driver.get(`https://www.facebook.com/${username}/`);

    // Wait for the content to load
    await driver.wait(until.elementLocated(By.css('div[role="main"]')), 10000);

    const likesElement = await driver.findElement(By.css('div[role="main"] div > div > div:nth-child(2) > div > div:nth-child(1)'));
    const followersElement = await driver.findElement(By.css('div[role="main"] div > div > div:nth-child(2) > div > div:nth-child(2)'));

    const likes = await likesElement.getText();
    const followers = await followersElement.getText();

    // Calculate engagement rate (this is a simplified version)
    const postElements = await driver.findElements(By.css('div[role="article"] div[role="button"][tabindex="0"]'));
    const recentPostEngagements = await Promise.all(postElements.slice(0, 3).map(el => el.getText()));
    const avgEngagement = recentPostEngagements.reduce((a, b) => a + parseInt(b.match(/\d+/)?.[0] || '0'), 0) / recentPostEngagements.length;
    const followersCount = parseInt(followers.replace(/,/g, ''));
    const engagementRate = ((avgEngagement / followersCount) * 100).toFixed(2) + '%';

    return {
      likes,
      followers,
      engagementRate
    };

  } catch (error) {
    console.error('Error scraping Facebook:', error);
    return { error: 'Failed to scrape Facebook data' };
  } finally {
    await driver.quit();
  }
}

module.exports = { scrapeInstagram, scrapeFacebook };
