import fs from "fs";
import path from "path";

export type PasswordReset = {
  token: string;
  email: string;
  expiresAt: number;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "password-resets.json");

function ensureResetFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }
}

export function getPasswordResets(): PasswordReset[] {
  try {
    ensureResetFile();
    const fileData = fs.readFileSync(filePath, "utf8");

    if (!fileData.trim()) {
      return [];
    }

    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading password resets:", error);
    return [];
  }
}

export function savePasswordResets(resets: PasswordReset[]) {
  try {
    ensureResetFile();
    fs.writeFileSync(filePath, JSON.stringify(resets, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving password resets:", error);
  }
}

export function removeExpiredPasswordResets() {
  const resets = getPasswordResets();
  const now = Date.now();
  const validResets = resets.filter((reset) => reset.expiresAt > now);
  savePasswordResets(validResets);
}

export function getPasswordResetByToken(token: string) {
  removeExpiredPasswordResets();
  const resets = getPasswordResets();
  return resets.find((reset) => reset.token === token);
}