import { File as FileIcon } from "lucide-react";
import type { AttachmentBlock } from "@/lib/types";

const DefaultViewer = ({ block }: { block: AttachmentBlock }) => (
  <div className="flex flex-col items-center gap-3 text-content-muted">
    <FileIcon size={48} />
    <p className="text-lg">{block.name}</p>
    <p className="text-sm text-content-faint">{block.mimeType}</p>
  </div>
);

export default DefaultViewer;
