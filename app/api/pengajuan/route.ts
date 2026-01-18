import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const res = await prisma.pengajuan.findMany();
  return NextResponse.json(res);
}

export async function POST(req: NextRequest) {
  const { nama_kos, notelp, alamat, email, status } = await req.json();

  const newPengajuan = await prisma.pengajuan.create({
    data: {
      nama_kos,
      notelp,
      alamat,
      email,
      status,
    },
  });
  return NextResponse.json(newPengajuan);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await prisma.pengajuan.update({
    where: { id_pengajuan: body.id_pengajuan },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { id_pengajuan } = await req.json();
  const deleted = await prisma.pengajuan.delete({
    where: { id_pengajuan },
  });
  return NextResponse.json(deleted);
}
