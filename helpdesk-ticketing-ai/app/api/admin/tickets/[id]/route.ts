import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 WAJIB di-await dulu karena params adalah Promise
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: id },
    include: {
      responses: {
        include: { admin: { select: { username: true } } },
        orderBy: { createdAt: "asc" },
      },
      aiSuggestion: true,
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 WAJIB di-await dulu
  const { id } = await params;
  const body = await req.json();
  const { status, priority } = body;

  const ticket = await prisma.ticket.update({
    where: { id: id },
    data: { ...(status && { status }), ...(priority && { priority }) },
  });

  return NextResponse.json(ticket);
}