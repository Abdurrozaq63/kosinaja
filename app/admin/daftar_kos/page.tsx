'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useKos, useIdKosSelect } from '@/store/useDataStore';
import { MapPin } from 'lucide-react';

export default function DaftarUser() {
  const router = useRouter();
  const { KosStore } = useKos();
  const { setIdKosSelect } = useIdKosSelect();

  useEffect(() => {}, []);

  const handleLihat = (id_kos: string) => {
    setIdKosSelect(id_kos);
    router.push('/admin/daftar_kos/tipe_kamar');
  };

  return (
    <div className="flex flex-col justify-start items-center w-full mb-3">
      {/* Header */}
      <div className="w-full px-4 sm:px-5 py-4 text-start">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          📋 Daftar Kos
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-72">
          Berikut adalah daftar kos yang sudah terdaftar dalam sistem
        </p>
      </div>

      {/* Table Wrapper */}
      <div className="w-full px-4 sm:px-5 overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-full w-full max-w-6xl bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-violet-600 font-semibold text-gray-100 text-center text-sm sm:text-base">
            <div className="p-2 sm:p-3">Nama Kos</div>
            <div className="p-2 sm:p-3">No Telepon</div>
            <div className="p-2 sm:p-3">Alamat</div>
            <div className="p-2 sm:p-3">Email</div>
            <div className="p-2 sm:p-3">Aksi</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {KosStore.map((k, index) => (
              <div
                key={index}
                className="grid grid-cols-5 text-center text-sm sm:text-base hover:bg-gray-50 transition">
                <div className="p-2 sm:p-3 text-gray-800">{k.nama_kos}</div>
                <div className="p-2 sm:p-3 text-gray-800">{k.notelp}</div>
                <div className="p-2 sm:p-3 text-gray-800">
                  <a
                    href={k.alamat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 flex justify-center sm:justify-start items-center cursor-pointer">
                    <MapPin className="w-4 h-4 text-slate-500 mr-1 sm:mr-2" />
                    Lihat Map
                  </a>
                </div>
                <div className="p-2 sm:p-3 text-gray-800">{k.email}</div>
                <div className="p-2 sm:p-3">
                  <button
                    onClick={() => handleLihat(k.id_kos)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow transition">
                    Lihat
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {KosStore.length === 0 && (
            <div className="p-4 sm:p-5 text-center text-gray-500">
              Belum ada data kos yang tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
