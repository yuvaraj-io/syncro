"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  date: string;
  hour: number;
  message: string | null;
  phone: string | null;
  serviceName: string | null;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("/api/admin/bookings/upcoming");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    fetchBookings();
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="border px-3 py-2 hover:bg-black hover:text-white"
        >
          ← Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Upcoming Bookings</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No upcoming bookings.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Meeting</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">User</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b">
                  <td className="p-3">{formatDate(b.date)}</td>
                  <td className="p-3">
                    {b.hour}:00 – {b.hour + 1}:00
                  </td>
                  <td className="p-3">
                    {b.message ? (
                      <a
                        href={b.message}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Join
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {b.serviceName || "-"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {b.phone || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
