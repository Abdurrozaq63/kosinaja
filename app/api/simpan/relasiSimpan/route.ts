import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'id_user diperlukan ' }, { status: 400 });
  }

  try {
    const tipeKosTersimpan = await prisma.tipe_kos.findMany({
      where: {
        simpan: {
          some: {
            id_user: id, // ID user yang mau difilter
          },
        },
      },
      include: {
        simpan: true, // kalau mau lihat juga data di tabel simpan
      },
    });
    return NextResponse.json(tipeKosTersimpan);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}
