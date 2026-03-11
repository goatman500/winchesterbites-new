import Link from "next/link";
import Image from "next/image";
import { getRestaurants } from "@/lib/restaurants";


export default function Home() {
  const restaurants = getRestaurants();
  const featuredRestaurants = restaurants
    .filter((restaurant) => restaurant.approved && restaurant.featured)
    .slice(0, 3);


  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <Image src="/WB%20LOGO.PNG" alt="WinchesterBites Logo" width={220} height={220} className="rounded-full shadow-lg border-4 border-white mb-4 animate-fade-in" />
          <div className="mb-4 inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-200">
            Winchester & Frederick County
          </div>
          <h1 className="hero-glow text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 drop-shadow-lg animate-fade-in leading-tight max-w-2xl mx-auto">
            Discover and Support <span className="block sm:inline">Local Restaurants</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 animate-fade-in text-center">
            WinchesterBites is a local platform where restaurants can promote their specials, menus, and events while customers discover great places to eat nearby.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in">
            <Link
              href="/restaurants-join"
              className="hero-link-glow rounded-full bg-sky-600 px-8 py-4 font-semibold text-black-important shadow-lg shadow-sky-200 transition hover:-translate-y-1 hover:bg-sky-700"
            >
              Join as a Restaurant Partner
            </Link>
            <Link
              href="/restaurants"
              className="hero-link-glow rounded-full bg-white px-8 py-4 font-semibold text-black-important ring-1 ring-slate-300 transition hover:-translate-y-1 hover:bg-slate-50"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="mt-24 animate-fade-in-up px-6">
        <div className="flex items-end justify-between gap-4 max-w-6xl mx-auto">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
              Featured Restaurants
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Spotlight on local food businesses
            </h2>
          </div>
          <Link
            href="/restaurants-all"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black-important ring-1 ring-slate-300 hover:bg-slate-50"
          >
            View All
          </Link>
        </div>
        {featuredRestaurants.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200 max-w-6xl mx-auto">
            <p className="text-slate-600">
              No featured restaurants yet. Approve and feature listings from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
            {featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1"
              >
                <div className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Featured
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {restaurant.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {restaurant.address}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {restaurant.description}
                </p>
                <p className="mt-4 text-sm font-medium text-sky-700">
                  {restaurant.category}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}