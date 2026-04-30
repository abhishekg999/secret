import { useState } from "react";
import { Copy, Link, AlertCircle, HelpCircle, GithubIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createEncryptionPair } from "@/lib/crypto";
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
      setError("Please enter a secret or attach a file.");
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
        const data: { id: string } = (await response.json()) as { id: string };
        setGeneratedLink(`${window.location.origin}/${data.id}#${key}`);
      } else {
        setGeneratedLink("");
        setError("An error occurred while creating the secret link. Please refresh and try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please refresh and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <div className="w-full max-w-3xl border border-edge bg-surface-raised p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-content sm:text-2xl">Create One-Time Link</h1>
          <Popover>
            <PopoverTrigger aria-label="How this works">
              <HelpCircle className="h-6 w-6 flex-shrink-0 text-content-muted hover:text-content sm:h-7 sm:w-7" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[calc(100vw-2rem)] max-w-sm sm:w-96">
              <p className="text-sm">
                This site allows you to create one-time links{" "}
                <b className="text-accent-muted">securely</b>. All data is end-to-end encrypted, the
                key <b className="text-danger-muted">never</b> leaves your device. If the link is
                viewed once, it is <b className="text-warning-content">permanently deleted</b> from
                the server. Unviewed links automatically expire after{" "}
                <b className="text-warning-content">24 hours</b>.
              </p>
            </PopoverContent>
          </Popover>
        </div>

        <SecretEditor
          text={text}
          onTextChange={setText}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          disabled={!inputEnabled}
        />

        <button
          className={`mt-4 flex w-full items-center justify-center border-2 border-accent bg-accent px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out ${
            isSubmitting ? "animate-pulse border-accent-ring" : ""
          } ${
            canSubmit
              ? "hover:border-accent-hover hover:bg-accent-hover"
              : "cursor-not-allowed opacity-50"
          }`}
          onClick={() => {
            void handleCreateLink();
          }}
          disabled={!canSubmit}
          title={isOverBudget ? "Content exceeds the 100 KB size limit" : undefined}
        >
          <Link className="mr-2" size={18} />
          Create Link
        </button>

        {generatedLink && (
          <div className="animate-fade-in mt-4">
            <p className="mb-2 text-sm text-content-muted">Your secret link:</p>
            <div className="flex items-center gap-2 border-l-4 border-accent bg-surface-inset p-3">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="min-w-0 flex-grow bg-transparent text-sm text-content-body focus:outline-none"
              />
              {copied && (
                <span className="flex-shrink-0 animate-pulse text-xs text-success">Copied!</span>
              )}
              <button
                onClick={handleCopyLink}
                className={`flex-shrink-0 transition duration-300 ease-in-out ${
                  copied ? "text-success" : "text-accent-muted hover:text-accent-ring"
                }`}
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                <Copy size={18} />
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-content-muted">
              <Clock size={12} />
              This link expires in 24 hours if not viewed.
            </p>
          </div>
        )}

        {error && (
          <div
            className="animate-fade-in mt-4 border border-danger-edge bg-danger px-4 py-3 text-danger-content"
            role="alert"
          >
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={18} />
              <span className="block pl-2 pr-2 sm:inline">{error}</span>
            </div>
          </div>
        )}
      </div>

      <footer className="sticky bottom-0 flex w-full flex-col items-center gap-2 p-4 text-center text-white">
        <p className="max-w-2xl text-xs text-content-muted">
          All data encrypted in your browser using AES-256-GCM. The decryption key never leaves your
          device.
        </p>
        <span className="flex items-center gap-4 text-sm">
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
