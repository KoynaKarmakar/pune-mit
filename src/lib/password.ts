import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

/**
 * Hashes a password using scrypt.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Verifies a password against a stored hash.
 * @param storedHash The hash string from the database (e.g., "hash.salt").
 * @param suppliedPassword The plaintext password from the user login attempt.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export async function verifyPassword(
  storedHash: string,
  suppliedPassword: string
): Promise<boolean> {
  const [hashedPassword, salt] = storedHash.split(".");
  if (!hashedPassword || !salt) {
    throw new Error("Invalid stored hash format.");
  }
  const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");

  if (buf.length !== hashedPasswordBuf.length) {
    return false;
  }
  return timingSafeEqual(buf, hashedPasswordBuf);
}
