/**
 * Input sanitization utilities for security
 */

/**
 * Sanitize a string input: trim, strip HTML tags, truncate to maxLength
 */
export function sanitizeInput(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";
  let cleaned = input.trim();
  // Strip HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  // Remove null bytes
  cleaned = cleaned.replace(/\0/g, "");
  // Truncate to maxLength
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }
  return cleaned;
}

/**
 * Sanitize all string fields in an object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T,
  maxLength: number = 1000
): T {
  const sanitized = { ...data };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(
        sanitized[key],
        maxLength
      );
    }
  }
  return sanitized;
}

/**
 * Escape HTML entities to prevent XSS when rendering user content
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
