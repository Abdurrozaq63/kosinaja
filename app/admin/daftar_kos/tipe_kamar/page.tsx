'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useKos, useIdKosSelect } from '@/store/useDataStore';
import Modal from '@/app/kos/component/modal';
import Detail from '@/app/main/component/detail';

type TipeKosItem = {
  id_tipe: string;
  id_kos: string;
  nama_tipe: string;
  jenis_kos: string;
  jarak: number;
  luas_kamar: number;
  harga: number;
};

export default function TipeKos() {
  const { KosStore } = useKos();
  const { idKosSelect } = useIdKosSelect();

  const [tipeKosSelect, setTipeKosSelect] = useState<TipeKosItem[]>([]);
  const [selectedId_Tipe, setSelectedId_Tipe] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<null | 'detail'>(null);

  const kosSelect = KosStore.find((k) => k.id_kos === idKosSelect);

  useEffect(() => {
    if (!idKosSelect) return;

    const fetchData = async () => {
      const res = await fetch('/api/tipekos/pemilik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_kos: idKosSelect }),
      });
      const data: TipeKosItem[] = await res.json();
      setTipeKosSelect(data);
    };

    fetchData();
  }, [idKosSelect]);

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6">
      {/* Header */}
      <div className="w-full max-w-5xl p-4 sm:p-5 mt-6 bg-white shadow-md rounded-xl border">
        <h1 className="text-slate-700 text-xl sm:text-2xl font-bold">
          {kosSelect?.nama_kos}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Daftar tipe kos yang tersedia
        </p>
      </div>

      {/* List tipe kos */}
      <div className="w-full mt-6 flex flex-col gap-4 sm:gap-5">
        {tipeKosSelect.map((kos) => (
          <div
            key={kos.id_tipe}
            className="w-full bg-white shadow-sm hover:shadow-md transition rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-5 border-2 border-gray-200">
            {/* Gambar kos */}
            <div className="relative w-full sm:w-72 aspect-[5/3] bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={`/api/upimg/${kos.nama_tipe + kos.id_kos}`}
                alt="Background"
                fill
                sizes="300px"
                className="object-cover blur-sm scale-110"
              />

              <div className="absolute inset-0">
                <Image
                  src={`/api/upimg/${kos.nama_tipe + kos.id_kos}`}
                  alt="Uploaded"
                  fill
                  sizes="300px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Detail kos */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-500">
                <div>
                  <p className="text-sm mt-2">Tipe Kos</p>
                  <p className="font-semibold">{kos.nama_tipe}</p>
                  <p className="text-sm mt-2">Jenis Kos</p>
                  <p className="font-semibold">{kos.jenis_kos}</p>
                </div>
                <div>
                  <p className="text-sm mt-2">Jarak Kampus</p>
                  <p className="font-semibold">{kos.jarak} m</p>
                  <p className="text-sm mt-2">Luas Kamar</p>
                  <p className="font-semibold">{kos.luas_kamar} m²</p>
                </div>
                <div>
                  <p className="text-sm mt-2">Harga</p>
                  <p className="font-semibold text-blue-600">
                    Rp. {kos.harga.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Tombol detail */}
              <div className="flex justify-start sm:justify-end gap-3 mt-4 sm:mt-5">
                <button
                  onClick={() => {
                    setSelectedId_Tipe(kos.id_tipe);
                    setOpenModal('detail');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium shadow hover:bg-blue-600 transition">
                  🔍 Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={openModal !== null} onClose={() => setOpenModal(null)}>
        {openModal === 'detail' && selectedId_Tipe && (
          <Detail
            id_tipe={selectedId_Tipe}
            onSuccess={() => setOpenModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
