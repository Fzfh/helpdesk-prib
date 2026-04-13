import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Statistik status
    const totalTickets = await prisma.ticket.count();
    const openTickets = await prisma.ticket.count({ where: { status: "Open" } });
    const inProgressTickets = await prisma.ticket.count({ where: { status: "In Progress" } });
    const closedTickets = await prisma.ticket.count({ where: { status: "Closed" } });

    // Data per bulan
    const allTickets = await prisma.ticket.findMany();
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthNames.map((month, index) => {
      const monthTickets = allTickets.filter(t => {
        const ticketMonth = new Date(t.createdAt).getMonth();
        return ticketMonth === index;
      });
      const total = monthTickets.length;
      const closed = monthTickets.filter(t => t.status === "Closed").length;
      return { month, total, closed };
    });

    // Top kategori
    const categoryCount: { [key: string]: number } = {};
    allTickets.forEach(ticket => {
      categoryCount[ticket.category] = (categoryCount[ticket.category] || 0) + 1;
    });
    
    const categoryData = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      closedTickets,
      monthlyData,
      categoryData,
    });
    
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}