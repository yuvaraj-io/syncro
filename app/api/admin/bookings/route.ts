import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/bookings?date=YYYY-MM-DD
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        date: new Date(date),
      },
      select: {
        id: true,
        hour: true,
        status: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { date, hour } = await req.json();

    if (!date || hour === undefined) {
      return NextResponse.json(
        { error: "Date and hour are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        id: crypto.randomUUID(),
        date: new Date(date),
        hour,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create slot" },
      { status: 500 }
    );
  }
}