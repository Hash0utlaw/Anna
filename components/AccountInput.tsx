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
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Instagram username or post URL"
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          Fetch Metrics
        </button>
      </div>
    </form>
  );
}