import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET: Ambil semua admin (kecuali super admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(admins);
}

// POST: Buat admin baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, email, password, isActive } = await req.json();

  // Validasi
  if (!username || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  // Cek apakah username atau email sudah ada
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingAdmin) {
    return NextResponse.json({ error: "Username atau email sudah digunakan" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      email,
      passwordHash: hashedPassword,
      isActive: isActive ?? true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(admin, { status: 201 });
}

// PUT: Update admin
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, username, email, password, isActive } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID admin diperlukan" }, { status: 400 });
  }

  const updateData: any = { username, email, isActive };
  if (password && password.trim() !== "") {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(admin);
}

// DELETE: Hapus admin (jangan hapus diri sendiri)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID admin diperlukan" }, { status: 400 });
  }

  // Jangan izinkan hapus diri sendiri
  if (id === session.user.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }

  await prisma.admin.delete({ where: { id } });

  return NextResponse.json({ success: true });
}