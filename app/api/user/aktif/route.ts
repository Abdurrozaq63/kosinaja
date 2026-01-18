// /api/user/aktif/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Hitung jumlah kunjungan berdasarkan id_user
    const aktif = await prisma.riwayat_user.groupBy({
      by: ['id_user'],
      _count: {
        id_user: true,
      },
      orderBy: {
        _count: {
          id_user: 'desc', // urutkan paling aktif
        },
      },
    });

    // Ambil detail user (misal nama/email)
    const result = await Promise.all(
      aktif.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id_user: item.id_user },
          select: {
            id_user: true,
            nama: true,
            email: true,
          },
        });
        return {
          id_user: item.id_user,
          nama: user?.nama,
          email: user?.email,
          total_kunjungan: item._count.id_user,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
