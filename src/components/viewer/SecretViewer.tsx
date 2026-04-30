import { useState } from "react";
import { FileText, File as FileIcon, Download } from "lucide-react";
import type { ContentBlock, AttachmentBlock } from "@/lib/types";
import { MESSAGE_MAX_HEIGHT } from "@/constants";
import Preview from "./Preview";

function AttachmentIcon({ block }: { block: AttachmentBlock }) {
  if (block.mimeType.startsWith("image/"))
    return (
      <img src={block.content} alt={block.name} className="h-8 w-8 flex-shrink-0 object-cover" />
    );
  if (block.mimeType === "application/pdf" || block.mimeType.startsWith("text/"))
    return <FileText size={16} className="flex-shrink-0 text-content-muted" />;
  return <FileIcon size={16} className="flex-shrink-0 text-content-muted" />;
}

const SecretViewer = ({ blocks }: { blocks: ContentBlock[] }) => {
  const [previewBlock, setPreviewBlock] = useState<AttachmentBlock | null>(null);

  const textBlocks = blocks.filter((b) => b.type === "text");
  const attachmentBlocks = blocks.filter((b): b is AttachmentBlock => b.type === "attachment");

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-grow bg-edge" />
        <h2 className="text-xs uppercase tracking-wider text-content-faint">Decrypted Message</h2>
        <div className="h-px flex-grow bg-edge" />
      </div>

      <div className="flex flex-col gap-3">
        {textBlocks.length > 0 && (
          <div
            className="overflow-y-auto border-l-4 border-accent bg-surface-inset p-6"
            style={{ maxHeight: `${MESSAGE_MAX_HEIGHT}px` }}
          >
            {textBlocks.map((block, i) => (
              <p
                key={i}
                className="whitespace-pre-wrap break-words leading-relaxed text-content-body"
              >
                {block.content}
              </p>
            ))}
          </div>
        )}

        {attachmentBlocks.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-edge-subtle pt-3">
            {attachmentBlocks.map((block, i) => (
              <div
                key={i}
                className="flex cursor-pointer items-center gap-3 bg-surface-inset px-3 py-2 ring-edge transition-shadow hover:ring-1"
                onClick={() => {
                  setPreviewBlock(block);
                }}
              >
                <AttachmentIcon block={block} />
                <span className="flex-grow truncate text-sm text-content-body">{block.name}</span>
                <a
                  href={block.content}
                  download={block.name}
                  className="flex-shrink-0 text-content-faint transition-colors hover:text-accent-muted"
                  title="Download"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewBlock && (
        <Preview
          block={previewBlock}
          onClose={() => {
            setPreviewBlock(null);
          }}
        />
      )}
    </div>
  );
};

export default SecretViewer;
