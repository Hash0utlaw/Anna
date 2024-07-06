
const { scrapeInstagram, scrapeFacebook } = require('./lib/scraper');
const fs = require('fs');
const path = require('path');

async function runScraper() {
  const instagramUsername = 'bikes_vs_cops';
  const facebookUsername = 'bikes_vs_cops';

  try {
    const instagramMetrics = await scrapeInstagram(instagramUsername);
    const facebookMetrics = await scrapeFacebook(facebookUsername);

    const data = {
      instagram: instagramMetrics,
      facebook: facebookMetrics,
      date: new Date().toISOString()
    };

    const outputPath = path.join(__dirname, 'scraped-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('Scraped data saved to:', outputPath);
  } catch (error) {
    console.error('Error running scraper:', error);
  }
}

runScraper();

