// /api/kos/tipe-terpopuler/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const { id_kos } = await req.json(); // ambil id_kos pemilik kos

    // Ambil semua tipe kos milik pemilik kos tertentu
    const tipeKos = await prisma.tipe_kos.findMany({
      where: { id_kos },
      select: {
        id_tipe: true,
        nama_tipe: true,
        riwayat: {
          select: {
            id_riwayat: true,
          },
        },
      },
    });

    // Hitung jumlah kunjungan untuk tiap tipe kos
    const result = tipeKos.map((tipe) => ({
      id_tipe: tipe.id_tipe,
      nama_tipe: tipe.nama_tipe,
      total_kunjungan: tipe.riwayat.length,
    }));

    // Urutkan dari yang paling banyak dikunjungi
    result.sort((a, b) => b.total_kunjungan - a.total_kunjungan);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
