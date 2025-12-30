import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  const bookings = await prisma.booking.findMany({
    where: phone ? { phone } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      service: {
        select: {
          name: true,
          description: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  try {
    const { serviceId, date, slot, phone } = await req.json();

    if (!serviceId || !date || slot === undefined || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // 🔒 Prevent double booking
    const existing = await prisma.booking.findFirst({
      where: {
        serviceId,
        date: bookingDate,
        slot,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date: bookingDate,
        slot,
        phone,
        // status defaults to PENDING
      },
    });

    return NextResponse.json({
      id: booking.id,
      status: booking.status,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
