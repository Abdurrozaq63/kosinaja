import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

//GET
export async function GET() {
  const simpanKos = await prisma.simpan.findMany();
  return NextResponse.json(simpanKos);
}
//POST: menambah simpan
export async function POST(req: Request) {
  const { id_simpan, id_tipe, id_user } = await req.json();
  const newSimpanKos = await prisma.simpan.create({
    data: {
      id_simpan,
      id_tipe,
      id_user,
    },
  });
  return NextResponse.json(newSimpanKos);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const deleted = await prisma.simpan.delete({
    where: { id_simpan: body.id_simpan },
  });
  return NextResponse.json(deleted);
}
