import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const ticketNumber = req.nextUrl.searchParams.get("ticketNumber");

  if (!ticketNumber) {
    return NextResponse.json({ error: "Nomor tiket diperlukan" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { ticketNumber },
    include: {
      responses: {
        include: { admin: { select: { username: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}