"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  date: string;
  hour: number;
  message: string | null;
  service_id: string | null;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings/my");

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load bookings");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/services"
          className="border px-3 py-2 hover:bg-black hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div
              key={b.id}
              className="border p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {formatDate(b.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {b.hour}:00 – {b.hour + 1}:00
                  </p>
                </div>

                <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                  BOOKED
                </span>
              </div>

              {b.message && (
                <p className="mt-3 text-sm">
                  <strong>Meeting:</strong>{" "}
                  <a
                    href={b.message}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Join link
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
