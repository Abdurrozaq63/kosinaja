import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'id_simpan diperlukan ' },
      { status: 400 }
    );
  }
  try {
    const simpanList = await prisma.simpan.findMany({
      where: {
        id_user: id,
      },
    });
    return NextResponse.json(simpanList);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}
