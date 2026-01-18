'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Modal from './component/modal';
import TambahTipe from './component/tambahTipe';
import Edit from './component/edit';
import Hapus from './component/hapus';
import Detail from '../main/component/detail';
import { useKos, useIdStore } from '@/store/useDataStore';
import { Home, MapPin, Phone } from 'lucide-react';

/* ================= TYPE ================= */
type TipeKos = {
  id_tipe: string;
  id_kos: string;
  nama_tipe: string;
  jenis_kos: string;
  harga: number;
  jarak: number;
  luas_kamar: string;
  fasilitas_kamar: Record<string, boolean>;
  fasilitas_umum: Record<string, boolean>;
  keamanan: Record<string, boolean>;
  jam_malam: string;
  jmlh_kamar: number;
  kmr_terisi: number;
  status: string;
};

type KosData = {
  id_kos: string;
  nama_kos: string;
  alamat: string;
  notelp: number;
};

export default function Kos() {
  const [kosPemilik, setKosPemilik] = useState<TipeKos[]>([]);
  const [selectedKos, setSelectedKos] = useState<TipeKos | null>(null);
  const [selectedIdTipe, setSelectedIdTipe] = useState<string | null>(null);
  const [id_kos, setId_kos] = useState<string | null>(null);

  const { KosStore, fetchKoss } = useKos();
  const { idStore } = useIdStore();

  /* ================= FETCH ID KOS ================= */
  const fetchIdkos = useCallback(async () => {
    const res = await fetch('/api/getToken', {
      method: 'POST',
      credentials: 'include',
    });
    const data: { id: string } = await res.json();
    setId_kos(data.id);
  }, []);

  /* ================= FETCH TIPE KOS ================= */
  const fetchKos = useCallback(async () => {
    if (!id_kos) return;

    const res = await fetch('/api/tipekos/pemilik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_kos }),
    });

    const data: TipeKos[] = await res.json();
    setKosPemilik(data);
  }, [id_kos]);

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchIdkos();
    fetchKoss();
  }, [fetchIdkos, fetchKoss]);

  useEffect(() => {
    fetchKos();
  }, [fetchKos]);

  /* ================= MODAL ================= */
  const [openModal, setOpenModal] = useState<
    null | 'detail' | 'tambah' | 'edit' | 'hapus'
  >(null);

  const handleEdit = (kos: TipeKos) => {
    setSelectedKos(kos);
    setOpenModal('edit');
  };

  const handleDelete = (id_tipe: string) => {
    setSelectedIdTipe(id_tipe);
    setOpenModal('hapus');
  };

  const handleDetail = (id_tipe: string) => {
    setSelectedIdTipe(id_tipe);
    setOpenModal('detail');
  };

  const handleClose = () => setOpenModal(null);

  const kosin: KosData | undefined = KosStore.find(
    (k: KosData) => k.id_kos === idStore
  );

  return (
    <div className="flex flex-col w-full items-center  mb-3">
      {/* Info Kos */}
      <div className="w-full px-6 py-5 bg-white shadow-lg  border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Home className="w-6 h-6 text-indigo-500" />
          {kosin?.nama_kos}
        </h1>
        <p className="mt-1 text-slate-600 flex items-center gap-2">
          <a
            href={kosin?.alamat}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 flex justify-start items-center cursor-pointer">
            {' '}
            <MapPin className="w-4 h-4 text-slate-500 mr-2" />
            Lihat Map
          </a>
        </p>
        <p className="mt-1 text-slate-600 flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-500" />
          {kosin?.notelp}
        </p>
      </div>

      {/* Header daftar kamar */}
      <div className="w-full max-w-5xl flex justify-between items-center mt-8 mb-4 px-2">
        <h2 className="text-xl font-semibold text-slate-800">
          Daftar Tipe Kamar
        </h2>
        <button
          onClick={() => setOpenModal('tambah')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition">
          + Tambah Tipe
        </button>
      </div>

      {/* List tipe kamar */}
      <div className="w-full max-w-5xl mt-6">
        {kosPemilik.map((kos, index) => {
          return (
            <div
              key={index}
              className="w-full bg-white shadow-sm hover:shadow-md transition rounded-2xl p-5 flex gap-5 mt-5 border-2 border-gray-200">
              {/* Image placeholder */}

              <div className="relative w-72 aspect-[5/3] bg-gray-200 rounded-xl overflow-hidden">
                {/* Background blur */}
                <img
                  src={`/api/upimg/${kos.nama_tipe + kos.id_kos}`}
                  alt="Background Blur"
                  className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                />

                {/* Gambar utama */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`/api/upimg/${kos.nama_tipe + kos.id_kos}`}
                    alt="Uploaded Image"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="grid md:grid-cols-3 gap-4 text-gray-500">
                  <div>
                    <p className="text-gray-500 text-sm mt-2">Tipe Kos</p>
                    <p className="font-semibold">{kos.nama_tipe}</p>

                    <p className="text-gray-500 text-sm mt-2">Jenis Kos</p>
                    <p className="font-semibold">{kos.jenis_kos}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mt-2">Jarak Kampus</p>
                    <p className="font-semibold">{kos.jarak} m</p>
                    <p className="text-gray-500 text-sm mt-2">Luas Kamar</p>
                    <p className="font-semibold">{kos.luas_kamar} m²</p>
                    {/* <p className="text-gray-500 text-sm mt-2">Jumlah Kamar</p>
                      <p className="font-semibold">{kos.jmlh_kamar}</p>

                      <p className="text-gray-500 text-sm mt-2">Kamar Terisi</p>
                      <p className="font-semibold">{kos.kmr_terisi}</p> */}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mt-2">Harga</p>
                    <p className="font-semibold text-blue-600">
                      Rp. {kos.harga.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDetail(kos.id_tipe)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm shadow-md transition">
                    Detail
                  </button>
                  <button
                    onClick={() => handleEdit(kos)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm shadow-md transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(kos.id_tipe)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm shadow-md transition">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal isOpen={openModal !== null} onClose={handleClose}>
        {openModal === 'detail' && (
          <Detail id_tipe={selectedIdTipe} onSuccess={handleClose} />
        )}
        {openModal === 'tambah' && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Tambah Tipe Baru</h2>
            <TambahTipe
              onSuccess={() => {
                handleClose();
                fetchKos();
              }}
            />
          </div>
        )}
        {openModal === 'edit' && selectedKos && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Edit Tipe Kamar</h2>
            <Edit
              {...selectedKos}
              onSuccess={() => {
                handleClose();
                fetchKos();
              }}
            />
          </div>
        )}
        {openModal === 'hapus' && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Hapus Tipe Kamar</h2>
            <Hapus
              id_tipe={selectedIdTipe}
              onSuccess={() => {
                handleClose();
                fetchKos();
              }}
              onCancel={handleClose}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
