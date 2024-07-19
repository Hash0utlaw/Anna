import React, { useState } from 'react';

export default function HashtagFetcher() {
  const [hashtag, setHashtag] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    setLinks([]);

    try {
      const response = await fetch('/api/fetchHashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hashtag }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.posts)) {
        setLinks(data.posts);
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format from server');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Instagram Hashtag Fetcher</h1>
      <div className="mb-4">
        <input
          type="text"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="Enter hashtag"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <button
        onClick={fetchLinks}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Links'}
      </button>
      
      {loading && <p className="text-center text-blue-500 mt-4">Loading links...</p>}
      {error && <p className="text-center text-red-500 mt-4">Error: {error}</p>}
      {links && links.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Found Links:</h2>
          <ul className="list-disc pl-5 space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}