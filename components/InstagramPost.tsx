import React, { useState } from 'react';

export default function InstagramPoster() {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
        setMedia(file);
        setError(null);
      } else {
        setError('Please select an image or video file.');
        setMedia(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media) {
      setError('Please select a media file to upload.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('media', media);

    try {
      const response = await fetch('/api/instapost', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess(true);
      console.log('Post created:', result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Post to Instagram</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="media" className="block text-sm font-medium text-gray-700">
            Image or Video
          </label>
          <input
            type="file"
            id="media"
            onChange={handleMediaChange}
            accept="image/*,video/*"
            className="mt-1 block w-full"
            required
          />
          {media && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {media.name} ({(media.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !media}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Posting...' : 'Post to Instagram'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">Post created successfully!</p>}
    </div>
  );
}