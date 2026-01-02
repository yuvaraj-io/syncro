import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * DELETE /api/admin/bookings/:id
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: { status: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Slot not found" },
        { status: 404 }
      );
    }

    if (booking.status === "BOOKED") {
      return NextResponse.json(
        { error: "Cannot delete booked slot" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    );
  }
}
