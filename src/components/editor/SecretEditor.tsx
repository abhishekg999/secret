import { useState, useRef, useEffect, useCallback } from "react";
import { ImagePlus } from "lucide-react";
import { nanoid } from "nanoid";
import { MESSAGE_MIN_HEIGHT, MESSAGE_MAX_HEIGHT, MAX_PAYLOAD_BYTES } from "@/constants";
import { compressImageFile, dataUrlByteSize } from "@/lib/image";
import { contentSize } from "@/lib/payload";
import type { Attachment } from "@/lib/types";
import AttachmentList from "./AttachmentList";
import SizeBudget from "./SizeBudget";

type SecretEditorProps = {
  text: string;
  onTextChange: (text: string) => void;
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  disabled: boolean;
};

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

  const addImages = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      const newAttachments: Attachment[] = [];
      for (const file of imageFiles) {
        const dataUrl = await compressImageFile(file);
        newAttachments.push({
          id: nanoid(8),
          name: file.name,
          dataUrl,
          size: dataUrlByteSize(dataUrl),
        });
      }
      onAttachmentsChange([...attachments, ...newAttachments]);
    },
    [attachments, onAttachmentsChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData.files);
      if (files.some((f) => f.type.startsWith("image/"))) {
        e.preventDefault();
        addImages(files);
      }
    },
    [addImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      addImages(files);
    },
    [addImages]
  );

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div
      className={`flex flex-col gap-3 ${
        dragOver ? "ring-2 ring-purple-500 ring-inset" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <textarea
        ref={textareaRef}
        className="w-full p-3 border border-gray-600 focus:border-2 focus:border-purple-900 focus:outline-none resize-none bg-gray-700 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out overflow-y-auto"
        style={{
          minHeight: `${MESSAGE_MIN_HEIGHT}px`,
          maxHeight: `${MESSAGE_MAX_HEIGHT}px`,
        }}
        placeholder="Enter your secret here..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onPaste={handlePaste}
        disabled={disabled}
      />

      <AttachmentList attachments={attachments} onRemove={handleRemove} />

      {!disabled && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ImagePlus size={16} />
            Add Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                addImages(Array.from(e.target.files));
                e.target.value = "";
              }
            }}
          />
          <div className="flex-grow">
            <SizeBudget usedBytes={usedBytes} maxBytes={MAX_PAYLOAD_BYTES} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretEditor;
