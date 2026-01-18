// app/api/riwayat_user/[id_user]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { id_user } = await req.json();
  const riwayat = await prisma.riwayat_user.findMany({
    where: { id_user: id_user },
    include: {
      tipeKos: {
        include: {
          kos: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(riwayat);
}

// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// //GET: mengambil daftar riwayat user
// export async function POST(req: Request) {
//   const { id_user } = await req.json();
//   console.log('id user', id_user);
//   if (!id_user) {
//     return NextResponse.json({ error: 'id user diperlukan ' }, { status: 400 });
//   }

//   try {
//     const riwayatUserData = await prisma.tipe_kos.findMany({
//       where: {
//         riwayat: {
//           some: {
//             id_user: id_user,
//           },
//         },
//       },
//       include: {
//         riwayat: true,
//       },
//     });

//     return NextResponse.json(riwayatUserData);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: 'terjadi kesalahan saat mengambil data' },
//       { status: 500 }
//     );
//   }
// }
