import { X, File as FileIcon } from "lucide-react";
import type { Attachment } from "@/lib/types";

interface AttachmentListProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const AttachmentList = ({ attachments, onRemove }: AttachmentListProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-edge-subtle pt-3">
      {attachments.map((att) => (
        <div key={att.id} className="group flex items-center gap-3 bg-surface-inset px-3 py-2">
          {att.mimeType.startsWith("image/") ? (
            <img src={att.dataUrl} alt={att.name} className="h-8 w-8 flex-shrink-0 object-cover" />
          ) : (
            <FileIcon size={16} className="h-8 w-8 flex-shrink-0 p-1.5 text-content-muted" />
          )}
          <span className="flex-grow truncate text-sm text-content-body">{att.name}</span>
          <span className="flex-shrink-0 text-xs text-content-faint">{formatSize(att.size)}</span>
          <button
            type="button"
            onClick={() => {
              onRemove(att.id);
            }}
            className="flex-shrink-0 text-content-faint transition-colors hover:text-danger-muted"
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
