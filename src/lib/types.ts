export interface TextBlock {
  type: "text";
  content: string;
}

export interface ImageBlock {
  type: "image";
  content: string; // base64 data URI
  name: string;
}

export type ContentBlock = TextBlock | ImageBlock;

export interface SecretPayload {
  v: 1;
  blocks: ContentBlock[];
}

export interface Attachment {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
}
