export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1️⃣ Group by date + status
    const grouped = await prisma.booking.groupBy({
      by: ["date", "status"],
      _count: {
        _all: true,
      },
      where: {
        date: {
          gte: new Date(new Date().toISOString().split("T")[0]),
        },
      },
    });

    /**
     * grouped example:
     * [
     *   { date: 2026-01-02, status: 'AVAILABLE', _count: { _all: 5 } },
     *   { date: 2026-01-02, status: 'BOOKED', _count: { _all: 10 } }
     * ]
     */

    // 2️⃣ Merge into calendar summary
    const map = new Map<
      string,
      { date: string; available_count: number; total_count: number }
    >();

    grouped.forEach(row => {
      const dateStr = row.date.toISOString().split("T")[0];

      if (!map.has(dateStr)) {
        map.set(dateStr, {
          date: dateStr,
          available_count: 0,
          total_count: 0,
        });
      }

      const entry = map.get(dateStr)!;

      entry.total_count += row._count._all;
      if (row.status === "AVAILABLE") {
        entry.available_count += row._count._all;
      }
    });

    return NextResponse.json(Array.from(map.values()));
  } catch (error) {
    console.error("Calendar summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar summary" },
      { status: 500 }
    );
  }
}
