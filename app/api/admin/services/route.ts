import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const { name, description, price, duration } = await req.json();

  if (!name || !description || !price || !duration) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const service = await prisma.service.create({
    data: {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
    },
  });

  return NextResponse.json(service);
}
