import { useState } from "react";
import { Eye, AlertCircle } from "lucide-react";
import { decryptData } from "@/lib/utils";

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
    fetchSecret();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
      {!isViewing ? (
        <div className="text-center flex flex-col">
          <p className="text-gray-300 mb-4">
            Viewing this secret will delete it.
          </p>
          <button
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center hover:bg-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={handleViewSecret}
          >
            <Eye className="mr-2" size={18} />
            View Secret
          </button>
        </div>
      ) : (
        <div>
          {secret ? (
            <>
              <h2 className="text-xl text-gray-100 font-bold mb-2">Your Secret:</h2>
              <div className="bg-gray-700 p-4 rounded-md">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {secret}
                </p>
              </div>
            </>
          ) : error ? (
            <div className="mt-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
              <div className="flex items-center">
                <AlertCircle className="mr-2" size={18} />
                <span className="block sm:inline pl-2 pr-2">{error}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-300">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default View;
