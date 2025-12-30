import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="px-6 md:px-10 py-28 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Syncrometric
        </h1>

        <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-700">
          We help businesses grow through result-driven digital marketing,
          high-performance websites, and scalable mobile applications.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/book"
            className="px-8 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition"
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

      {/* WHY SYNCROMETRIC */}
      <section className="border-t border-black/10 px-6 md:px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">
          Why Syncrometric
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Strategy First Approach",
              desc:
                "We don’t just build websites or run ads. We deeply understand your business goals and design solutions focused on measurable growth."
            },
            {
              title: "Modern Technology Stack",
              desc:
                "Built using modern frameworks and scalable architectures to ensure speed, security, and long-term maintainability."
            },
            {
              title: "Transparent Communication",
              desc:
                "Clear timelines, honest updates, and full visibility. No jargon, no hidden costs."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="border border-black/20 p-8 hover:border-black transition"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-black/10 px-6 md:px-10 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-14">
          What We Do
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Digital Marketing",
              desc:
                "SEO, paid ads, content marketing, and performance-driven campaigns to increase visibility and conversions."
            },
            {
              title: "Website Development",
              desc:
                "Fast, SEO-friendly, conversion-focused websites built with modern web technologies."
            },
            {
              title: "Mobile App Development",
              desc:
                "Scalable mobile applications tailored for startups and growing businesses."
            }
          ].map((service) => (
            <div
              key={service.title}
              className="border border-black/20 p-8 bg-white hover:bg-black hover:text-white transition"
            >
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-4 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-black/10 px-6 md:px-10 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Ready to grow your business?
        </h2>

        <p className="mt-4 text-gray-700">
          Let’s discuss your goals and build something impactful together.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/book"
            className="px-8 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition"
          >
            Book a Consultation
          </Link>

          <Link
            href="/contact"
            className="px-8 py-3 border border-black hover:bg-black hover:text-white transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
