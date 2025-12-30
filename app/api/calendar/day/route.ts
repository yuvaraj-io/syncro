import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  // Get all bookings for this specific date
  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: date,
        lte: endOfDay,
      },
      status: {
        not: "CANCELLED" // Exclude cancelled bookings
      }
    },
    select: {
      slot: true,
      phone: true
    }
  });

  // Create array of all possible slots (9 AM to 6 PM, so 9 to 18)
  const allSlots = Array.from({ length: 10 }, (_, i) => i + 9); // 9-18 hours
  
  // Get booked slots
  const bookedSlots = bookings.map(b => b.slot);
  
  // Calculate available slots (exclude booked slots)
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  return NextResponse.json({ 
    bookings, // For admin calendar compatibility
    availableSlots, // For checkout page
    bookedSlots 
  });
}
