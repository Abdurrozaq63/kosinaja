// app/kos/component/detail.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTipeKos, useIdStore, useRole } from '@/store/useDataStore';
import {
  MapPin,
  Home,
  Wallet,
  Ruler,
  Shield,
  Clock,
  Users,
  Bed,
  Building2,
  X,
} from 'lucide-react';

type Fasilitas = Record<string, boolean>;

type TipeKos = {
  id_tipe: string;
  id_kos: string;
  nama_tipe: string;
  jenis_kos: string;
  harga: number;
  jarak: number;
  luas_kamar: string;
  jam_malam: string;
  jmlh_kamar: number;
  kmr_terisi: number;
  status: string;
  fasilitas_kamar: Fasilitas;
  fasilitas_umum: Fasilitas;
  keamanan: Fasilitas;
};

type DetailProps = {
  id_tipe: string | null;
  onSuccess?: () => void;
};

export default function Detail({ id_tipe, onSuccess }: DetailProps) {
  const { TipeKosStore, fetchTipeKoss } = useTipeKos();
  const { idStore } = useIdStore();
  const { role } = useRole();

  const calledRef = useRef(false);
  console.log('tipekos', TipeKosStore);
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    fetchTipeKoss();

    if (role === 'pengguna' && idStore && id_tipe) {
      fetch('/api/riwayat_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user: idStore, id_tipe }),
      });
    }
  }, [fetchTipeKoss, role, idStore, id_tipe]);

  const kosSelect = TipeKosStore.find((item) => item.id_tipe === id_tipe) as
    | TipeKos
    | undefined;

  const renderFasilitas = (fasilitas: Fasilitas | undefined) => {
    if (!fasilitas) return '-';
    const aktif = Object.entries(fasilitas)
      .filter(([_, val]) => val)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    return aktif.length ? aktif.join(', ') : '-';
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border relative top-0 border-slate-200">
      <div className="flex flex-col lg:flex-row">
        {/* Gambar */}
        {/* Gambar */}
        <div className="relative w-full lg:w-2/5 h-[220px] sm:h-[260px] lg:h-auto lg:aspect-[5/3] bg-gray-200 overflow-hidden">
          <img
            src={`/api/upimg/${kosSelect?.nama_tipe}${kosSelect?.id_kos}`}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />

          <div className="absolute inset-0 flex items-center justify-center p-3">
            <img
              src={`/api/upimg/${kosSelect?.nama_tipe}${kosSelect?.id_kos}`}
              alt="Uploaded"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Detail */}
        <div className="p-4 sm:p-6 lg:w-3/5 flex flex-col text-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 border-b pb-3 mb-4">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
            {kosSelect?.nama_tipe || '-'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <DetailBox
              icon={<Users />}
              label="Jenis Kos"
              value={kosSelect?.jenis_kos}
            />
            <DetailBox
              icon={<Wallet />}
              label="Harga"
              value={`Rp ${kosSelect?.harga?.toLocaleString()}`}
            />
            <DetailBox
              icon={<MapPin />}
              label="Jarak"
              value={`${kosSelect?.jarak} meter`}
            />
            <DetailBox
              icon={<Ruler />}
              label="Luas Kamar"
              value={kosSelect?.luas_kamar}
            />
            <DetailBox
              icon={<Bed />}
              label="Fasilitas Kamar"
              value={renderFasilitas(kosSelect?.fasilitas_kamar)}
            />
            <DetailBox
              icon={<Home />}
              label="Fasilitas Umum"
              value={renderFasilitas(kosSelect?.fasilitas_umum)}
            />
            <DetailBox
              icon={<Shield />}
              label="Keamanan"
              value={renderFasilitas(kosSelect?.keamanan)}
            />
            <DetailBox
              icon={<Clock />}
              label="Jam Malam"
              value={kosSelect?.jam_malam}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t bg-slate-50 flex justify-center sm:justify-end">
        <button
          onClick={onSuccess}
          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl shadow-md w-full sm:w-auto">
          <X className="w-5 h-5" /> Tutup
        </button>
      </div>
    </div>
  );
}

function DetailBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-slate-800">{value || '-'}</p>
    </div>
  );
}
