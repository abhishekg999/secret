import { useState } from "react";
import { Copy, Link, AlertCircle, HelpCircle, GithubIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createEncryptionPair } from "@/lib/utils";
import { encodePayload, contentSize } from "@/lib/payload";
import { MAX_PAYLOAD_BYTES } from "@/constants";
import type { Attachment } from "@/lib/types";
import SecretEditor from "./editor/SecretEditor";

const Home = () => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [inputEnabled, setInputEnabled] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOverBudget = contentSize(text, attachments) > MAX_PAYLOAD_BYTES;
  const canSubmit = inputEnabled && !isOverBudget;

  const handleCreateLink = async () => {
    const hasContent = text.trim() || attachments.length > 0;
    if (!hasContent) {
      setError("Please enter a secret or attach an image.");
      return;
    }

    setInputEnabled(false);
    setIsSubmitting(true);
    setError("");

    try {
      const payload = encodePayload(text, attachments);
      const [key, enc] = await createEncryptionPair(payload, 21);

      const response = await fetch("/api/secret/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: enc }),
      });

      setText((prev) => prev.replace(/./g, "█"));
      setAttachments([]);

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink(`${window.location.origin}/${data.id}#${key}`);
      } else {
        setGeneratedLink("");
        setError(
          "An error occurred while creating the secret link. Please refresh and try again."
        );
      }
    } catch {
      setError("An unexpected error occurred. Please refresh and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="absolute top-6 right-6">
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="text-gray-400 hover:text-white w-8 h-8" />
          </PopoverTrigger>
          <PopoverContent className="bg-white text-gray-800 p-4 mx-6">
            <p className="text-sm">
              This site allows you to create one-time links{" "}
              <b className="text-purple-900">securely</b>. All data is
              end-to-end encrypted, the key{" "}
              <b className="text-red-800">never</b> leaves your device. If the
              link is viewed once, it is{" "}
              <b className="text-orange-900">permanently deleted</b> from the
              server.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <div className="bg-gray-800 p-6 w-[60%] min-w-[48rem] border border-gray-700">
        <h1 className="text-2xl font-bold text-gray-100 mb-4 text-center">
          Create One-Time Link
        </h1>

        <SecretEditor
          text={text}
          onTextChange={setText}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          disabled={!inputEnabled}
        />

        <button
          className={`mt-4 w-full bg-purple-900 text-white font-bold py-2 px-4 border-2 border-purple-900 transition-all duration-300 ease-in-out flex items-center justify-center ${
            isSubmitting ? "animate-pulse border-purple-500" : ""
          } ${
            canSubmit
              ? "hover:bg-purple-800 hover:border-purple-800"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleCreateLink}
          disabled={!canSubmit}
          title={isOverBudget ? "Content exceeds the 100 KB size limit" : undefined}
        >
          <Link className="mr-2" size={18} />
          Create Link
        </button>

        {generatedLink && (
          <div className="mt-4 animate-fade-in">
            <p className="text-sm text-gray-400 mb-2">Your secret link:</p>
            <div className="flex items-center bg-gray-700 p-3 border-l-4 border-purple-900">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-grow bg-transparent text-sm text-gray-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`ml-2 transition duration-300 ease-in-out ${
                  copied
                    ? "text-green-400"
                    : "text-purple-400 hover:text-purple-300"
                }`}
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                <Copy size={18} />
              </button>
              {copied && (
                <span className="ml-2 text-xs text-green-400 animate-pulse">
                  Copied!
                </span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div
            className="mt-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 animate-fade-in"
            role="alert"
          >
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={18} />
              <span className="block sm:inline pl-2 pr-2">{error}</span>
            </div>
          </div>
        )}
      </div>

      <footer className="sticky bottom-0 flex flex-col items-center text-center text-white w-full p-4 gap-2">
        <p className="text-xs text-gray-400 max-w-2xl">
          All data encrypted in your browser using AES-256-GCM. The decryption
          key never leaves your device.
        </p>
        <span className="flex gap-4 items-center text-sm">
          View the source on GitHub
          <a
            href="https://github.com/abhishekg999/secret"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={20} />
          </a>
        </span>
      </footer>
    </>
  );
};

export default Home;
