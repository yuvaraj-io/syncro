import Link from "next/link";

export default function BookingsPage() {
  return (
    <div className="p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="border border-black px-3 py-2 hover:bg-black hover:text-white transition"
        >
          ← Home
        </Link>
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      <div className="border border-gray-200 p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Booking History
        </h2>

        <p className="text-gray-600">
          Booking history lookup is currently unavailable.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Please contact our team for booking details or support.
        </p>

        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
