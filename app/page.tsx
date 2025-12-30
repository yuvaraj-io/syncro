import Link from "next/link";

export default function HomePage() {
  return (
    <>

  <section className="min-h-screen flex items-center bg-gradient-to-br from-white to-slate-50">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          We Build Scalable Digital Products
          <span className="text-blue-600">for Growing Businesses</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-xl">
          Web & App Development · Digital Marketing · Product Strategy
        </p>
        <p className="mt-2 text-slate-500 max-w-xl">
          Turning ideas into reliable digital systems.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/book" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Book a Free Strategy Call</Link>
          <a href="#services" className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition">View Services</a>
        </div>
        <p className="mt-4 text-sm text-slate-400">No sales pitch. Just clarity.</p>
      </div>

      <div className="hidden md:block">
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
          <p className="text-sm text-slate-300">Sample Dashboard</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="h-24 bg-slate-800 rounded-lg"></div>
            <div className="h-24 bg-slate-800 rounded-lg"></div>
            <div className="h-24 bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="services" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center">What Syncrometric Does</h2>
      <div className="mt-16 grid md:grid-cols-4 gap-8">
        <div className="p-6 border rounded-xl hover:shadow-lg transition">
          <h3 className="font-semibold text-lg">💻 Web Development</h3>
          <ul className="mt-4 space-y-2 text-slate-600 text-sm">
            <li>Business websites</li>
            <li>Admin panels & dashboards</li>
            <li>Custom web applications</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl hover:shadow-lg transition">
          <h3 className="font-semibold text-lg">📱 App Development</h3>
          <ul className="mt-4 space-y-2 text-slate-600 text-sm">
            <li>Android & iOS apps</li>
            <li>Scalable backend systems</li>
            <li>Performance-focused builds</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl hover:shadow-lg transition">
          <h3 className="font-semibold text-lg">📊 Digital Marketing</h3>
          <ul className="mt-4 space-y-2 text-slate-600 text-sm">
            <li>Performance marketing</li>
            <li>SEO & content strategy</li>
            <li>Brand growth systems</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl hover:shadow-lg transition">
          <h3 className="font-semibold text-lg">⚙️ Product Consulting</h3>
          <ul className="mt-4 space-y-2 text-slate-600 text-sm">
            <li>MVP planning</li>
            <li>Tech roadmap</li>
            <li>Process optimization</li>
          </ul>
        </div>
      </div>
    </div>
  </section>


  <section className="py-24 bg-slate-50">
    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold">Why Syncrometric?</h2>
        <ul className="mt-6 space-y-3 text-slate-600">
          <li>• We think like founders, not just developers</li>
          <li>• Focus on scalability & long-term growth</li>
          <li>• Transparent communication</li>
          <li>• Business-first tech decisions</li>
          <li>• Real product experience</li>
        </ul>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow">
        <p className="text-slate-700 italic">
          “We don’t just deliver code. We build systems that grow with your business.”
        </p>
      </div>
    </div>
  </section>


  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center">Our Process</h2>
      <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-blue-600 text-xl font-bold">1</div>
          <h4 className="mt-2 font-semibold">Discover</h4>
          <p className="mt-2 text-sm text-slate-600">Understanding business & goals</p>
        </div>
        <div>
          <div className="text-blue-600 text-xl font-bold">2</div>
          <h4 className="mt-2 font-semibold">Design</h4>
          <p className="mt-2 text-sm text-slate-600">UX, UI & architecture</p>
        </div>
        <div>
          <div className="text-blue-600 text-xl font-bold">3</div>
          <h4 className="mt-2 font-semibold">Build</h4>
          <p className="mt-2 text-sm text-slate-600">Agile development</p>
        </div>
        <div>
          <div className="text-blue-600 text-xl font-bold">4</div>
          <h4 className="mt-2 font-semibold">Scale</h4>
          <p className="mt-2 text-sm text-slate-600">Launch & optimize</p>
        </div>
      </div>
    </div>
  </section>


  <section className="py-24 bg-slate-50">
    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div className="h-64 bg-slate-300 rounded-2xl"></div>
      <div>
        <h2 className="text-3xl font-bold">Founder’s Note</h2>
        <p className="mt-4 text-slate-600">
          “Syncrometric was built to solve real business problems using technology.
          Scalability, speed, and clarity are at the core of everything we build.”
        </p>
        <p className="mt-4 font-semibold">— Prakyath BM</p>
        <p className="text-sm text-slate-500">Founder, Syncrometric</p>
      </div>
    </div>
  </section>

  <section id="contact" className="py-24 bg-slate-900 text-white text-center">
    <h2 className="text-3xl md:text-4xl font-bold">Let’s Build Something That Lasts</h2>
    <p className="mt-4 text-slate-300">Start from scratch or scale an existing product.</p>
    <div className="mt-8 flex justify-center gap-4">
      <Link href="/services" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Book a Free Consultation</Link>
      <a href="#" className="px-6 py-3 border border-slate-500 rounded-lg hover:bg-slate-800 transition">Talk to Our Team</a>
    </div>
  </section>

  <footer className="py-8 bg-black text-slate-400 text-center text-sm">
    © Syncrometric. All rights reserved.
  </footer>
  </>
  );
}
