'use client';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useEffect, useState } from 'react';
import {
  useTipeKos,
  useKos,
  useIdStore,
  useSavedTipes,
  SavedTipe,
} from '@/store/useDataStore';
import Modal from '../kos/component/modal';
import Detail from './component/detail';
import { MapIcon, MapMinus, MapPin } from 'lucide-react';

const kepentinganOptions = [
  'Sangat Penting',
  'Penting',
  'Sedang',
  'Tidak Penting',
  'Sangat Tidak Penting',
];

const jenisKosOptions = ['putra', 'putri', 'semua'];

export default function Main() {
  const router = useRouter();
  const { TipeKosStore, fetchTipeKoss } = useTipeKos();
  const { idStore } = useIdStore();
  const { KosStore, fetchKoss } = useKos();
  const {
    savedTipes,
    addSavedTipe,
    removeSavedTipe,
    setAllSavedTipes,
    isTipeSaved,
  } = useSavedTipes();
  const [selectedId_Tipe, setSelectedId_Tipe] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hasilAkhir, setHasilAkhir] = useState<any[]>([]);

  const [preferensi, setPreferensi] = useState({
    harga: '',
    jarak: '',
    luas_kamar: '',
    fasilitas_kamar: '',
    fasilitas_umum: '',
    keamanan: '',
    jenis_kos: '',
  });
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (!idStore) return;
    const simpanFetch = async () => {
      const res = await fetch('/api/simpan/pilih', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idStore }),
      });
      const data: SavedTipe[] = await res.json();
      setAllSavedTipes(data || []);
    };

    fetchTipeKoss();
    fetchKoss();
    simpanFetch();
  }, [idStore, fetchTipeKoss, fetchKoss, setAllSavedTipes]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferensi({ ...preferensi, [e.target.name]: e.target.value });
  };

  const tingkatKepentingan: Record<string, number> = {
    'Sangat Penting': 5,
    Penting: 4,
    Sedang: 3,
    'Tidak Penting': 2,
    'Sangat Tidak Penting': 1,
  };

  type TipeKos = {
    id_tipe: string;
    harga: number;
    jarak: number;
    fasilitas_kamar: any;
    fasilitas_umum: any;
    keamanan: any;
    jenis_kos: any;
    [key: string]: any;
  };

  const getWeightNumber = (val: string) => tingkatKepentingan[val] ?? 0;

  type Preferensi = {
    harga: string;
    jarak: string;
    luas_kamar: string;
    fasilitas_kamar: string;
    fasilitas_umum: string;
    keamanan: string;
    jenis_kos: string; // kategorikal
  };

  const getNormalizedWeights = (pref: Preferensi) => {
    const raw = {
      harga: getWeightNumber(pref.harga),
      jarak: getWeightNumber(pref.jarak),
      luas_kamar: getWeightNumber(pref.luas_kamar),
      fasilitas_kamar: getWeightNumber(pref.fasilitas_kamar),
      fasilitas_umum: getWeightNumber(pref.fasilitas_umum),
      keamanan: getWeightNumber(pref.keamanan),
    };
    const sum = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    console.log('input preferensi', raw);
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v / sum])
    ) as unknown as typeof raw; // semua bobot dijamin sum=1
  };

  const EPSILON = 0.1;
  //parse luas kamar
  const parseLuasKamar = (luasStr: string): number => {
    if (!luasStr) return 0;
    const parts = luasStr.toLowerCase().split('x');
    if (parts.length !== 2) return 0;

    const panjang = parseFloat(parts[0].trim());
    const lebar = parseFloat(parts[1].trim());

    if (isNaN(panjang) || isNaN(lebar)) return 0;

    return panjang * lebar; // hitung luas
  };
  const normalizeBenefit = (value: number, min: number, max: number) => {
    if (max === min) return 1;
    return ((value - min) / (max - min)) * (1 - EPSILON) + EPSILON;
  };

  const normalizeCost = (value: number, min: number, max: number) => {
    if (max === min) return 0.5; // hindari division by zero
    return ((max - value) / (max - min)) * (1 - EPSILON) + EPSILON;
  };
  const scoringAlternatif = (data: TipeKos[]) => {
    const hargaList = data.map((d) => d.harga);
    const jarakList = data.map((d) => d.jarak);
    const luasList = data.map((d) => parseLuasKamar(d.luas_kamar));

    const minHarga = Math.min(...hargaList);
    const maxHarga = Math.max(...hargaList);

    const minJarak = Math.min(...jarakList);
    const maxJarak = Math.max(...jarakList);

    const minLuas = Math.min(...luasList);
    const maxLuas = Math.max(...luasList);

    // ---- FASILITAS KAMAR ----
    const scoreFasilitasKamar = (f: any): number => {
      const dasar = f.kasur && f.lemari && f.meja && f.kursi;
      if (!dasar) return 0;

      if (f.kamar_mandi && f.ac) return 1.0;
      if (f.kamar_mandi && f.kipas_angin) return 0.7;
      if (f.kamar_mandi) return 0.4;

      return 0.1; // hanya fasilitas dasar
    };

    // ---- FASILITAS UMUM ----
    const scoreFasilitasUmum = (f: any): number => {
      //bobot kriteria

      const dasar = f.wifi && f.parkir && f.jemuran;
      if (!dasar) return 0;

      if (f.ruang_tamu && f.dapur && f.kulkas && f.mesin_cuci && f.locker)
        return 1.0;
      if (f.ruang_tamu && f.dapur && f.kulkas && f.mesin_cuci) return 0.82;
      if (f.ruang_tamu && f.dapur && f.kulkas) return 0.64;
      if (f.ruang_tamu && f.dapur) return 0.46;
      if (f.ruang_tamu) return 0.28;

      return 0.1; // hanya dasar
    };

    // ---- KEAMANAN ----
    const scoreKeamanan = (f: any): number => {
      if (f.gerbang && f.cctv && f.penjaga && f.kartu_akses) return 1.0;
      if (f.gerbang && f.cctv && f.penjaga) return 0.7;
      if (f.gerbang && f.cctv) return 0.4;
      if (f.gerbang) return 0.1;
      return 0.1;
    };

    return data.map((item) => {
      const luas = parseLuasKamar(item.luas_kamar);
      return {
        ...item,
        luasValue: luas,
        scoreHarga: normalizeCost(item.harga, minHarga, maxHarga),
        scoreJarak: normalizeCost(item.jarak, minJarak, maxJarak),
        scoreLuas: normalizeBenefit(luas, minLuas, maxLuas),
        scoreFasilitasKamar: scoreFasilitasKamar(item.fasilitas_kamar),
        scoreFasilitasUmum: scoreFasilitasUmum(item.fasilitas_umum),
        scoreKeamanan: scoreKeamanan(item.keamanan),
      };
    });
  };

  const hitungTotalScore = (data: TipeKos[], pref: Preferensi) => {
    const w = getNormalizedWeights(pref);
    const scored = scoringAlternatif(data);

    // (opsional) hard filter jenis_kos jika user memilih spesifik
    const targetJenis = pref.jenis_kos?.toLowerCase();
    const filterJenis = (jk: string) => {
      if (!targetJenis || targetJenis === 'campur') return true;
      return jk.toLowerCase() === targetJenis;
    };
    console.log('w preferensi', w);

    // .filter((a) => filterJenis(a.jenis_kos))
    return scored
      .map((a) => {
        const totalScore =
          w.harga * a.scoreHarga +
          w.jarak * a.scoreJarak +
          w.luas_kamar * a.scoreLuas +
          w.fasilitas_kamar * a.scoreFasilitasKamar +
          w.fasilitas_umum * a.scoreFasilitasUmum +
          w.keamanan * a.scoreKeamanan;

        return { ...a, totalScore };
      })
      .sort((x, y) => y.totalScore - x.totalScore); // ranking desc
  };

  const handlePreference = async (e: React.FormEvent) => {
    e.preventDefault();

    const ranking = hitungTotalScore(TipeKosStore, preferensi);
    const filteredTipeKos = ranking.filter(
      (item) => item.jenis_kos === preferensi.jenis_kos
    );
    if (preferensi.jenis_kos == 'semua') {
      setHasilAkhir(ranking);
    } else {
      setHasilAkhir(filteredTipeKos);
    }
    setVisibleCount(3);
  };

  const handleSimpan = async (id_tipe: string) => {
    const res = await fetch('/api/simpan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_tipe,
        id_user: idStore,
      }),
    });
    const newSaved: SavedTipe = await res.json();
    addSavedTipe(newSaved);
  };

  const handleBatalSimpan = async (id_simpan: string, id_tipe: string) => {
    await fetch('/api/simpan', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_simpan }),
    });
    removeSavedTipe(id_tipe);
  };
  const handleDetail = async (id_tipe: string) => {
    setSelectedId_Tipe(id_tipe);
    setOpenModal('detail');
  };

  const [openModal, setOpenModal] = useState<null | 'detail'>(null);
  const handleClose = () => setOpenModal(null);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="w-full px-5 py-4 mt-2">
        <h1 className="text-slate-800 font-semibold text-3xl tracking-tight">
          🎯 Rekomendasi Kos
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sesuaikan preferensi kamu untuk menemukan kos terbaik
        </p>
      </div>

      {/* Preferensi */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-700">
            Preferensi Rekomendasi
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition">
            {isOpen ? '⬆ Sembunyikan' : '⬇ Tampilkan'}
          </button>
        </div>

        {isOpen && (
          <form onSubmit={handlePreference} className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                'harga',
                'jarak',
                'luas_kamar',
                'fasilitas_kamar',
                'fasilitas_umum',
                'keamanan',
              ].map((kriteria) => (
                <div key={kriteria} className="flex flex-col">
                  <label className="block font-medium capitalize text-gray-700 mb-1">
                    {kriteria.replace('_', ' ')}
                  </label>
                  <select
                    name={kriteria}
                    value={(preferensi as any)[kriteria]}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-500">
                    <option value="" className="text-gray-500">
                      Pilih tingkat kepentingan
                    </option>
                    {kepentinganOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="text-gray-500">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex flex-col">
                <label className="block font-medium text-gray-700 mb-1">
                  Jenis Kos
                </label>
                <select
                  name="jenis_kos"
                  value={preferensi.jenis_kos}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-500">
                  <option value="">Pilih jenis kos</option>
                  {jenisKosOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="text-gray-500">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl shadow hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition font-medium">
                {/* 💾  */}
                Proses
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Hasil */}
      <div className="w-full max-w-5xl mt-6">
        <h3 className="text-slate-700 font-semibold text-xl">
          ✨ Hasil Rekomendasi
        </h3>

        {hasilAkhir.slice(0, visibleCount).map((kos, index) => {
          const koss = KosStore.find((k) => k.id_kos === kos.id_kos);
          const isSaved = savedTipes.find(
            (item) => item.id_tipe === kos.id_tipe
          );

          return (
            <div
              key={index}
              className="w-full bg-white shadow-sm hover:shadow-md transition rounded-2xl p-5 flex gap-5 mt-5 border-2 border-gray-200">
              {/* Gambar */}
              <div className="relative w-96 aspect-[5/3] bg-gray-200 rounded-xl overflow-hidden">
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

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="grid md:grid-cols-2 gap-4 text-gray-500">
                  {/* Kolom 1 */}
                  <div>
                    <p className="text-gray-500 text-sm">Nama Kos</p>
                    <p className="font-semibold">{koss?.nama_kos}</p>

                    <p className="text-gray-500 text-sm mt-2">Tipe Kos</p>
                    <p className="font-semibold">{kos.nama_tipe}</p>

                    <p className="text-gray-500 text-sm mt-2">Jenis Kos</p>
                    <p className="font-semibold">{kos.jenis_kos}</p>

                    <p className="text-gray-500 text-sm mt-2">Alamat</p>
                    <a
                      href={koss?.alamat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 flex justify-start items-center cursor-pointer">
                      {' '}
                      <MapPin className="w-4 h-4 text-slate-500 mr-2" />
                      Lihat Map
                    </a>
                  </div>

                  {/* Kolom 2 */}
                  <div>
                    <p className="text-gray-500 text-sm">No. Telp</p>
                    <p className="font-semibold">{koss?.notelp}</p>

                    <p className="text-gray-500 text-sm mt-2">Jarak Kampus</p>
                    <p className="font-semibold">{kos.jarak} m</p>

                    <p className="text-gray-500 text-sm mt-2">Luas Kamar</p>
                    <p className="font-semibold">{kos.luas_kamar} m²</p>

                    <p className="text-gray-500 text-sm mt-2">Harga</p>
                    <p className="font-semibold text-blue-600">
                      Rp. {kos.harga.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Tombol */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleDetail(kos.id_tipe)}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium shadow hover:bg-blue-600 transition">
                    🔍 Detail
                  </button>
                  <button
                    onClick={() => {
                      if (isSaved) {
                        handleBatalSimpan(isSaved.id_simpan, kos.id_tipe);
                      } else {
                        handleSimpan(kos.id_tipe);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-medium shadow transition ${
                      isSaved
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}>
                    {isSaved ? '❌ Batal Simpan' : '💾 Simpan'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {visibleCount < hasilAkhir.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="px-5 py-2 mb-4 bg-blue-600 text-white rounded-lg hober:bg-blue-700 transition">
              Tampilkan Lebih Banyak
            </button>
          </div>
        )}
      </div>
      {/* Modal */}
      <Modal isOpen={openModal !== null} onClose={handleClose}>
        {openModal === 'detail' && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Detail Kos</h2>
            <Detail id_tipe={selectedId_Tipe} onSuccess={handleClose} />
          </div>
        )}
      </Modal>
    </div>
  );
}
