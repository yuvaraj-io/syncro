import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <Link href="/">
        <button className="px-4 py-2 border border-black hover:bg-black hover:text-white transition">
          ← Home
        </button>
      </Link>

      <h1 className="text-4xl font-bold text-black mb-8 pt-6">
        Our Services
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Service 1 */}
        <div className="border border-black p-6 hover:bg-black hover:text-white transition">
          <h2 className="text-xl font-semibold">
            Web Development
          </h2>

          <p className="mt-3 text-sm leading-relaxed">
            High-performance websites, admin dashboards, and scalable web applications
            tailored for growing businesses.
          </p>

          <p className="mt-3 font-medium">
            ₹25,000 · 30 days
          </p>
        </div>

        {/* Service 2 */}
        <div className="border border-black p-6 hover:bg-black hover:text-white transition">
          <h2 className="text-xl font-semibold">
            Mobile App Development
          </h2>

          <p className="mt-3 text-sm leading-relaxed">
            Android & iOS apps with secure backend systems and smooth performance.
          </p>

          <p className="mt-3 font-medium">
            ₹40,000 · 45 days
          </p>
        </div>

        {/* Service 3 */}
        <div className="border border-black p-6 hover:bg-black hover:text-white transition">
          <h2 className="text-xl font-semibold">
            Digital Marketing
          </h2>

          <p className="mt-3 text-sm leading-relaxed">
            SEO, paid campaigns, and growth strategies focused on real business results.
          </p>

          <p className="mt-3 font-medium">
            ₹15,000 · Monthly
          </p>
        </div>
      </div>
    </main>
  );
}
