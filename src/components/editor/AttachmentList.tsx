import { X, ImageIcon } from "lucide-react";
import type { Attachment } from "@/lib/types";

type AttachmentListProps = {
  attachments: Attachment[];
  onRemove: (id: string) => void;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const AttachmentList = ({ attachments, onRemove }: AttachmentListProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="border-t border-gray-600 pt-3 flex flex-col gap-2">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="flex items-center gap-3 bg-gray-700 px-3 py-2 group"
        >
          <img
            src={att.dataUrl}
            alt={att.name}
            className="w-8 h-8 object-cover flex-shrink-0"
          />
          <ImageIcon size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-300 truncate flex-grow">
            {att.name}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatSize(att.size)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(att.id)}
            className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
