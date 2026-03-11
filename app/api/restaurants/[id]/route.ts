import { getRestaurants, saveRestaurants } from "@/lib/restaurants";
import { jsonResponse, errorResponse } from "@/lib/api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const restaurants = getRestaurants();
    const index = restaurants.findIndex((restaurant) => restaurant.id === id);

    if (index === -1) {
      return errorResponse("Restaurant not found.", 404);
    }

    restaurants[index] = {
      ...restaurants[index],
      approved:
        typeof body.approved === "boolean"
          ? body.approved
          : restaurants[index].approved,
      featured:
        typeof body.featured === "boolean"
          ? body.featured
          : restaurants[index].featured,
      category:
        typeof body.category === "string" && body.category.trim()
          ? body.category
          : restaurants[index].category,
      menuLink:
        typeof body.menuLink === "string"
          ? body.menuLink
          : restaurants[index].menuLink,
      images: Array.isArray(body.images)
        ? body.images
        : restaurants[index].images || [],
    };

    saveRestaurants(restaurants);

    return jsonResponse(restaurants[index]);
  } catch (error) {
    console.error("PATCH /api/restaurants/[id] failed:", error);
    return errorResponse("Failed to update restaurant.");
  }
}