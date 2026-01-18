import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

//GET: mengambil data admin
export async function GET() {
  const admins = await prisma.admin.findMany();
  return NextResponse.json(admins);
}
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const existinguser = await prisma.admin.findUnique({ where: { email } });
    if (existinguser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });
    return NextResponse.json({
      message: 'admin registered succcessfully',
      admin,
    });
  } catch {
    return NextResponse.json({ error: 'registration failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const updated = await prisma.admin.update({
    where: { id_admin: body.id_admin },
    data: {
      email: body.email,
      password: hashedPassword,
    },
  });
  return NextResponse.json(updated);
}
