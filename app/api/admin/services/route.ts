import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * GET /api/services
 */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/services
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, description, duration } = body;

    if (!name || !price || !description || !duration) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        id: crypto.randomUUID(), // since DB doesn't auto-generate
        name,
        price: Number(price),
        description,
        duration: Number(duration),
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
