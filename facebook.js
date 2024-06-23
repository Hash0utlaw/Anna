import axios from 'axios';

export default async function handler(req, res) {
  const { accessToken, pageId } = req.query;
  const url = `https://graph.facebook.com/v11.0/${pageId}`;
  const fields = "followers_count,likes_count,posts{likes.summary(true),comments.summary(true),shares.summary(true),insights.metric(post_impressions,post_engagements)}";
  const fullUrl = `${url}?fields=${fields}&access_token=${accessToken}`;

  try {
    const response = await axios.get(fullUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
