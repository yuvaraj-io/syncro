import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    debugger
  const { searchParams } = new URL(req.url);

  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1–12

  if (!year || !month) {
    return NextResponse.json({}, { status: 400 });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { date: true },
  });

  // Map: { "YYYY-MM-DD": true }
  const result: Record<string, boolean> = {};

  bookings.forEach((b:any) => {
    const key = b.date.toISOString().split("T")[0];
    result[key] = true;
  });

  return NextResponse.json(result);
}
