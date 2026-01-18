import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ru = await prisma.riwayat_user.findMany();
  return NextResponse.json(ru);
}

//POST: menambah daftar riwayat baru
export async function POST(req: Request) {
  const { id_user, id_tipe } = await req.json();

  const newUserHistorys = await prisma.riwayat_user.create({
    data: {
      id_user,
      id_tipe,
    },
  });
  return NextResponse.json(newUserHistorys);
}
