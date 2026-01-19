'use client';
import { useEffect, useState } from 'react';
import { useKos, useIdStore, useSavedTipes } from '@/store/useDataStore';
import Modal from '@/app/kos/component/modal';
import BatalSimpan from './batalsimpan';
import Detail from '../component/detail';
import { MapPin } from 'lucide-react';

type KosSimpanData = {
  id_tipe: string;
  id_kos: string;
  nama_tipe: string;
  jenis_kos: string;
  jarak: number;
  luas_kamar: string;
  harga: number;
  simpan: { id_simpan: string }[];
};

export default function Simpan() {
  const { KosStore } = useKos();
  const { idStore } = useIdStore();
  const { removeSavedTipe } = useSavedTipes();

  const [kosSimpan, setKosSimpan] = useState<KosSimpanData[]>([]);
  const [selectedId_simpan, setSelectedId_simpan] = useState<string | null>(
    null
  );
  const [selectedId_Tipe, setSelectedId_Tipe] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<null | 'detail' | 'BatalSimpan'>(
    null
  );

  const fetchRelasiSimpan = async () => {
    if (!idStore) return;
    const res = await fetch('/api/simpan/relasiSimpan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idStore }),
    });
    const data: KosSimpanData[] = await res.json();
    setKosSimpan(data);
  };

  useEffect(() => {
    if (idStore) fetchRelasiSimpan();
  }, [idStore]);

  const handleBatalSimpan = (id_simpan: string, id_tipe: string) => {
    setSelectedId_simpan(id_simpan);
    setSelectedId_Tipe(id_tipe);
    setOpenModal('BatalSimpan');
    removeSavedTipe(id_tipe);
  };

  const handleDetail = (id_tipe: string) => {
    setSelectedId_Tipe(id_tipe);
    setOpenModal('detail');
  };

  const handleClose = () => setOpenModal(null);

  return (
    <div className="w-full px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full p-4 text-center sm:text-left mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 tracking-wide">
          Kos yang Disimpan
        </h1>
      </div>

      {/* Data Kos */}
      <div className="w-full max-w-5xl flex flex-col gap-4 sm:gap-5">
        {kosSimpan.length === 0 ? (
          <p className="text-slate-500 text-center mt-6 text-lg">
            Tidak ada kos yang disimpan
          </p>
        ) : (
          kosSimpan.map((kos) => {
            const koss = KosStore.find((k) => k.id_kos === kos.id_kos);

            return (
              <div
                key={kos.id_tipe}
                className="w-full rounded-2xl shadow-md bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 mt-5 hover:shadow-lg transition-shadow">
                {/* Gambar */}
                <div className="relative w-full sm:w-96 aspect-[5/3] bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={`/api/upimg/${kos.nama_tipe + kos.id_kos}`}
                    alt="Background Blur"
                    className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={`/api/upimg/${kos.nama_tipe + kos.id_kos}`}
                      alt="Uploaded Image"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Kolom 1 */}
                    <div>
                      <p className="font-semibold text-slate-700">Nama Kos</p>
                      <p className="text-slate-600">{koss?.nama_kos}</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        Tipe Kos
                      </p>
                      <p className="text-slate-600">{kos.nama_tipe}</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        Jenis Kos
                      </p>
                      <p className="text-slate-600">{kos.jenis_kos}</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        Lokasi
                      </p>
                      <a
                        href={koss?.alamat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 flex justify-start items-center cursor-pointer">
                        <MapPin className="w-4 h-4 text-slate-500 mr-2" />
                        Lihat Map
                      </a>
                    </div>

                    {/* Kolom 2 */}
                    <div>
                      <p className="font-semibold text-slate-700">No. Telp</p>
                      <p className="text-slate-600">{koss?.notelp}</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        Jarak Kampus
                      </p>
                      <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-sm">
                        {kos.jarak} m
                      </span>

                      <p className="font-semibold text-slate-700 mt-2">
                        Luas Kamar
                      </p>
                      <p className="text-slate-600">{kos.luas_kamar} m²</p>

                      <p className="font-semibold text-slate-700 mt-2">Harga</p>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-medium">
                        Rp {kos.harga.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tombol */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
                    <button
                      onClick={() => handleDetail(kos.id_tipe)}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-sm font-medium w-full sm:w-auto text-center transition">
                      Detail
                    </button>
                    <button
                      onClick={() =>
                        handleBatalSimpan(kos.simpan[0]?.id_simpan, kos.id_tipe)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm font-medium w-full sm:w-auto text-center transition">
                      Batal Simpan
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={openModal !== null} onClose={handleClose}>
        {openModal === 'detail' && (
          <Detail id_tipe={selectedId_Tipe} onSuccess={handleClose} />
        )}
        {openModal === 'BatalSimpan' && (
          <BatalSimpan
            id_simpan={selectedId_simpan}
            id_tipe={selectedId_Tipe}
            onSuccess={() => {
              handleClose();
              fetchRelasiSimpan();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
