import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

//GET: Mengambil  daftar tipe kos
export async function GET() {
  const tipeKos = await prisma.tipe_kos.findMany();
  return NextResponse.json(tipeKos);
}

//POST: menambah daftar kos baru
export async function POST(req: Request) {
  const {
    id_kos,
    nama_tipe,
    jenis_kos,
    harga,
    jarak,
    luas_kamar,
    fasilitas_kamar,
    fasilitas_umum,
    keamanan,
    jam_malam,
    jmlh_kamar,
    kmr_terisi,
  } = await req.json();
  // if (!id_tipe) {
  //   return NextResponse.json(
  //     { error: 'ID_tipe sudah digunakan' },
  //     { status: 400 }
  //   );
  // }
  try {
    const newTipeKos = await prisma.tipe_kos.create({
      data: {
        id_kos,
        nama_tipe,
        jenis_kos,
        harga,
        jarak,
        luas_kamar,
        fasilitas_kamar,
        fasilitas_umum,
        keamanan,
        jam_malam,
        jmlh_kamar,
        kmr_terisi,
      },
    });
    return NextResponse.json(newTipeKos);
  } catch (error) {
    // Tangani error jika terjadi masalah saat menyimpan
    console.error('Gagal menambahkan data tipe kos:', error);
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await prisma.tipe_kos.update({
    where: { id_tipe: body.id_tipe },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const deleted = await prisma.tipe_kos.delete({
    where: { id_tipe: body },
  });
  return NextResponse.json(deleted);
}
