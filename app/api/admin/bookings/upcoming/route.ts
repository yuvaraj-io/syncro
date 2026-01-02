import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/admin/bookings/upcoming
 * Returns BOOKED slots with user phone + service name
 * (without Prisma relations)
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ Fetch bookings only
    const bookings = await prisma.booking.findMany({
      where: {
        status: "BOOKED",
        date: {
          gte: today,
        },
      },
      orderBy: [
        { date: "asc" },
        { hour: "asc" },
      ],
    });

    // 2️⃣ Enrich each booking manually
    const enriched = await Promise.all(
      bookings.map(async (b) => {
        let phone: string | null = null;
        let serviceName: string | null = null;

        if (b.login_id) {
          const user = await prisma.user.findUnique({
            where: { id: b.login_id },
            select: { phone: true },
          });
          phone = user?.phone ?? null;
        }

        if (b.service_id) {
          const service = await prisma.service.findUnique({
            where: { id: b.service_id },
            select: { name: true },
          });
          serviceName = service?.name ?? null;
        }

        return {
          id: b.id,
          date: b.date,
          hour: b.hour,
          message: b.message,
          phone,
          serviceName,
          created_at: b.created_at,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("admin upcoming bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming bookings" },
      { status: 500 }
    );
  }
}
