/**
 * TOTP (RFC 6238) + encrypted-at-rest secret helpers.
 *
 * Zero external dependencies: HMAC-SHA1 via node:crypto for the code,
 * AES-256-GCM (key derived from NEXTAUTH_SECRET) for storage. The raw
 * TOTP secret is only ever returned to the user once at generation time.
 */

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "crypto";

const SECRET_LENGTH = 20; // 160-bit secret, standard for TOTP
const TIME_STEP = 30;
const DIGITS = 6;

const key = (): Buffer => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }
  return createHmac("sha256", "scholarflow-2fa-key-v1").update(secret).digest();
};

const base32Decode = (b32: string): Buffer => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  for (const char of b32.toUpperCase().replace(/=+$/, "")) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(output);
};

export const generateTotpSecret = (): string => {
  return randomBytes(SECRET_LENGTH).toString("base64").replace(/=+$/, "").slice(0, 32);
};

const totpCounter = (now = Date.now()): number => {
  return Math.floor(now / 1000 / TIME_STEP);
};

const hotp = (secret: string, counter: number): string => {
  const msg = Buffer.alloc(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const h = createHmac("sha1", base32Decode(secret)).update(msg).digest();
  const offset = h[h.length - 1] & 0x0f;
  const bin =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff);
  return String(bin % 10 ** DIGITS).padStart(DIGITS, "0");
};

export const verifyTotp = (
  token: string,
  secret: string,
  window = 1
): boolean => {
  if (!/^\d{6}$/.test(token)) return false;
  const counter = totpCounter();
  for (let w = -window; w <= window; w++) {
    if (hotp(secret, counter + w) === token) return true;
  }
  return false;
};

export const buildOtpAuthUrl = (email: string, secret: string): string => {
  return `otpauth://totp/ScholarFlow:${encodeURIComponent(email)}?secret=${secret}&issuer=ScholarFlow`;
};

export const encryptTotpSecret = (plain: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decryptTotpSecret = (payload: string): string | null => {
  try {
    const [ivHex, tagHex, dataHex] = payload.split(":");
    if (!ivHex || !tagHex || !dataHex) return null;
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const out = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]);
    return out.toString("utf8");
  } catch {
    return null;
  }
};
