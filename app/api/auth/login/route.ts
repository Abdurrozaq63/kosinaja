import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT_SECRET not configured' },
        { status: 500 }
      );
    }

    // ADMIN
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin && bcrypt.compareSync(password, admin.password)) {
      return NextResponse.json({
        status: 'success',
        user: { id: admin.id_admin, email: admin.email, role: 'admin' },
        token: jwt.sign(
          { id: admin.id_admin, role: 'admin' },
          jwtSecret,
          { expiresIn: '1d' }
        ),
      });
    }

    // PEMILIK KOS
    const pemilik = await prisma.kos.findUnique({ where: { email } });
    if (pemilik && bcrypt.compareSync(password, pemilik.password)) {
      return NextResponse.json({
        status: 'success',
        user: {
          id: pemilik.id_kos,
          email: pemilik.email,
          role: 'pemilik_kos',
        },
        token: jwt.sign(
          { id: pemilik.id_kos, role: 'pemilik_kos' },
          jwtSecret,
          { expiresIn: '1d' }
        ),
      });
    }

    // PENGGUNA
    const pengguna = await prisma.user.findUnique({ where: { email } });
    if (pengguna && bcrypt.compareSync(password, pengguna.password)) {
      return NextResponse.json({
        status: 'success',
        user: {
          id: pengguna.id_user,
          email: pengguna.email,
          role: 'pengguna',
        },
        token: jwt.sign(
          { id: pengguna.id_user, role: 'pengguna' },
          jwtSecret,
          { expiresIn: '1d' }
        ),
      });
    }

    return NextResponse.json(
      { status: 'error', message: 'Email atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
