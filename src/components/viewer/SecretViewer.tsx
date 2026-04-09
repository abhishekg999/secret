import { useState } from "react";
import { ImageIcon, Download, Expand } from "lucide-react";
import type { ContentBlock, ImageBlock } from "@/lib/types";
import { MESSAGE_MAX_HEIGHT } from "@/constants";
import Lightbox from "./Lightbox";

interface SecretViewerProps {
  blocks: ContentBlock[];
}

function downloadDataUrl(dataUrl: string, name: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = name;
  a.click();
}

const SecretViewer = ({ blocks }: SecretViewerProps) => {
  const [lightboxImage, setLightboxImage] = useState<ImageBlock | null>(null);

  const textBlocks = blocks.filter((b) => b.type === "text");
  const imageBlocks = blocks.filter((b): b is ImageBlock => b.type === "image");

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

        {imageBlocks.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-edge-subtle pt-3">
            {imageBlocks.map((block, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface-inset px-3 py-2">
                <img
                  src={block.content}
                  alt={block.name}
                  className="h-8 w-8 flex-shrink-0 object-cover"
                />
                <ImageIcon size={14} className="flex-shrink-0 text-content-muted" />
                <span className="flex-grow truncate text-sm text-content-body">{block.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxImage(block);
                  }}
                  className="flex-shrink-0 text-content-faint transition-colors hover:text-accent-muted"
                  title="Preview"
                >
                  <Expand size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadDataUrl(block.content, block.name);
                  }}
                  className="flex-shrink-0 text-content-faint transition-colors hover:text-accent-muted"
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxImage && (
        <Lightbox
          src={lightboxImage.content}
          alt={lightboxImage.name}
          onClose={() => {
            setLightboxImage(null);
          }}
        />
      )}
    </div>
  );
};

export default SecretViewer;
