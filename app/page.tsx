import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="px-10 py-20 text-center border-b border-black">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Syncrometric
        </h1>

        <p className="mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
          We help businesses grow through result-driven digital marketing,
          high-performance websites, and scalable mobile applications.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/services"
            className="px-8 py-3 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            Book an Appointment
          </Link>

          <Link
            href="/services"
            className="px-8 py-3 border border-black hover:bg-black hover:text-white transition"
          >
            View Services
          </Link>
        </div>
      </section>

      {/* Why Syncrometric */}
      <section className="px-10 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Syncrometric
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="border border-black p-6">
            <h3 className="text-xl font-semibold">
              Strategy First Approach
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              We don’t just build websites or run ads. We understand your
              business goals and design solutions that align with measurable
              growth.
            </p>
          </div>

          <div className="border border-black p-6">
            <h3 className="text-xl font-semibold">
              Modern Technology Stack
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              Our solutions are built using modern frameworks and scalable
              architectures, ensuring speed, security, and long-term
              maintainability.
            </p>
          </div>

          <div className="border border-black p-6">
            <h3 className="text-xl font-semibold">
              Transparent Communication
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              No hidden costs, no jargon. You get clear timelines, honest
              updates, and complete visibility into the work being delivered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="px-10 py-16 bg-white border-t border-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          What We Do
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="border border-black p-6 hover:bg-black hover:text-white transition">
            <h3 className="text-xl font-semibold">Digital Marketing</h3>
            <p className="mt-3 text-sm">
              SEO, paid ads, content marketing, and growth campaigns designed
              to increase visibility and conversions.
            </p>
          </div>

          <div className="border border-black p-6 hover:bg-black hover:text-white transition">
            <h3 className="text-xl font-semibold">Website Development</h3>
            <p className="mt-3 text-sm">
              High-performance, SEO-friendly websites built for speed,
              accessibility, and conversion.
            </p>
          </div>

          <div className="border border-black p-6 hover:bg-black hover:text-white transition">
            <h3 className="text-xl font-semibold">Mobile App Development</h3>
            <p className="mt-3 text-sm">
              Scalable mobile applications tailored for startups and growing
              businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="px-10 py-20 text-center border-t border-black">
        <h2 className="text-3xl font-bold">
          Already working with us?
        </h2>

        <p className="mt-4 text-sm">
          View your appointments or manage your upcoming bookings.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/bookings"
            className="px-8 py-3 border border-black hover:bg-black hover:text-white transition"
          >
            My Bookings
          </Link>

          <Link
            href="/book"
            className="px-8 py-3 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            Book Another Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
