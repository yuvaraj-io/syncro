import Link from "next/link";
import { cookies } from "next/headers";

export default function Header() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  const phone = cookieStore.get("phone")?.value;

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Syncrometrics
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/services" className="hover:text-blue-600">
            Services
          </Link>
          <Link href="#contact" className="hover:text-blue-600">
            Contact
          </Link>

          {/* Auth section */}
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-600 text-sm">
                {phone ?? "Logged in"}
              </span>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
