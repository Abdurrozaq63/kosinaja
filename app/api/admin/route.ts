import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: ambil data admin
export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    console.error('GET ADMIN ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin' },
      { status: 500 }
    );
  }
}

// POST: tambah admin
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json({ message: 'Admin created', admin });
  } catch (error) {
    console.error('CREATE ADMIN ERROR:', error);
<<<<<<< HEAD
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
=======
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
>>>>>>> fec07d22291b9693559843b7c0cbd9ee7af64c3f
  }
}
