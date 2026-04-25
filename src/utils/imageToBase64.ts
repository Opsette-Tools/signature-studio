export const MAX_IMAGE_BYTES = 200 * 1024; // legacy soft cap (kept for back-compat)

export type ResizePreset = {
  maxW: number;
  maxH: number;
  mime: "image/jpeg" | "image/png";
  quality: number; // only used for jpeg
};

export const PROFILE_PRESET: ResizePreset = {
  maxW: 200,
  maxH: 200,
  mime: "image/jpeg",
  quality: 0.85,
};

export const LOGO_PRESET: ResizePreset = {
  maxW: 320,
  maxH: 120,
  mime: "image/png",
  quality: 0.9,
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function isLikelyTooLarge(file: File): boolean {
  return file.size > MAX_IMAGE_BYTES;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Resize an image file to fit within preset bounds and return a data URL.
 * For logos (PNG preset), also tries a JPEG version and returns whichever is smaller.
 */
export async function resizeImage(file: File, preset: ResizePreset): Promise<string> {
  const original = await fileToBase64(file);
  const img = await loadImage(original);

  const ratio = Math.min(preset.maxW / img.width, preset.maxH / img.height, 1);
  const w = Math.max(1, Math.round(img.width * ratio));
  const h = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, w, h);

  const primary = canvas.toDataURL(preset.mime, preset.quality);

  // For PNG preset, also try JPEG and pick the smaller one (when transparency isn't needed,
  // JPEG can be much smaller). We accept JPEG if it's at least 25% smaller.
  if (preset.mime === "image/png") {
    const jpeg = canvas.toDataURL("image/jpeg", 0.85);
    if (jpeg.length < primary.length * 0.75) return jpeg;
  }
  return primary;
}

export function byteSizeOfDataUrl(dataUrl: string): number {
  // base64 length * 3/4 minus padding; close enough for UI display
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}
