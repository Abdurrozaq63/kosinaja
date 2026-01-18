import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

//GET: mengambil daftar kos
export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id_user: true,
      nama: true,
      email: true,
      password: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { id_user, nama, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      id_user,
      nama,
      email,
      password: hashedPassword,
    },
  });
  return NextResponse.json(newUser);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const updated = await prisma.user.update({
    where: { id_user: body.id_user },
    data: {
      id_user: body.id_user,
      nama: body.nama,
      email: body.email,
      password: hashedPassword,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const deleted = await prisma.user.delete({
    where: { id_user: body.id_user },
  });
  return NextResponse.json(deleted);
}
