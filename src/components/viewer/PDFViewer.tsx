import type { AttachmentBlock } from "@/lib/types";

const PDFViewer = ({ block }: { block: AttachmentBlock }) => (
  <iframe src={block.content} title={block.name} className="h-full w-[90vw] max-w-5xl bg-white" />
);

export default PDFViewer;
