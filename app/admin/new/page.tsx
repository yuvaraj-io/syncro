"use client";

import { useState } from "react";

export default function AdminServicesPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", description: "", price: "", duration: "" });
    alert("Service added");
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin – Services</h1>

      <form
        onSubmit={handleSubmit}
        className="border border-black p-6 space-y-4"
      >
        <input
          className="w-full border border-black p-2"
          placeholder="Service Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="w-full border border-black p-2"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border border-black p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          className="w-full border border-black p-2"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
        />

        <button className="bg-black text-white px-6 py-2 border border-black hover:bg-white hover:text-black transition">
          Add Service
        </button>
      </form>
    </div>
  );
}
