import { useState } from "react";
import { ImageIcon, Download, Expand } from "lucide-react";
import type { ContentBlock, ImageBlock } from "@/lib/types";
import { MESSAGE_MAX_HEIGHT } from "@/constants";
import Lightbox from "./Lightbox";

type SecretViewerProps = {
  blocks: ContentBlock[];
};

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
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-grow bg-gray-700" />
        <h2 className="text-xs tracking-wider text-gray-500 uppercase">
          Decrypted Message
        </h2>
        <div className="h-px flex-grow bg-gray-700" />
      </div>

      <div className="flex flex-col gap-3">
        {textBlocks.length > 0 && (
          <div
            className="bg-gray-700 p-6 border-l-4 border-purple-900 overflow-y-auto"
            style={{ maxHeight: `${MESSAGE_MAX_HEIGHT}px` }}
          >
            {textBlocks.map((block, i) => (
              <p
                key={i}
                className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed"
              >
                {block.content}
              </p>
            ))}
          </div>
        )}

        {imageBlocks.length > 0 && (
          <div className="border-t border-gray-600 pt-3 flex flex-col gap-2">
            {imageBlocks.map((block, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-700 px-3 py-2"
              >
                <img
                  src={block.content}
                  alt={block.name}
                  className="w-8 h-8 object-cover flex-shrink-0"
                />
                <ImageIcon size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 truncate flex-grow">
                  {block.name}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxImage(block)}
                  className="text-gray-500 hover:text-purple-400 transition-colors flex-shrink-0"
                  title="Preview"
                >
                  <Expand size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => downloadDataUrl(block.content, block.name)}
                  className="text-gray-500 hover:text-purple-400 transition-colors flex-shrink-0"
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
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};

export default SecretViewer;
