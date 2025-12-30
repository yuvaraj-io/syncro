"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  serviceId: string;
  service?: {
    name: string;
  };
  date: string;
  slot: number;
  phone: string;
  status: string;
  userId: string;
  createdAt: string;
};

type Service = {
  id: string;
  name: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  async function fetchServices() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchBookings(); // refresh list
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });

    fetchBookings(); // refresh list
  }

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  function getServiceName(serviceId: string, serviceName?: string) {
    if (serviceName) return serviceName;
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function formatSlot(slot: number) {
    return `${slot}:00 – ${slot + 1}:00`;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="border border-black p-2 hover:bg-black hover:text-white transition"
          >
            ← Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Bookings</h1>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-black">
            <thead>
              <tr className="border-b border-black bg-gray-50">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-black">
                  <td className="p-3">{formatDate(booking.date)}</td>
                  <td className="p-3">{formatSlot(booking.slot)}</td>
                  <td className="p-3">{getServiceName(booking.serviceId, booking.service?.name)}</td>
                  <td className="p-3">{booking.phone}</td>
                  <td className="p-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="border p-1 text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-800 text-sm underline"
                    >
                      Delete
                    </button>
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
