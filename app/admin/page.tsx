'use client';

import { useEffect, useState } from 'react';
import { useKos, useTipeKos } from '@/store/useDataStore';
import { Home, Building2, Users } from 'lucide-react';

type User = {
  nama: string;
  total_kunjungan: number;
};

type KosPopuler = {
  id_tipe: string;
  total_kunjungan: number;
};

export default function Admin() {
  const { KosStore } = useKos();
  const { TipeKosStore } = useTipeKos();

  const [userFetch, setUserFetch] = useState<User[]>([]);
  const [kosWT, setKosWT] = useState<KosPopuler[]>([]);
  const [userMostAktif, setUserMostAktif] = useState<User[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user');
      const data: User[] = await res.json();
      setUserFetch(data);
    };

    const fetchKosWT = async () => {
      const res = await fetch('/api/kos/populer');
      const data: KosPopuler[] = await res.json();
      setKosWT(data);
    };

    const fetchUserMost = async () => {
      const res = await fetch('/api/user/aktif');
      const data: User[] = await res.json();
      setUserMostAktif(data);
    };

    fetchUser();
    fetchKosWT();
    fetchUserMost();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6 border-b bg-white shadow-sm">
        <h1 className="text-slate-700 font-bold text-2xl sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Ringkasan Informasi Sistem Kos
        </p>
      </div>

      {/* Statistik ringkas */}
      <div className="w-full p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <Home className="w-6 sm:w-8 h-6 sm:h-8 text-indigo-500 mb-2" />
          <h2 className="font-medium text-slate-500 text-sm sm:text-base">
            Jumlah Kos Terdaftar
          </h2>
          <h5 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-2">
            {KosStore.length}
          </h5>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <Building2 className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-500 mb-2" />
          <h2 className="font-medium text-slate-500 text-sm sm:text-base">
            Jumlah Tipe Kamar Kos
          </h2>
          <h5 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-2">
            {TipeKosStore.length}
          </h5>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <Users className="w-6 sm:w-8 h-6 sm:h-8 text-rose-500 mb-2" />
          <h2 className="font-medium text-slate-500 text-sm sm:text-base">
            Total Pengguna
          </h2>
          <h5 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-2">
            {userFetch.length}
          </h5>
        </div>
      </div>

      {/* Daftar Kos & User */}
      <div className="w-full p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Kos & Tipe Terpopuler */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
          <h3 className="font-semibold text-slate-700 mb-3 text-base sm:text-lg">
            Kos & Tipe Terpopuler
          </h3>

          {kosWT.map((k, index) => {
            const tipeSelect = TipeKosStore.find(
              (t) => t.id_tipe === k.id_tipe
            );
            const kosSelect = KosStore.find(
              (kos) => kos.id_kos === tipeSelect?.id_kos
            );

            return (
              <div
                key={index}
                className="grid grid-cols-3 text-center border-b text-slate-800 text-sm sm:text-base">
                <div className="p-2">{kosSelect?.nama_kos}</div>
                <div className="p-2">{tipeSelect?.nama_tipe}</div>
                <div className="p-2">{k.total_kunjungan}</div>
              </div>
            );
          })}
        </div>

        {/* User Paling Aktif */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
          <h3 className="font-semibold text-slate-700 mb-3 text-base sm:text-lg">
            User Paling Aktif
          </h3>

          {userMostAktif.map((u, index) => (
            <div
              key={index}
              className="grid grid-cols-2 text-center border-b text-slate-800 text-sm sm:text-base">
              <div className="p-2">{u.nama}</div>
              <div className="p-2">{u.total_kunjungan}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
