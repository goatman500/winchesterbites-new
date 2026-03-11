"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Filter by Category");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        const data = await res.json();
        setRestaurants(data.filter((restaurant: Restaurant) => restaurant.approved));
      } catch (error) {
        console.error("Failed to load restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const categories = useMemo(() => {
    const commonCategories = [
      "American",
      "Italian",
      "Mexican",
      "Chinese",
      "Japanese",
      "Pizza",
      "BBQ",
      "Seafood",
      "Breakfast",
      "Cafe",
      "Bakery",
      "Vegan",
      "Indian",
      "Mediterranean",
      "Thai",
      "Fast Food",
      "Dessert",
      "Asian",
      "Healthy",
    ];

    const presentCategories = Array.from(
      new Set(restaurants.map((restaurant) => restaurant.category || "General"))
    );

    const finalCategories = ["Filter by Category", ...commonCategories, ...presentCategories];
    return Array.from(new Set(finalCategories));
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "Filter by Category" || restaurant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [restaurants, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black">Find your next meal</h1>
            <p className="text-slate-600">
              Browse top local restaurants in Winchester and Frederick County by cuisine, category, and mood.
            </p>
          </div>

          <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Spotlight Restaurant
          </div>
        </div>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Spotlight</h2>
              <p className="text-slate-600">
                Featured restaurant picked by our team to make your next dining choice easy and delicious.
              </p>
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-4 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Restaurants
            </label>
            <input
              type="text"
              placeholder="Search by name, description, or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div className="relative">
            {/* Removed stray label tag above filter dropdown */}
            <button
              type="button"
              onClick={() => setCategoryOpen((prev) => !prev)}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-left text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:bg-sky-50 transition-colors flex items-center justify-between gap-2"
            >
              <span>{selectedCategory}</span>
              <svg className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {categoryOpen && (
              <ul className="absolute left-0 right-0 z-10 max-h-60 overflow-auto rounded-xl border border-slate-300 bg-white shadow-lg">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="cursor-pointer px-4 py-2 hover:bg-sky-100"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCategoryOpen(false);
                    }}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>



        {loading ? (
          <p>Loading restaurants...</p>
        ) : filteredRestaurants.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">No matching restaurants found</h2>
            <p className="mt-2 text-slate-600">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <>
            {restaurants.some((r) => r.featured) && (
              <section className="mb-10 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-black">Featured Restaurants</h3>
                  <p className="text-sm text-slate-500">Handpicked by the WinchesterBites team</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {restaurants
                    .filter((restaurant) => restaurant.featured && restaurant.approved)
                    .slice(0, 6)
                    .map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/restaurants/${restaurant.id}`}
                        className="rounded-2xl border border-sky-100 bg-sky-50 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700">
                          <span className="rounded-full bg-amber-100 px-2 py-1">Featured</span>
                        </div>
                        <h4 className="mt-2 text-lg font-bold text-slate-900">{restaurant.name}</h4>
                        <p className="mt-1 text-sm text-slate-600">{restaurant.category}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-2">{restaurant.description}</p>
                      </Link>
                    ))}
                </div>
              </section>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1"
                >
                {restaurant.featured && (
                  <div className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Featured
                  </div>
                )}

                <h2 className="text-xl font-bold">{restaurant.name}</h2>

                <p className="mt-2 text-sm text-slate-600">{restaurant.address}</p>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {restaurant.description}
                </p>

                <p className="mt-4 text-sm font-medium text-sky-700">
                  {restaurant.category}
                </p>
              </Link>
            ))}
          </div>
          </>
        )}
      </div>
    </main>
  );
}