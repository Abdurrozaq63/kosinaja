import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Coba cari di masing-masing tabel
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin && bcrypt.compareSync(password, admin.password)) {
    return NextResponse.json({
      status: 'success',
      user: { id: admin.id_admin, email: admin.email, role: 'admin' },
      token: jwt.sign(
        { id: admin.id_admin, role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      ),
    });
  }

  const pemilik = await prisma.kos.findUnique({ where: { email } });
  if (pemilik && bcrypt.compareSync(password, pemilik.password)) {
    return NextResponse.json({
      status: 'success',
      user: { id: pemilik.id_kos, email: pemilik.email, role: 'pemilik_kos' },
      token: jwt.sign(
        { id: pemilik.id_kos, role: 'pemilik_kos' },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      ),
    });
  }

  const pengguna = await prisma.user.findUnique({ where: { email } });

  if (pengguna && bcrypt.compareSync(password, pengguna.password)) {
    return NextResponse.json({
      status: 'success',
      user: { id: pengguna.id_user, email: pengguna.email, role: 'pengguna' },
      token: jwt.sign(
        { id: pengguna.id_user, role: 'pengguna' },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      ),
    });
  }

  return NextResponse.json(
    { status: 'error', message: 'Email atau password salah' },
    { status: 401 }
  );
}
