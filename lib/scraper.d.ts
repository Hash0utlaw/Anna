interface Metrics {
    posts: string;
    followers: string;
    following: string;
    engagementRate: string;
    error?: string;
  }
  
  export function scrapeInstagram(username: string): Promise<Metrics>;
  export function scrapeFacebook(username: string): Promise<Metrics>;
  