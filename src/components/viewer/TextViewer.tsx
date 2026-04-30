import type { AttachmentBlock } from "@/lib/types";

const TextViewer = ({ block }: { block: AttachmentBlock }) => (
  <pre className="max-h-full max-w-[90vw] overflow-auto bg-surface-inset p-6 text-sm text-content-body">
    {atob(block.content.substring(block.content.indexOf(",") + 1))}
  </pre>
);

export default TextViewer;
