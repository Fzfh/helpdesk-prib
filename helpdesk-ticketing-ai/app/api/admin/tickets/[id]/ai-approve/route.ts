import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 WAJIB di-await dulu
  const { id } = await params;
  const { approved } = await req.json();

  await prisma.aiSuggestion.update({
    where: { ticketId: id },
    data: { isApproved: approved },
  });

  return NextResponse.json({ success: true });
}