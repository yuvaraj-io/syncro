import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = cookies().get("session");
    const phoneCookie = cookies().get("phone");

    if (!session || !phoneCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const phone = phoneCookie.value;

    // 1️⃣ Get user
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Fetch bookings
    const bookings = await prisma.booking.findMany({
      where: {
        login_id: user.id,
        status: "BOOKED",
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        hour: true,
        message: true,
        service_id: true,
        created_at: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("my bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
