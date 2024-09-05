import { type ClassValue, clsx } from "clsx"
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid);
}

const generateKey = (length: number) => {
  return nanoid(length);
};

const deriveEncryptionKey = async (baseKey: string) => {
  const keyData = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(baseKey)
  );

  return crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-CBC',
    false,
    ['encrypt', 'decrypt']
  );
}

export function uint8ToBase64(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer));
}

export function base64ToUint8(base64: string) {
  return new Uint8Array(atob(base64).split('').map((c) => c.charCodeAt(0)));
}

export async function createEncryptionPair(data: string, keyLength: number): Promise<[string, string]> {
  const key = generateKey(keyLength);
  const encryptionKey = await deriveEncryptionKey(key);
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const enc = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: iv,
    },
    encryptionKey,
    new TextEncoder().encode(data)
  );

  const encData = new Uint8Array(iv.length + enc.byteLength);
  encData.set(iv);
  encData.set(new Uint8Array(enc), iv.length);

  return [key, uint8ToBase64(encData)];
}

export async function decryptData(key: string, data: string) {
  try {
    const encryptionKey = await deriveEncryptionKey(key);
    const encData = base64ToUint8(data);
    const iv = encData.slice(0, 16);
    const enc = encData.slice(16);

    const dec = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      encryptionKey,
      enc
    );

    return new TextDecoder().decode(dec);
  } catch (e) {
    return null;
  }

}




