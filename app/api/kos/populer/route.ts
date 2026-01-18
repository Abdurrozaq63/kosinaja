// /api/kos/populer/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Hitung jumlah kunjungan berdasarkan kos
    const populer = await prisma.riwayat_user.groupBy({
      by: ['id_tipe'], // group berdasarkan id_tipe
      _count: {
        id_tipe: true, // hitung jumlah kunjungan
      },
      orderBy: {
        _count: {
          id_tipe: 'desc', // urutkan dari yang terbanyak
        },
      },
    });

    // Ambil detail kos (nama kos, nama tipe) berdasarkan id_tipe
    const result = await Promise.all(
      populer.map(async (item) => {
        const tipe = await prisma.tipe_kos.findUnique({
          where: { id_tipe: item.id_tipe },
          include: { kos: true }, // join ke tabel kos
        });
        return {
          id_tipe: item.id_tipe,
          nama_tipe: tipe?.nama_tipe,
          nama_kos: tipe?.kos.nama_kos,
          total_kunjungan: item._count.id_tipe,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
