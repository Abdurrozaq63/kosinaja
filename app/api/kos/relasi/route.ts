import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allKosWithTipe = await prisma.kos.findMany({
    include: {
      tipeKos: true,
    },
  });
  return NextResponse.json(allKosWithTipe);
}
