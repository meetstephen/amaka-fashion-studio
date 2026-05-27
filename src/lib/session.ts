// Server-side session token creation and verification using HMAC signatures.
// Compatible with both Edge middleware and Node.js API routes via Web Crypto API.

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createSessionToken(secret: string): Promise<string> {
  const id = crypto.randomUUID();
  const exp = (Date.now() + SESSION_DURATION_MS).toString(36);
  const payload = `${id}.${exp}`;
  const signature = await computeSignature(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [id, exp, signature] = parts;
  if (!id || !exp || !signature) return false;

  // Check expiry
  const expiresAt = parseInt(exp, 36);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  // Verify signature
  const payload = `${id}.${exp}`;
  const expectedSignature = await computeSignature(payload, secret);
  return signature === expectedSignature;
}

async function computeSignature(
  payload: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
