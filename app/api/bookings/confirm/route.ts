import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1️⃣ Auth check
    const session = cookies().get("session");
    const phoneCookie = cookies().get("phone");

    if (!session || !phoneCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const phone = phoneCookie.value;

    const { bookingId, serviceId, message } = await req.json();

    if (!bookingId || !serviceId) {
      return NextResponse.json(
        { error: "Missing bookingId or serviceId" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Transaction → prevent double booking
    const booking = await prisma.$transaction(async tx => {
      const slot = await tx.booking.findUnique({
        where: { id: bookingId },
      });

      if (!slot) throw new Error("Slot not found");
      if (slot.status !== "AVAILABLE") {
        throw new Error("Slot already booked");
      }

      return tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "BOOKED",
          message: message || null,
          login_id: user.id,        // ✅ CORRECT
          service_id: serviceId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error("confirm booking error:", error);

    if (error.message === "Slot already booked") {
      return NextResponse.json(
        { error: "Slot is no longer available" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}
