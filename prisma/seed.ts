import { prisma } from '../lib/prisma';

async function main() {
  await prisma.kos.createMany({
    data: [
      {
        id_kos: '20c2881d-5cc3-4277-8a24-6f5308c04b7e',
        nama_kos: 'Kos Medico',
        notelp: '081337300653',
        alamat: 'https://maps.app.goo.gl/GMvJQSQJTqS9Zf8S6',
        email: 'medico@gmail.com',
        password:
          '$2a$10$3XrnpdCLB4J6e2KItlKxQ.ck0gqnQsdqLYrjPL1Pf.0ncqFYbZcS.',
        createdAt: new Date('2025-08-28T04:52:40.454Z'),
      },
      {
        id_kos: '4ebe5189-4772-45d0-a38f-b5d872f69bb5',
        nama_kos: 'Kos Berdikari',
        notelp: '082236826890',
        alamat: 'https://maps.app.goo.gl/sFZk9LAGNVEV65MS7',
        email: 'berdikari@gmail.com',
        password:
          '$2a$10$j5Y6nl2dL/7NK7vF.tOssuSdzHxhgZoeoZUxV5T/KL1DjDZywiqri',
        createdAt: new Date('2025-08-28T04:53:48.746Z'),
      },
      {
        id_kos: '788179b2-3abf-4bb6-a3ac-5dd810f4ef3a',
        nama_kos: 'Kos Pak Hasan',
        notelp: '085740962930',
        alamat: 'https://maps.app.goo.gl/vmhAQ2nh8DwU3YDN8',
        email: 'hasan@gmail.com',
        password:
          '$2a$10$hd2fVrsrMORTu5dCQrR36Ol540KW1tUMJ2gaYk1FWPQbCyfyq1GyO',
        createdAt: new Date('2025-08-28T04:49:09.362Z'),
      },
      {
        id_kos: '8dc413c0-12f3-4faa-91d2-1349166f9650',
        nama_kos: 'Kos Mas Nur',
        notelp: '08978117531',
        alamat: 'https://maps.app.goo.gl/eFVbM2MtgVpq5nw57',
        email: 'nur@gmail.com',
        password:
          '$2a$10$KzSJnBaAa8DXyk5pPiZ8FO1S0kMnd.i.j3IA7cao/9lUgU6D9bgPa',
        createdAt: new Date('2025-08-28T04:54:19.959Z'),
      },
      {
        id_kos: '9e02a4c3-5c01-4d44-be19-904df47b98d1',
        nama_kos: 'Kos Hinata Executive',
        notelp: '082133472716',
        alamat: 'https://maps.app.goo.gl/HUVFG6kv13tNRARD9',
        email: 'hinata@gmail.com',
        password:
          '$2a$10$pKCzsl6hLwGORurnuh.W1e50XE5dv1SoFU0MisCHrUsPZwi3byITC',
        createdAt: new Date('2025-08-28T04:50:09.060Z'),
      },
      {
        id_kos: 'a746d4d4-6c4e-4b63-982b-d9df9178ff2a',
        nama_kos: 'Kos White House',
        notelp: '082314526636',
        alamat: 'https://maps.app.goo.gl/7XfMCKGAXDojb3je8',
        email: 'white@gmail.com',
        password:
          '$2a$10$wdw3/bDouZJWMO9lsnfiPeV0cTMiHph5RAA1JlOjNftibnw/3NpG.',
        createdAt: new Date('2025-08-28T04:50:53.827Z'),
      },
      {
        id_kos: 'bf38082d-1591-46c6-af8a-c2d03e12ac71',
        nama_kos: 'Kos Test',
        notelp: '09876543',
        alamat: 'httpsekian',
        email: 'rozaqrizquna@gmail.com',
        password:
          '$2a$10$rF9LquT3zgZrd2GyaCXUEeID7UtZVY/AcKIqfTzNrMEg.RWFOkjfW',
        createdAt: new Date('2026-01-04T09:20:47.363Z'),
      },
      {
        id_kos: 'c42a030f-13d9-4051-82c0-01fe81c5ca04',
        nama_kos: 'Kos Pojok',
        notelp: '085886972077',
        alamat: 'https://maps.app.goo.gl/gq1iwyGUgbDcTDMb9',
        email: 'pojok@gmail.com',
        password:
          '$2a$10$QZIqx2KYWkDcC//dCsh6uu2I2kIbWc0h0vvSOGiWKMsHOjY4TitNC',
        createdAt: new Date('2025-08-28T04:46:17.003Z'),
      },
      {
        id_kos: 'd26cba6c-5419-4cdf-9d55-f96a9205b590',
        nama_kos: 'Kos Lana',
        notelp: '082133472716',
        alamat: 'https://maps.app.goo.gl/Se5G5BGL7akAsJqaA',
        email: 'lana@gmail.com',
        password:
          '$2a$10$IU3.I5egSDTKAeQCgxQIG.oakI8ngjKtl52rM2ymGE2MnLQLUOaWW',
        createdAt: new Date('2025-08-28T04:53:03.885Z'),
      },
      {
        id_kos: 'f9861b30-d285-45a6-abce-aa9aa2aba688',
        nama_kos: 'Kos Pak Ikhsan',
        notelp: '085712437208',
        alamat: 'https://maps.app.goo.gl/9NiXGLDAzNk47xBBA',
        email: 'ikhsan@gmail.com',
        password:
          '$2a$10$Ff8qD1cBUDvEpufHyNq4ruOIGSxTSRGckIjnlK.i6a0HdyXhfpNga',
        createdAt: new Date('2025-08-28T04:44:37.697Z'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed data kos berhasil');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
