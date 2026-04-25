export const MAX_IMAGE_BYTES = 200 * 1024; // 200 KB soft cap

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
