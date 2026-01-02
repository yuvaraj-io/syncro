import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    const slots = await prisma.booking.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        status: "AVAILABLE",
      },
      select: {
        id: true,
        hour: true,
      },
      orderBy: {
        hour: "asc",
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("available slots error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
