import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json();

  await prisma.booking.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.booking.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
