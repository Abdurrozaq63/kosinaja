-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Kos" (
    "id_kos" TEXT NOT NULL,
    "nama_kos" TEXT NOT NULL,
    "notelp" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kos_pkey" PRIMARY KEY ("id_kos")
);

-- CreateTable
CREATE TABLE "Tipe_kos" (
    "id_tipe" TEXT NOT NULL,
    "id_kos" TEXT NOT NULL,
    "nama_tipe" TEXT NOT NULL,
    "jenis_kos" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "jarak" INTEGER NOT NULL,
    "luas_kamar" TEXT NOT NULL,
    "fasilitas_kamar" JSONB NOT NULL,
    "fasilitas_umum" JSONB NOT NULL,
    "keamanan" JSONB NOT NULL,
    "jam_malam" TEXT NOT NULL,
    "jmlh_kamar" INTEGER NOT NULL,
    "kmr_terisi" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tipe_kos_pkey" PRIMARY KEY ("id_tipe")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "nama" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Riwayat_preferensi" (
    "id_preferensi" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "jarak" INTEGER NOT NULL,
    "luas_kamar" INTEGER NOT NULL,
    "fasilitas_kamar" TEXT NOT NULL,
    "fasilitas_umum" TEXT NOT NULL,
    "keamanan" TEXT NOT NULL,
    "jenis_kos" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Riwayat_preferensi_pkey" PRIMARY KEY ("id_preferensi")
);

-- CreateTable
CREATE TABLE "Riwayat_user" (
    "id_riwayat" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_tipe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Riwayat_user_pkey" PRIMARY KEY ("id_riwayat")
);

-- CreateTable
CREATE TABLE "Simpan" (
    "id_simpan" TEXT NOT NULL,
    "id_tipe" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Simpan_pkey" PRIMARY KEY ("id_simpan")
);

-- CreateTable
CREATE TABLE "Pengajuan" (
    "id_pengajuan" TEXT NOT NULL,
    "nama_kos" TEXT NOT NULL,
    "notelp" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengajuan_pkey" PRIMARY KEY ("id_pengajuan")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kos_email_key" ON "Kos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Tipe_kos" ADD CONSTRAINT "Tipe_kos_id_kos_fkey" FOREIGN KEY ("id_kos") REFERENCES "Kos"("id_kos") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Riwayat_preferensi" ADD CONSTRAINT "Riwayat_preferensi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Riwayat_user" ADD CONSTRAINT "Riwayat_user_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Riwayat_user" ADD CONSTRAINT "Riwayat_user_id_tipe_fkey" FOREIGN KEY ("id_tipe") REFERENCES "Tipe_kos"("id_tipe") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simpan" ADD CONSTRAINT "Simpan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simpan" ADD CONSTRAINT "Simpan_id_tipe_fkey" FOREIGN KEY ("id_tipe") REFERENCES "Tipe_kos"("id_tipe") ON DELETE CASCADE ON UPDATE CASCADE;
