import type { AttachmentBlock } from "@/lib/types";

const ImageViewer = ({ block }: { block: AttachmentBlock }) => (
  <img src={block.content} alt={block.name} className="max-h-full max-w-[90vw] object-contain" />
);

export default ImageViewer;
