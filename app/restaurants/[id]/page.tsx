import Link from "next/link";
import { getRestaurantById } from "@/lib/restaurants";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant || !restaurant.approved) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow ring-1 ring-slate-200">
          <h1 className="text-3xl font-black">Restaurant not found</h1>
          <p className="mt-3 text-slate-600">
            This listing may not exist yet or has not been approved.
          </p>
          <Link
            href="/restaurants"
            className="mt-6 inline-flex rounded-full bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
          >
            Back to Restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/restaurants"
          className="mb-8 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
        >
          ← Back to Restaurants
        </Link>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
          {restaurant.featured && (
            <div className="mb-4 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
              Featured Restaurant
            </div>
          )}

          <h1 className="text-4xl font-black text-slate-900">{restaurant.name}</h1>

          <p className="mt-4 text-lg text-slate-600">{restaurant.address}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <h2 className="font-bold text-slate-900">Phone</h2>
              <p className="mt-2 text-slate-600">{restaurant.phone}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <h2 className="font-bold text-slate-900">Category</h2>
              <p className="mt-2 text-slate-600">{restaurant.category}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">About</h2>
            <p className="mt-3 leading-7 text-slate-700">{restaurant.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
              >
                Visit Website
              </a>
            )}

            {restaurant.menuLink && (
              <a
                href={restaurant.menuLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                View Menu
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}