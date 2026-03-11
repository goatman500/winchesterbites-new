"use client";

import { useEffect, useState } from "react";

type Restaurant = {
  id: string;
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

export default function AdminRestaurantsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Session keep-alive: refresh session cookie every 2 minutes while user is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function refreshSession() {
      try {
        await fetch("/api/auth/refresh-session", { method: "POST", credentials: "include" });
      } catch {}
    }
    interval = setInterval(refreshSession, 2 * 60 * 1000); // every 2 minutes
    return () => clearInterval(interval);
  }, []);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRestaurants() {
    try {
      const res = await fetch("/api/restaurants", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load restaurants.");
      }

      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to load restaurants:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateRestaurant(
    id: string,
    updates: Partial<Pick<Restaurant, "approved" | "featured" | "category" | "menuLink" | "images">>
  ) {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update restaurant: ${text}`);
      }

      await loadRestaurants();
    } catch (error) {
      console.error("Failed to update restaurant:", error);
    }
  }
  async function removeRestaurant(id: string) {
  const confirmDelete = confirm("Are you sure you want to remove this restaurant?");

  if (!confirmDelete) return;

  try {
    const res = await fetch("/api/restaurants", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error("Failed to remove restaurant.");
    }

    await loadRestaurants();
  } catch {
    alert("Error removing restaurant.");
  }
}

  async function addMenuLink(id: string) {
    const newMenu = prompt("Enter the menu URL for this restaurant:", "https://");
    if (!newMenu) return;

    try {
      await updateRestaurant(id, { menuLink: newMenu });
      alert("Menu link updated.");
    } catch (error) {
      console.error("Failed to update menu link:", error);
      alert("Failed to update menu link.");
    }
  }

  async function uploadPicture(id: string) {
    const imageUrl = prompt("Enter image URL to add to this restaurant:", "https://");
    if (!imageUrl) return;

    const target = restaurants.find((item) => item.id === id);
    const existingImages = target?.images || [];

    try {
      await updateRestaurant(id, { images: [...existingImages, imageUrl] });
      alert("Image added to restaurant.");
    } catch (error) {
      console.error("Failed to upload picture:", error);
      alert("Failed to upload picture.");
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  // Add restaurant form state
  const [addForm, setAddForm] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    menuLink: "",
    description: "",
    category: "General",
  });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  async function handleAddRestaurant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    if (!addForm.name || !addForm.address || !addForm.phone || !addForm.description) {
      setAddError("Name, address, phone, and description are required.");
      return;
    }
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Failed to add restaurant.");
        return;
      }
      setAddSuccess("Restaurant added!");
      setAddForm({
        name: "",
        address: "",
        phone: "",
        website: "",
        menuLink: "",
        description: "",
        category: "General",
      });
      await loadRestaurants();
    } catch {
      setAddError("Failed to add restaurant.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black">Admin Restaurant Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Approve listings, feature restaurants, and manage categories.
        </p>


        {/* Add Restaurant Button and Modal Form */}
        <button
          className="mt-8 rounded-full bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700"
          onClick={() => setShowAddForm(true)}
        >
          Add Restaurant
        </button>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200 max-w-2xl w-full relative">
              <button
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 text-2xl font-bold"
                onClick={() => setShowAddForm(false)}
                aria-label="Close"
              >
                ×
              </button>
              <form onSubmit={handleAddRestaurant}>
                <h2 className="text-xl font-bold mb-4">Add a Restaurant</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="rounded border p-2" placeholder="Name*" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                  <input className="rounded border p-2" placeholder="Address*" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} />
                  <input className="rounded border p-2" placeholder="Phone*" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
                  <input className="rounded border p-2" placeholder="Website" value={addForm.website} onChange={e => setAddForm(f => ({ ...f, website: e.target.value }))} />
                  <input className="rounded border p-2" placeholder="Menu Link" value={addForm.menuLink} onChange={e => setAddForm(f => ({ ...f, menuLink: e.target.value }))} />
                  <input className="rounded border p-2" placeholder="Category" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} />
                </div>
                <textarea className="rounded border p-2 mt-4 w-full" placeholder="Description*" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
                {addError && <p className="text-red-600 mt-2">{addError}</p>}
                {addSuccess && <p className="text-green-600 mt-2">{addSuccess}</p>}
                <button type="submit" className="mt-4 rounded-full bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700">Add Restaurant</button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p className="mt-8">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow ring-1 ring-slate-200">
            No restaurant submissions yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                        <p className="text-sm text-slate-500">
                          Spotlight: {restaurant.featured ? `#${restaurants.filter((r) => r.featured).findIndex((r) => r.id === restaurant.id) + 1}` : "Not in spotlight"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => uploadPicture(restaurant.id)}
                          className="admin-action-btn bg-sky-300 hover:bg-sky-400"
                        >
                          Upload Picture
                        </button>
                        <button
                          onClick={() => addMenuLink(restaurant.id)}
                          className="admin-action-btn bg-sky-200 hover:bg-sky-300"
                        >
                          Add Menu
                        </button>
                        <button
                          onClick={() => removeRestaurant(restaurant.id)}
                          className="admin-action-btn bg-red-200 hover:bg-red-300 text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">{restaurant.address}</p>
                    <p className="mt-1 text-sm text-slate-600">{restaurant.phone}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{restaurant.description}</p>
                    <p className="mt-3 text-sm font-medium text-sky-700">Category: {restaurant.category}</p>
                    <p className="text-sm text-slate-500">Menu: {restaurant.menuLink || "No menu link set"}</p>
                    <p className="text-sm text-slate-500">Added images: {restaurant.images?.length ?? 0}</p>
                  </div>

                  <div className="flex min-w-[260px] flex-col gap-3">
                    <button
                      onClick={() =>
                        updateRestaurant(restaurant.id, {
                          approved: !restaurant.approved,
                        })
                      }
                      className={`admin-action-btn ${
                        restaurant.approved
                          ? "bg-amber-200 hover:bg-amber-300 text-amber-900"
                          : "bg-emerald-200 hover:bg-emerald-300 text-emerald-900"
                      }`}
                    >
                      {restaurant.approved ? "Unapprove" : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        updateRestaurant(restaurant.id, {
                          featured: !restaurant.featured,
                        })
                      }
                      className={`admin-action-btn ${
                        restaurant.featured
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-900"
                          : "bg-sky-200 hover:bg-sky-300 text-sky-900"
                      }`}
                    >
                      {restaurant.featured ? "Remove Featured" : "Make Featured"}
                    </button>

                    <select
                      value={restaurant.category}
                      onChange={(e) =>
                        updateRestaurant(restaurant.id, {
                          category: e.target.value,
                        })
                      }
                      className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    >
                      <option>General</option>
                      <option>American</option>
                      <option>Italian</option>
                      <option>Mexican</option>
                      <option>Chinese</option>
                      <option>Japanese</option>
                      <option>Pizza</option>
                      <option>BBQ</option>
                      <option>Seafood</option>
                      <option>Breakfast</option>
                      <option>Cafe</option>
                      <option>Bakery</option>
                    </select>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200">
                      <p>
                        Approved:{" "}
                        <span className="font-bold">
                          {restaurant.approved ? "Yes" : "No"}
                        </span>
                      </p>
                      <p>
                        Featured:{" "}
                        <span className="font-bold">
                          {restaurant.featured ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}