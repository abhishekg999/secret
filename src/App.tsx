import { useState } from 'react';
import { Copy, Link, AlertCircle } from 'lucide-react';

const OneTimeSecret = () => {
  const [secret, setSecret] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [inputEnabled, setInputEnabled] = useState(true);
  const [error, setError] = useState('');

  const handleCreateLink = () => {
    const data = secret.trim();
    if (!data.trim()) {
      setError('Please enter a secret to create a link.');
      return;
    }

    setInputEnabled(false);

    const fetchData = async () => {
      const response = await fetch('/api/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink(`${window.location.origin}/secret/${data.id}`);
      } else {
        setGeneratedLink('');
        setError('An error occurred while creating the secret link. Please refresh and try again.');
      }
    };

    fetchData();
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-gray-100 mb-4 text-center">Create One-Time Secret</h1>
        <textarea
          className="w-full h-32 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-700 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter your secret here..."
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          disabled={!inputEnabled}
          maxLength={10000}
        />
        <button
          className={`mt-4 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center ${!generatedLink
            ? 'hover:bg-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
            : 'opacity-50 cursor-not-allowed'
            }`}
          onClick={handleCreateLink}
          disabled={!inputEnabled}
        >
          <Link className="mr-2" size={18} />
          Create Secret Link
        </button>

        {generatedLink && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Your secret link:</p>
            <div className="flex items-center bg-gray-700 p-2 rounded-md">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-grow bg-transparent text-sm text-gray-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="ml-2 text-purple-400 hover:text-purple-300 transition duration-300 ease-in-out transform hover:scale-110"
                title="Copy to clipboard"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={18} />
              <span className="block sm:inline pl-2 pr-2">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneTimeSecret;