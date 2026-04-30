import { useEffect } from "react";
import { X, Download } from "lucide-react";
import type { AttachmentBlock } from "@/lib/types";
import ImageViewer from "./ImageViewer";
import PDFViewer from "./PDFViewer";
import TextViewer from "./TextViewer";
import DefaultViewer from "./DefaultViewer";

function PreviewContent({ block }: { block: AttachmentBlock }) {
  if (block.mimeType.startsWith("image/")) return <ImageViewer block={block} />;
  if (block.mimeType === "application/pdf") return <PDFViewer block={block} />;
  if (block.mimeType.startsWith("text/")) return <TextViewer block={block} />;
  return <DefaultViewer block={block} />;
}

interface PreviewProps {
  block: AttachmentBlock;
  onClose: () => void;
}

const Preview = ({ block, onClose }: PreviewProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-black/80" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 text-content-muted transition-colors hover:text-content"
      >
        <X size={24} />
      </button>

      <div
        className="flex flex-1 items-center justify-center overflow-hidden p-6 pb-0"
        onClick={(e) => { e.stopPropagation(); }}
      >
        <PreviewContent block={block} />
      </div>

      <div
        className="flex items-center justify-between px-6 py-4"
        onClick={(e) => { e.stopPropagation(); }}
      >
        <span className="truncate text-sm text-content-muted">{block.name}</span>
        <a
          href={block.content}
          download={block.name}
          className="flex-shrink-0 text-content-muted transition-colors hover:text-content"
          title="Download"
        >
          <Download size={18} />
        </a>
      </div>
    </div>
  );
};

export default Preview;
