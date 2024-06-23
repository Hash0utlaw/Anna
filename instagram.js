import axios from 'axios';

export default async function handler(req, res) {
  const { accessToken, accountId } = req.query;
  const url = `https://graph.facebook.com/v11.0/${accountId}`;
  const fields = "followers_count,media_count,media{like_count,comments_count,insights.metric(impressions,reach)}";
  const fullUrl = `${url}?fields=${fields}&access_token=${accessToken}`;

  try {
    const response = await axios.get(fullUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
