import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.service.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
  });

  return NextResponse.json(service);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      duration: Number(body.duration),
    },
  });

  return NextResponse.json(service);
}