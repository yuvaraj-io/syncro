"use client";

import Link from "next/link";

export default function AdminBookingsPage() {
  return (
    <div className="p-10 max-w-4xl mx-auto text-center">
      <Link
        href="/admin"
        className="inline-block mb-8 border border-black px-4 py-2 hover:bg-black hover:text-white transition"
      >
        ← Admin Dashboard
      </Link>

      <h1 className="text-4xl font-bold mb-4">Bookings</h1>

      <p className="text-gray-600 text-lg mb-10">
        Booking management is under development.
      </p>

      <div className="border border-dashed border-black p-10">
        <p className="text-2xl font-semibold">🚧 Coming Soon</p>
        <p className="mt-2 text-sm text-gray-500">
          You’ll be able to view and manage bookings here shortly.
        </p>
      </div>
    </div>
  );
}
