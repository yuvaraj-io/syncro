"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
      setLoading(false);
    }

    fetchServices();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="min-h-[60vh] flex items-center bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Our Services
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Scalable digital solutions designed for real businesses.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            What We Offer
          </h2>

          {loading ? (
            <p className="mt-10 text-center text-slate-500">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p className="mt-10 text-center text-slate-500">
              Services coming soon.
            </p>
          ) : (
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(service => (
                <div
                  key={service.id}
                  className="p-6 border rounded-xl hover:shadow-lg transition flex flex-col"
                >
                  <h3 className="font-semibold text-xl">
                    {service.name}
                  </h3>

                  <p className="mt-3 text-slate-600 text-sm flex-1">
                    {service.description}
                  </p>

                  <div className="mt-6 text-sm text-slate-700">
                    <p><strong>Duration:</strong> {service.duration} mins</p>
                    <p className="mt-1"><strong>Price:</strong> ₹{service.price}</p>
                  </div>

                  <Link
                    href={`/book?serviceId=${service.id}`}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
