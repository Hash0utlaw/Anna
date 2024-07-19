import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File } from 'formidable';
import fs from 'fs';
import axios from 'axios';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const API_VERSION = 'v18.0'; // Update this as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const caption = Array.isArray(fields.caption) ? fields.caption[0] : fields.caption || '';
    const mediaFile = Array.isArray(files.media) ? files.media[0] : files.media;

    if (!mediaFile) {
      return res.status(400).json({ error: 'No media file uploaded' });
    }

    try {
      const mediaType = getMediaType(mediaFile.originalFilename || '');
      let mediaContainerResponse;

      if (mediaType === 'IMAGE') {
        mediaContainerResponse = await createImageMediaContainer(mediaFile.filepath, caption);
      } else if (mediaType === 'VIDEO') {
        mediaContainerResponse = await createVideoMediaContainer(mediaFile.filepath, caption);
      } else {
        throw new Error('Unsupported media type');
      }

      // Publish the media container
      const publishResponse = await publishMediaContainer(mediaContainerResponse.id);

      res.status(200).json({ message: 'Post created successfully', id: publishResponse.id });
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      res.status(500).json({ error: 'Error posting to Instagram' });
    } finally {
      // Clean up the temporary file
      fs.unlinkSync(mediaFile.filepath);
    }
  });
}

function getMediaType(filename: string): 'IMAGE' | 'VIDEO' | 'UNKNOWN' {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) return 'IMAGE';
  if (['.mp4', '.mov'].includes(ext)) return 'VIDEO';
  return 'UNKNOWN';
}

async function createImageMediaContainer(imagePath: string, caption: string) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const response = await axios.post(
    `https://graph.facebook.com/${API_VERSION}/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
    null,
    {
      params: {
        image_url: `data:image/jpeg;base64,${base64Image}`,
        caption: caption,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    }
  );

  return response.data;
}

async function createVideoMediaContainer(videoPath: string, caption: string) {
  // Step 1: Initialize the container for the video
  const initResponse = await axios.post(
    `https://graph.facebook.com/${API_VERSION}/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
    null,
    {
      params: {
        media_type: 'VIDEO',
        video_url: 'PENDING',
        caption: caption,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    }
  );

  const containerId = initResponse.data.id;

  // Step 2: Get the upload URL for the video
  const uploadUrlResponse = await axios.get(
    `https://graph.facebook.com/${API_VERSION}/${containerId}`,
    {
      params: {
        fields: 'video_url',
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    }
  );

  const uploadUrl = uploadUrlResponse.data.video_url;

  // Step 3: Upload the video file
  const videoBuffer = fs.readFileSync(videoPath);
  await axios.post(uploadUrl, videoBuffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  return { id: containerId };
}

async function publishMediaContainer(mediaId: string) {
  const response = await axios.post(
    `https://graph.facebook.com/${API_VERSION}/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`,
    null,
    {
      params: {
        creation_id: mediaId,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    }
  );

  return response.data;
}