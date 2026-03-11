import {
  getRestaurantByOwnerId,
  getRestaurants,
  saveRestaurants,
} from "@/lib/restaurants";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse, unauthorized } from "@/lib/api";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorized("You must be logged in.");
    }

    const restaurant = getRestaurantByOwnerId(user.id);

    if (!restaurant) {
      return errorResponse("No restaurant found for this account.", 404);
    }

    return jsonResponse(restaurant);
  } catch (error) {
    console.error("GET /api/dashboard/restaurant failed:", error);
    return errorResponse("Failed to load restaurant dashboard.");
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorized("You must be logged in.");
    }

    const body = await req.json();

    const restaurants = getRestaurants();
    const index = restaurants.findIndex(
      (restaurant) => restaurant.ownerId === user.id
    );

    if (index === -1) {
      return errorResponse("No restaurant found for this account.", 404);
    }

    restaurants[index] = {
      ...restaurants[index],
      name: body.name ?? restaurants[index].name,
      address: body.address ?? restaurants[index].address,
      phone: body.phone ?? restaurants[index].phone,
      website: body.website ?? restaurants[index].website,
      menuLink: body.menuLink ?? restaurants[index].menuLink,
      description: body.description ?? restaurants[index].description,
      category: body.category ?? restaurants[index].category,
      approved: false,
    };

    saveRestaurants(restaurants);

    return jsonResponse(restaurants[index]);
  } catch (error) {
    console.error("PATCH /api/dashboard/restaurant failed:", error);
    return errorResponse("Failed to update restaurant.");
  }
}