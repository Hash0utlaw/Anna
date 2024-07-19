# Instagram Toolkit

## Overview

Instagram Toolkit is a comprehensive web application designed to enhance your Instagram experience. It provides a suite of tools for Instagram users, marketers, and content creators to analyze metrics, fetch hashtag data, and automate posting.

## Features

1. **Metrics Analyzer**: 
   - Fetch and display metrics for Instagram profiles and posts.
   - View follower count, following count, post count, and engagement rate for profiles.
   - See likes, views, captions, and post dates for individual posts.

2. **Hashtag Fetcher**:
   - Retrieve recent posts associated with a specific hashtag.
   - View and access links to posts using the searched hashtag.

3. **Instagram Poster**:
   - Automate posting images and videos to Instagram.
   - Add captions to your posts directly from the application.

## Technologies Used

- Frontend: React.js with Next.js framework
- Backend: Node.js with Next.js API routes
- Styling: Tailwind CSS
- Web Scraping: Puppeteer
- Instagram API Integration: axios for HTTP requests

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/instagram-toolkit.git
   cd instagram-toolkit
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   INSTAGRAM_APP_ID=your_instagram_app_id
   INSTAGRAM_APP_SECRET=your_instagram_app_secret
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token
   INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser to use the application.

## Usage

### Metrics Analyzer
1. Enter an Instagram username or post URL in the input field.
2. Click "Fetch Metrics" to view the analytics.

### Hashtag Fetcher
1. Enter a hashtag (without the # symbol) in the input field.
2. Click "Fetch Links" to see recent posts using that hashtag.

### Instagram Poster
1. Enter your post caption in the text area.
2. Upload an image or video file.
3. Click "Post to Instagram" to publish your post.

## Notes

- Ensure you have the necessary permissions and are complying with Instagram's terms of service when using these tools.
- The Instagram Poster feature requires a Facebook Developer account and an approved Instagram Graph API application.

## Future Improvements

- Implement user authentication for personalized experiences.
- Add more detailed analytics and data visualization.
- Expand hashtag features to include trending analysis.
- Implement scheduling functionality for Instagram posts.

## Contributing

Contributions to improve Instagram Toolkit are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.