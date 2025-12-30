import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Get availability for a service on a specific date
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!dateStr || !serviceId) {
    return NextResponse.json(
      { error: "date and serviceId are required" },
      { status: 400 }
    );
  }

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const availability = await prisma.availability.findMany({
    where: {
      serviceId,
      date: {
        gte: date,
        lte: endOfDay,
      },
      isActive: true,
    },
    select: {
      slot: true,
    },
    orderBy: {
      slot: "asc",
    },
  });

  return NextResponse.json({
    availableSlots: availability.map(a => a.slot),
  });
}

// POST - Set availability for a service on a date
export async function POST(req: Request) {
  try {
    const { serviceId, date, slots } = await req.json();

    if (!serviceId || !date || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: "serviceId, date and slots are required" },
        { status: 400 }
      );
    }

    const availabilityDate = new Date(date);
    availabilityDate.setHours(0, 0, 0, 0);

    // Remove existing availability for this service + date
    await prisma.availability.deleteMany({
      where: {
        serviceId,
        date: availabilityDate,
      },
    });

    // Create new availability slots
    await prisma.availability.createMany({
      data: slots.map((slot: number) => ({
        serviceId,
        date: availabilityDate,
        slot,
        isActive: true,
      })),
    });

    return NextResponse.json({
      message: "Availability updated successfully",
      slots,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}
