'use client'
import { useState } from 'react';

interface AccountInputProps {
  onSubmit: (input: string) => void;
}

export default function AccountInput({ onSubmit }: AccountInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Instagram username or post URL"
        className="mr-2 p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch Metrics
      </button>
    </form>
  );
}