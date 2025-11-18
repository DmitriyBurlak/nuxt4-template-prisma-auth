import { getRandomValues } from "crypto";

export function generateShortId(length = 10): string {
  const bytes = getRandomValues(new Uint8Array(length));
  return Buffer.from(bytes).toString('base64url').slice(0, length);
}

// Функция для экранирования HTML
export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}