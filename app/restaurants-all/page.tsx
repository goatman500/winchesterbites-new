import Link from "next/link";
import { getRestaurants } from "@/lib/restaurants";

export default function RestaurantsAllPage() {
  const restaurants = getRestaurants().filter((restaurant) => restaurant.approved);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">All Restaurants</h1>
            <p className="text-slate-600">Simple list of all approved restaurants in a clean grid.</p>
          </div>
          <Link
            href="/restaurants"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Browse Page
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                {restaurant.featured ? "Featured" : ""}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{restaurant.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{restaurant.category}</p>
              <p className="mt-2 text-sm text-slate-700 line-clamp-3">{restaurant.description}</p>
              <p className="mt-3 text-xs font-semibold text-sky-700">{restaurant.address}</p>
            </Link>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow ring-1 ring-slate-200">
            No restaurants available yet.
          </div>
        )}
      </div>
    </main>
  );
}
