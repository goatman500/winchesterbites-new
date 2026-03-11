import fs from "fs";
import path from "path";

export type UserRole = "admin" | "restaurant";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  restaurantId?: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "users.json");

function ensureUsersFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }
}

export function getUsers(): User[] {
  try {
    ensureUsersFile();
    const fileData = fs.readFileSync(filePath, "utf8");

    if (!fileData.trim()) {
      return [];
    }

    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

export function saveUsers(users: User[]) {
  try {
    ensureUsersFile();
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

export function getUserByEmail(email: string) {
  const users = getUsers();
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function getUserById(id: string) {
  const users = getUsers();
  return users.find((user) => user.id === id);
}