"use client";

import { useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  serviceId: string;
  service?: {
    name: string;
    description: string;
    price: number;
    duration: number;
  };
  date: string;
  slot: number;
  phone: string;
  status: string;
  createdAt: string;
};

export default function BookingsPage() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function fetchBookings() {
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setBookings(data);
      setSearched(true);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function formatSlot(slot: number) {
    return `${slot}:00 – ${slot + 1}:00`;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "CANCELLED":
        return "text-red-600";
      case "COMPLETED":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="border border-black p-2 hover:bg-black hover:text-white transition"
        >
          ← Home
        </Link>
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 border border-black p-3"
          />
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Find Bookings"}
          </button>
        </div>
      </div>

      {searched && (
        <div>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No bookings found for {phone}</p>
              <p className="text-sm text-gray-500">
                Make sure you're using the same phone number you used when booking
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Found {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </h2>
              
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-black p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {booking.service?.name || "Service"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {booking.service?.description}
                      </p>
                    </div>
                    <span className={`font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Date:</span>
                      <br />
                      {formatDate(booking.date)}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <br />
                      {formatSlot(booking.slot)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <br />
                      {booking.service?.duration || 0} mins
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        ₹{booking.service?.price || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        Booking ID: {booking.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Enter your phone number to view your bookings
          </p>
        </div>
      )}
    </div>
  );
}
