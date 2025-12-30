import Link from "next/link";

export default function Admin() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Services */}
        <Link
          href="/admin/services"
          className="border border-black p-6 hover:bg-black hover:text-white transition"
        >
          <h3 className="text-xl font-semibold">Services</h3>
          <p className="mt-2 text-sm">
            Create, edit, and manage all services.
          </p>
        </Link>

        {/* Bookings */}
        <Link
          href="/admin/bookings"
          className="border border-black p-6 hover:bg-black hover:text-white transition"
        >
          <h3 className="text-xl font-semibold">Bookings</h3>
          <p className="mt-2 text-sm">
            View and manage customer bookings.
          </p>
        </Link>

        {/* Calendar */}
        <Link
          href="/admin/calendar"
          className="border border-black p-6 hover:bg-black hover:text-white transition"
        >
          <h3 className="text-xl font-semibold">Calendar</h3>
          <p className="mt-2 text-sm">
            Manage availability and time slots.
          </p>
        </Link>

        {/* Users (optional future) */}
        <div className="border border-dashed border-black p-6 opacity-60">
          <h3 className="text-xl font-semibold">Users</h3>
          <p className="mt-2 text-sm">
            User management (coming soon).
          </p>
        </div>
      </div>
    </div>
  );
}
