import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// app/api/tipe-kos/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const { id_kos } = body;
  console.log('idkos', id_kos);

  if (!id_kos) {
    return NextResponse.json({ error: 'id_kos diperlukan' }, { status: 400 });
  }

  try {
    const tipeKosList = await prisma.tipe_kos.findMany({
      where: {
        id_kos: id_kos,
      },
    });

    return NextResponse.json(tipeKosList);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}
