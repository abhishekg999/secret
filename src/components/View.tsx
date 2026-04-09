import { useState } from "react";
import { Eye, AlertCircle, Plus } from "lucide-react";
import { decryptData } from "@/lib/crypto";
import { decodePayload } from "@/lib/payload";
import type { ContentBlock } from "@/lib/types";
import SecretViewer from "./viewer/SecretViewer";

interface ViewProps {
  hash: string;
}

const View = ({ hash }: ViewProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[] | null>(null);
  const [error, setError] = useState("");
  const [isViewing, setIsViewing] = useState(false);

  const key = window.location.hash.split("#")[1] ?? "";

  const fetchSecret = async () => {
    const response = await fetch(`/api/secret/${hash}`, {
      method: "POST",
      cache: "no-store",
    });

    if (response.ok) {
      try {
        const json = (await response.json()) as { data: string };
        const decrypted = await decryptData(key, json.data);

        if (decrypted === null) {
          setError(
            "The secret could not be decrypted, any existing data has been deleted. If this issue persists, please open an issue on GitHub.",
          );
          return;
        }

        setBlocks(decodePayload(decrypted));
      } catch {
        setError(
          "An error occurred while processing the secret. Any existing data has been deleted.",
        );
      }
    } else {
      setError("Secret not found or has been deleted.");
    }
  };

  const handleViewSecret = () => {
    setIsViewing(true);
    window.history.replaceState(null, "", window.location.pathname);
    void fetchSecret();
  };

  return (
    <div className="w-[60%] min-w-[48rem] border border-edge bg-surface-raised p-6">
      {!isViewing ? (
        <div className="flex flex-col text-center">
          <p className="mb-4 text-content-body">Viewing this secret will delete it.</p>
          <button
            className="flex items-center justify-center border-2 border-accent bg-accent px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:border-accent-hover hover:bg-accent-hover"
            onClick={handleViewSecret}
          >
            <Eye className="mr-2" size={18} />
            View Secret
          </button>
        </div>
      ) : (
        <div>
          {blocks ? (
            <div className="animate-fade-in flex flex-col gap-6">
              <SecretViewer blocks={blocks} />
              <div className="flex flex-col items-center gap-3 border-t border-edge pt-4">
                <p className="text-sm text-content-muted">
                  This message has been permanently deleted.
                </p>
                <a
                  href="/"
                  className="flex items-center gap-2 border-2 border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:border-accent-hover hover:bg-accent-hover"
                >
                  <Plus size={16} />
                  Create your own
                </a>
              </div>
            </div>
          ) : error ? (
            <div className="animate-fade-in flex flex-col gap-6">
              <div
                className="border border-danger-edge bg-danger px-4 py-3 text-danger-content"
                role="alert"
              >
                <div className="flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  <span className="block pl-2 pr-2 sm:inline">{error}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 border-t border-edge pt-4">
                <a
                  href="/"
                  className="flex items-center gap-2 border-2 border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:border-accent-hover hover:bg-accent-hover"
                >
                  <Plus size={16} />
                  Create your own
                </a>
              </div>
            </div>
          ) : (
            <p className="animate-pulse text-content-body">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default View;
