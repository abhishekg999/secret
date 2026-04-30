import { useState, useRef, useEffect, useCallback } from "react";
import { Paperclip } from "lucide-react";
import { nanoid } from "nanoid";
import { MESSAGE_MIN_HEIGHT, MESSAGE_MAX_HEIGHT, MAX_PAYLOAD_BYTES } from "@/constants";
import { contentSize } from "@/lib/payload";
import type { Attachment } from "@/lib/types";
import AttachmentList from "./AttachmentList";
import SizeBudget from "./SizeBudget";

interface SecretEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  disabled: boolean;
}

const SecretEditor = ({
  text,
  onTextChange,
  attachments,
  onAttachmentsChange,
  disabled,
}: SecretEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MESSAGE_MIN_HEIGHT}px`;
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, MESSAGE_MAX_HEIGHT);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [text]);

  const usedBytes = disabled ? 0 : contentSize(text, attachments);

  const addFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const newAttachments: Attachment[] = [];
      for (const file of files) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => { resolve(reader.result as string); };
          reader.onerror = () => { reject(new Error("Failed to read file")); };
          reader.readAsDataURL(file);
        });
        newAttachments.push({
          id: nanoid(8),
          name: file.name,
          dataUrl,
          size: dataUrl.length,
          mimeType: file.type || "application/octet-stream",
        });
      }
      onAttachmentsChange([...attachments, ...newAttachments]);
    },
    [attachments, onAttachmentsChange],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData.files);
      if (files.length > 0) {
        e.preventDefault();
        void addFiles(files);
      }
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      void addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div
      className={`flex flex-col gap-3 ${dragOver ? "ring-2 ring-inset ring-accent-ring" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => {
        setDragOver(false);
      }}
      onDrop={handleDrop}
    >
      <textarea
        ref={textareaRef}
        className="w-full resize-none overflow-y-auto border border-edge-subtle bg-surface-inset p-3 text-content transition-all duration-300 ease-in-out focus:border-2 focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          minHeight: `${MESSAGE_MIN_HEIGHT}px`,
          maxHeight: `${MESSAGE_MAX_HEIGHT}px`,
        }}
        placeholder="Enter your secret here..."
        value={text}
        onChange={(e) => {
          onTextChange(e.target.value);
        }}
        onPaste={handlePaste}
        disabled={disabled}
      />

      <AttachmentList attachments={attachments} onRemove={handleRemove} />

      {!disabled && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-shrink-0 items-center gap-1.5 text-sm text-content-muted transition-colors hover:text-accent-muted"
          >
            <Paperclip size={16} />
            Attach File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                void addFiles(Array.from(e.target.files));
                e.target.value = "";
              }
            }}
          />
          <div className="min-w-[10rem] flex-grow">
            <SizeBudget usedBytes={usedBytes} maxBytes={MAX_PAYLOAD_BYTES} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretEditor;
