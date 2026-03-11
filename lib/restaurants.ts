import fs from "fs";
import path from "path";

export type Restaurant = {
  id: string;
  ownerId?: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  menuLink: string;
  description: string;
  category: string;
  approved: boolean;
  featured: boolean;
  images?: string[];
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "restaurants.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }
}

export function getRestaurants(): Restaurant[] {
  try {
    ensureDataFile();
    const fileData = fs.readFileSync(filePath, "utf8");

    if (!fileData.trim()) {
      return [];
    }

    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading restaurants:", error);
    return [];
  }
}

export function saveRestaurants(restaurants: Restaurant[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(restaurants, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving restaurants:", error);
  }
}

export function getRestaurantById(id: string) {
  const restaurants = getRestaurants();
  return restaurants.find((restaurant) => restaurant.id === id);
}

export function getRestaurantByOwnerId(ownerId: string) {
  const restaurants = getRestaurants();
  return restaurants.find((restaurant) => restaurant.ownerId === ownerId);
}