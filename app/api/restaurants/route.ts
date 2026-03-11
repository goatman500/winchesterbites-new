import nodemailer from "nodemailer";
import { getRestaurants, saveRestaurants } from "@/lib/restaurants";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse, unauthorized, forbidden } from "@/lib/api";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    const restaurants = getRestaurants();

    if (currentUser?.role === "admin") {
      return jsonResponse(restaurants);
    }

    const publicRestaurants = restaurants.filter((restaurant) => restaurant.approved);
    return jsonResponse(publicRestaurants);
  } catch (error) {
    console.error("GET /api/restaurants failed:", error);
    return errorResponse("Failed to load restaurants.");
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    let body: any = {};
    let isForm = false;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      isForm = true;
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          body[key] = value;
        }
        // File uploads can be handled here if needed
      }
    } else {
      body = await req.json();
    }

    const restaurants = getRestaurants();

    if (currentUser && currentUser.role !== "admin") {
      const existingOwnedRestaurant = restaurants.find(
        (restaurant) => restaurant.ownerId === currentUser.id
      );
      if (existingOwnedRestaurant) {
        return errorResponse("This account already has a restaurant listing.", 409);
      }
    }

    const newRestaurant = {
      id: crypto.randomUUID(),
      ownerId: currentUser ? currentUser.id : undefined,
      name: body.name || "",
      address: body.address || "",
      phone: body.phone || "",
      website: body.website || "",
      menuLink: body.menuLink || "",
      description: body.description || "",
      category: body.category || "General",
      approved: false,
      featured: false,
    };

    if (
      !newRestaurant.name ||
      !newRestaurant.address ||
      !newRestaurant.phone ||
      !newRestaurant.description
    ) {
      return errorResponse("Missing required fields.", 400);
    }

    restaurants.push(newRestaurant);
    saveRestaurants(restaurants);

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.example.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER || "your-smtp-user",
          pass: process.env.SMTP_PASSWORD || "your-smtp-password",
        },
      });

      const message = {
        from: process.env.SMTP_FROM || "no-reply@winchesterbites.com",
        to: "conner.brach@outlook.com",
        subject: "New restaurant partner request",
        text: `New partner request:

Name: ${newRestaurant.name}
Address: ${newRestaurant.address}
Phone: ${newRestaurant.phone}
Website: ${newRestaurant.website}
Menu: ${newRestaurant.menuLink}
Description: ${newRestaurant.description}
Category: ${newRestaurant.category}
`,
      };

      await transporter.sendMail(message);
    } catch (emailError) {
      console.error("Failed to send partner request email:", emailError);
    }

    return jsonResponse(newRestaurant, 201);
  } catch (error) {
    console.error("POST /api/restaurants failed:", error);
    return errorResponse("Failed to save restaurant.");
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return unauthorized("You must be logged in to delete a restaurant.");
    }

    if (currentUser.role !== "admin") {
      return forbidden("Only admins can delete restaurants.");
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return errorResponse("Restaurant ID is required.", 400);
    }

    const restaurants = getRestaurants();
    const filtered = restaurants.filter((r) => r.id !== id);

    saveRestaurants(filtered);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("DELETE restaurant failed:", error);

    return errorResponse("Failed to delete restaurant.");
  }
}