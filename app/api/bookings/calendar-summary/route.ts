import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Returns calendar summary for booking UI
 * - date
 * - available_count
 * - total_count
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const grouped = await prisma.booking.groupBy({
      by: ["date", "status"],
      _count: {
        _all: true,
      },
      where: {
        date: {
          gte: today,
        },
      },
    });

    /**
     * grouped example:
     * [
     *  { date: 2026-01-02, status: 'AVAILABLE', _count: { _all: 3 } },
     *  { date: 2026-01-02, status: 'BOOKED', _count: { _all: 2 } }
     * ]
     */

    const map = new Map<
      string,
      { available_count: number; total_count: number }
    >();

    grouped.forEach(row => {
      const dateStr = row.date.toISOString().split("T")[0];

      if (!map.has(dateStr)) {
        map.set(dateStr, { available_count: 0, total_count: 0 });
      }

      const entry = map.get(dateStr)!;

      entry.total_count += row._count._all;

      if (row.status === "AVAILABLE") {
        entry.available_count += row._count._all;
      }
    });

    const result = Array.from(map.entries()).map(([date, counts]) => ({
      date,
      available_count: counts.available_count,
      total_count: counts.total_count,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("calendar-summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar summary" },
      { status: 500 }
    );
  }
}
