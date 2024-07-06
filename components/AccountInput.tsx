import { useState, FormEvent } from 'react';

interface AccountInputProps {
  onSubmit: (instagramUsername: string, facebookUsername: string) => void;
}

export default function AccountInput({ onSubmit }: AccountInputProps) {
  const [instagramUsername, setInstagramUsername] = useState('');
  const [facebookUsername, setFacebookUsername] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(instagramUsername, facebookUsername);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={instagramUsername}
        onChange={(e) => setInstagramUsername(e.target.value)}
        placeholder="Instagram Username"
        className="mr-2 p-2 border rounded"
      />
      <input
        type="text"
        value={facebookUsername}
        onChange={(e) => setFacebookUsername(e.target.value)}
        placeholder="Facebook Username"
        className="mr-2 p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch Metrics
      </button>
    </form>
  );
}