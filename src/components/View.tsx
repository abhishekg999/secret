import { useState } from "react";
import { Eye, AlertCircle, Plus } from "lucide-react";
import { decryptData } from "@/lib/utils";
import { MESSAGE_MAX_HEIGHT } from "@/constants";

type ViewProps = {
  hash: string;
};

const View = ({ hash }: ViewProps) => {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [isViewing, setIsViewing] = useState(false);

  const key = window.location.hash.split("#")[1];

  const fetchSecret = async () => {
    const response = await fetch(`/api/secret/${hash}`, {
      method: 'POST',
      cache: "no-store",
    });

    if (response.ok) {
      try {
        const json: { data: string } = await response.json();
        const decrypted = await decryptData(key, json.data);

        if (decrypted === null) {
          setError("The secret could not be decrypted, any existing data has been deleted. If this issue persists, please open an issue on GitHub.");
          return;
        }
        setSecret(decrypted);
      } catch (e) {
        setError("An error occurred while processing the secret. Any existing data has been deleted.");
      }
    } else {
      setError("Secret not found or has been deleted.");
    }
  };

  const handleViewSecret = () => {
    setIsViewing(true);
    window.history.replaceState(null, '', window.location.pathname);
    fetchSecret();
  };

  return (
    <div className="bg-gray-800 p-6 w-full max-w-3xl border border-gray-700">
      {!isViewing ? (
        <div className="text-center flex flex-col">
          <p className="text-gray-300 mb-4">
            Viewing this secret will delete it.
          </p>
          <button
            className="bg-purple-900 text-white font-bold py-2 px-4 border-2 border-purple-900 transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-purple-800 hover:border-purple-800"
            onClick={handleViewSecret}
          >
            <Eye className="mr-2" size={18} />
            View Secret
          </button>
        </div>
      ) : (
        <div>
          {secret ? (
            <div className="animate-fade-in flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-grow bg-gray-700"></div>
                  <h2 className="text-xs tracking-wider text-gray-500 uppercase">Decrypted Message</h2>
                  <div className="h-px flex-grow bg-gray-700"></div>
                </div>
                <div className="bg-gray-700 p-6 border-l-4 border-purple-900 overflow-y-auto" style={{ maxHeight: `${MESSAGE_MAX_HEIGHT}px` }}>
                  <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                    {secret}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">This message has been permanently deleted.</p>
                <a 
                  href="/"
                  className="bg-purple-900 text-white text-sm font-medium py-2 px-4 border-2 border-purple-900 transition-all duration-300 ease-in-out flex items-center gap-2 hover:bg-purple-800 hover:border-purple-800"
                >
                  <Plus size={16} />
                  Create your own
                </a>
              </div>
            </div>
          ) : error ? (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3" role="alert">
                <div className="flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  <span className="block sm:inline pl-2 pr-2">{error}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-700">
                <a 
                  href="/"
                  className="bg-purple-900 text-white text-sm font-medium py-2 px-4 border-2 border-purple-900 transition-all duration-300 ease-in-out flex items-center gap-2 hover:bg-purple-800 hover:border-purple-800"
                >
                  <Plus size={16} />
                  Create your own
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 animate-pulse">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default View;
