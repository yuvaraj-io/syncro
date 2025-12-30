import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  let where: any = {};
  if (phone) {
    where.phone = phone;
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      service: {
        select: {
          name: true,
          description: true,
          price: true,
          duration: true
        }
      }
    }
  });

  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const { serviceId, date, slot, phone, message } = await req.json();

  if (!serviceId || !date || slot === undefined || !phone) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);

  const booking = await prisma.booking.create({
    data: {
      serviceId,
      date: bookingDate,
      slot,
      phone,
      status: "PENDING",
      userId: phone, // Use phone as user identifier for now
    },
  });

  return NextResponse.json({ 
    id: booking.id,
    status: booking.status,
    message: "Booking created successfully" 
  });
}


