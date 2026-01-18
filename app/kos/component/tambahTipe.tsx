// app/kos/component/tambahTipe.tsx
'use client';

import { useEffect, useState } from 'react';
import { useIdStore } from '@/store/useDataStore';

type Fasilitas = Record<string, boolean>;

type TambahTipeProps = {
  onSuccess?: () => void;
};

export default function TambahTipe({ onSuccess }: TambahTipeProps) {
  const { idStore } = useIdStore();

  const [id_kos, setId_kos] = useState('');
  const [nama_tipe, setNama_tipe] = useState('');
  const [jenis_kos, setJenis_kos] = useState('');
  const [harga, setHarga] = useState(0);
  const [jarak, setJarak] = useState(0);
  const [luas_kamar, setLuas_kamar] = useState(''); // tetap string
  const [jam_malam, setJam_malam] = useState('');
  const [jmlh_kamar, setJmlh_kamar] = useState(0);
  const [kmr_terisi, setKmr_terisi] = useState(0);

  const [fasilitas_kamar, setFasilitas_kamar] = useState<Fasilitas>({
    kasur: false,
    lemari: false,
    meja: false,
    kursi: false,
    ac: false,
    kamar_mandi: false,
    kipas_angin: false,
  });

  const [fasilitas_umum, setFasilitas_umum] = useState<Fasilitas>({
    dapur: false,
    ruang_tamu: false,
    parkir: false,
    jemuran: false,
    wifi: false,
    kulkas: false,
    mesin_cuci: false,
  });

  const [keamanan, setKeamanan] = useState<Fasilitas>({
    cctv: false,
    penjaga: false,
    gerbang: false,
    kartu_akses: false,
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // ambil id_kos dari store
  useEffect(() => {
    if (!idStore) return;
    setId_kos(idStore);
  }, [idStore]);

  const renameFile = (file: File) => {
    const ext = file.name.split('.').pop();
    const newFileName = `${nama_tipe}${id_kos}.${ext}`;
    return new File([file], newFileName, { type: file.type });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(renameFile(selected));
  };

  const handleCheckbox = (
    setState: React.Dispatch<React.SetStateAction<Fasilitas>>,
    prevState: Fasilitas,
    key: string
  ) => {
    setState({ ...prevState, [key]: !prevState[key] });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // simpan tipe kos
    const resTipe = await fetch('/api/tipekos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_kos,
        nama_tipe,
        jenis_kos,
        harga,
        jarak,
        luas_kamar, // string
        jam_malam,
        jmlh_kamar,
        kmr_terisi,
        fasilitas_kamar,
        fasilitas_umum,
        keamanan,
      }),
    });

    if (!resTipe.ok) {
      console.error('Gagal menyimpan tipe kos');
      setLoading(false);
      return;
    }

    // upload gambar
    if (!file) {
      setLoading(false);
      console.error('Tidak ada file dipilih');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resImg = await fetch('/api/upimg', {
        method: 'POST',
        body: formData,
      });
      const data = await resImg.json();
      if (resImg.ok) setUploadedImageUrl(data.filePath);
      else console.error('Gagal upload gambar', data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setLoading(false);
      onSuccess?.();
    }
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Tambah Tipe Kos</h2>

        <form onSubmit={handleUpload} className="grid grid-cols-3 gap-4">
          {/* input biasa */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-500">Nama Tipe</label>
              <input
                type="text"
                placeholder="Nama Tipe Kos"
                value={nama_tipe}
                onChange={(e) => setNama_tipe(e.target.value)}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-gray-500">jenis Kos</label>
              <input
                type="text"
                placeholder="Jenis Kos"
                value={jenis_kos}
                onChange={(e) => setJenis_kos(e.target.value)}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-gray-500">Harga</label>
              <input
                type="number"
                placeholder="Harga"
                value={harga}
                onChange={(e) => setHarga(Number(e.target.value))}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-gray-500">Jarak</label>
              <input
                type="number"
                placeholder="Jarak Kos Ke Kampus"
                value={jarak}
                onChange={(e) => setJarak(Number(e.target.value))}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-gray-500">Luas kamar</label>
              <input
                type="text"
                placeholder="Format 3x4"
                value={luas_kamar}
                onChange={(e) => setLuas_kamar(e.target.value)}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-gray-500">Jam Malam</label>
              <input
                type="text"
                placeholder="Jam Malam"
                value={jam_malam}
                onChange={(e) => setJam_malam(e.target.value)}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
          </div>

          {/* ✅ Checklist fasilitas_kamar */}
          <div className="col-span-3 gap-2 grid grid-cols-3">
            <div className="">
              <h3 className="font-semibold text-slate-700">Fasilitas Kamar</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(fasilitas_kamar).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-gray-500">
                    <input
                      type="checkbox"
                      className="text-gray-500"
                      checked={
                        fasilitas_kamar[key as keyof typeof fasilitas_kamar]
                      }
                      onChange={() =>
                        handleCheckbox(setFasilitas_kamar, fasilitas_kamar, key)
                      }
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            {/* ✅ Checklist fasilitas_umum */}
            <div className="">
              <h3 className="font-semibold text-slate-700">Fasilitas Umum</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(fasilitas_umum).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-gray-500">
                    <input
                      type="checkbox"
                      checked={
                        fasilitas_umum[key as keyof typeof fasilitas_umum]
                      }
                      onChange={() =>
                        handleCheckbox(setFasilitas_umum, fasilitas_umum, key)
                      }
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            {/* ✅ Checklist keamanan */}
            <div className="">
              <h3 className="font-semibold text-slate-700">Keamanan</h3>
              <div className="grid grid-cols-1 gap-1">
                {Object.keys(keamanan).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-gray-500">
                    <input
                      type="checkbox"
                      checked={keamanan[key as keyof typeof keamanan]}
                      onChange={() =>
                        handleCheckbox(setKeamanan, keamanan, key)
                      }
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* input lainnya */}
          <div className="col-span-3 grid grid-cols-3 gap-2">
            <div>
              <label className="text-gray-500">Jumlah Kamar</label>
              <input
                type="number"
                placeholder="Jumlah Kamar Kos"
                value={jmlh_kamar}
                onChange={(e) => setJmlh_kamar(Number(e.target.value))}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-gray-500">Kamar Terisi</label>
              <input
                type="number"
                placeholder="Kamar yang Sudah Terisi"
                value={kmr_terisi}
                onChange={(e) => setKmr_terisi(Number(e.target.value))}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
            </div>
            <div>
              <label htmlFor="picture" className="text-gray-500">
                PICTURE
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded text-slate-800"
              />
            </div>
          </div>

          {/* Tombol */}
          <div className="col-span-3 col-start-3 ">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
