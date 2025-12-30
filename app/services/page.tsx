import Link from "next/link";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};


export default async function ServicesPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/services`);
  const services = await response.json();

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <Link href="/">
        <button className="px-2 py-2 border text-l">
          Home
        </button>
      </Link>
      <h1 className="text-4xl font-bold text-black mb-8 flex gap-3 pt-3">
        Our Services
      </h1>

      {services.length === 0 ? (
        <p className="text-gray-600">No services available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service:any) => (
            <div
              key={service.id}
              className="border border-black p-6 transition hover:bg-black hover:text-white"
            >
              <h2 className="text-xl font-semibold">
                {service.name}
              </h2>

              <p className="mt-3 text-sm leading-relaxed">
                {service.description}
              </p>

              <p className="mt-3 font-medium">
                ₹{service.price} · {service.duration} mins
              </p>

              <Link href={`/checkout?serviceId=${service.id}`}>
              <button className="mt-5 border border-black px-4 py-2 text-sm hover:bg-white hover:text-black">
                Select
              </button>
            </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
