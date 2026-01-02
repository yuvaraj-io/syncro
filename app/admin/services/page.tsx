"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    await fetch(`/api/admin/services/${id}`, {
      method: "DELETE",
    });

    fetchServices(); // refresh list
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
         <Link href="/admin" className=" border p-3 hover:underline">
          Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Services</h1>

        <Link
          href="/admin/services/new"
          className="bg-black text-white px-4 py-2 border border-black hover:bg-white hover:text-black"
        >
          + Add Service
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-black">
          <thead>
            <tr className="border-b border-black">
              <th className="p-2 text-left">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-black">
                <td className="p-2">{service.name}</td>
                <td className="p-2">₹{service.price}</td>
                <td className="p-2">{service.duration} mins</td>
                <td className="p-2 space-x-3">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
