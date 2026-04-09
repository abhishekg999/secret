export type TextBlock = {
  type: "text";
  content: string;
};

export type ImageBlock = {
  type: "image";
  content: string; // base64 data URI
  name: string;
};

export type ContentBlock = TextBlock | ImageBlock;

export type SecretPayload = {
  v: 1;
  blocks: ContentBlock[];
};

export type Attachment = {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
};
