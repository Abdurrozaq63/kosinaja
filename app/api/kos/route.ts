import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

//GET: mengambil daftar kos
export async function GET() {
  const koss = await prisma.kos.findMany();
  return NextResponse.json(koss);
}

//POST: menambah daftar kos baru
export async function POST(req: Request) {
  try {
    const { nama_kos, notelp, alamat, email, password } = await req.json();
    console.log(
      'mencari kesamaan email',
      nama_kos,
      notelp,
      alamat,
      email,
      password
    );
    const existinguser = await prisma.kos.findUnique({ where: { email } });
    if (existinguser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newKos = await prisma.kos.create({
      data: {
        nama_kos,
        notelp,
        alamat,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'Kos Telah Sukses didaftarkan',
      newKos,
    });
  } catch {
    return NextResponse.json(
      { error: 'Pendaftaran kos gagal' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const updated = await prisma.kos.update({
    where: { id_kos: body.id_kos },
    data: {
      nama_kos: body.nama_kos,
      notelp: body.notelp,
      alamat: body.alamat,
      email: body.email,
      password: hashedPassword,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const deleted = await prisma.kos.delete({
    where: { id_kos: body.id_kos },
  });
  return NextResponse.json(deleted);
}
