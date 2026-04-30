export interface TextBlock {
  type: "text";
  content: string;
}

export interface AttachmentBlock {
  type: "attachment";
  content: string; // base64 data URI
  name: string;
  mimeType: string;
}

export type ContentBlock = TextBlock | AttachmentBlock;

export interface SecretPayload {
  v: 2;
  blocks: ContentBlock[];
}

export interface Attachment {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  mimeType: string;
}
