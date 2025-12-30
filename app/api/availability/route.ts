import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Get availability for a specific date
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  // Parse the date string (YYYY-MM-DD format)
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all available slots for this date
  const availability = await prisma.availability.findMany({
    where: {
      date: {
        gte: date,
        lte: endOfDay,
      },
      isActive: true
    },
    select: {
      slot: true
    },
    orderBy: {
      slot: "asc"
    }
  });

  return NextResponse.json({ 
    availableSlots: availability.map(a => a.slot)
  });
}

// POST - Add availability slots
export async function POST(req: Request) {
  const { date, slots } = await req.json();

  if (!date || !slots || !Array.isArray(slots)) {
    return NextResponse.json(
      { error: "Date and slots array are required" },
      { status: 400 }
    );
  }

  const availabilityDate = new Date(date);
  availabilityDate.setHours(0, 0, 0, 0);

  // Delete existing availability for this date
  await prisma.availability.deleteMany({
    where: {
      date: availabilityDate
    }
  });

  // Create new availability slots
  const availabilityRecords = slots.map(slot => ({
    date: availabilityDate,
    slot: Number(slot),
    isActive: true
  }));

  await prisma.availability.createMany({
    data: availabilityRecords
  });

  return NextResponse.json({ 
    message: "Availability updated successfully",
    slots: slots
  });
}
