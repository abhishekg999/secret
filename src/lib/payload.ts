import type { SecretPayload, ContentBlock, Attachment } from "./types";

export function encodePayload(
  text: string,
  attachments: Pick<Attachment, "name" | "dataUrl">[]
): string {
  const blocks: ContentBlock[] = [];

  const trimmed = text.trim();
  if (trimmed) {
    blocks.push({ type: "text", content: trimmed });
  }

  for (const att of attachments) {
    blocks.push({ type: "image", content: att.dataUrl, name: att.name });
  }

  const payload: SecretPayload = { v: 1, blocks };
  return JSON.stringify(payload);
}

export function contentSize(
  text: string,
  attachments: Pick<Attachment, "size">[]
): number {
  return (
    new TextEncoder().encode(text).length +
    attachments.reduce((sum, a) => sum + a.size, 0)
  );
}

export function decodePayload(raw: string): ContentBlock[] {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.v === 1 && Array.isArray(parsed.blocks)) {
      return parsed.blocks as ContentBlock[];
    }
  } catch {
    // Not JSON — legacy plain text
  }

  return [{ type: "text", content: raw }];
}
