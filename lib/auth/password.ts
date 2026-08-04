import { compare, hash } from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(password: string) {
  return hash(password, ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    return "密码至少 8 位";
  }
  return null;
}
