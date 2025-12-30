import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1-12

  if (!year || !month) {
    return NextResponse.json({}, { status: 400 });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Get all availability records for this month
  const availability = await prisma.availability.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      isActive: true
    },
    select: { 
      date: true 
    }
  });

  // Map: { "YYYY-MM-DD": true }
  const result: Record<string, boolean> = {};

  availability.forEach((a) => {
    const key = a.date.toISOString().split("T")[0];
    result[key] = true;
  });

  return NextResponse.json(result);
}
