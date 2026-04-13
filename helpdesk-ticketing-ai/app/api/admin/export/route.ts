import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = ["No Tiket", "Nama", "Email", "Judul", "Kategori", "Prioritas", "Status", "Tanggal"];
  
  const rows = tickets.map(t => [
    t.ticketNumber,
    t.clientName,
    t.clientEmail,
    t.title,
    t.category,
    t.priority,
    t.status,
    new Date(t.createdAt).toLocaleDateString("id-ID"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=tickets_export.csv",
    },
  });
}