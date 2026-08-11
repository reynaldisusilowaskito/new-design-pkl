# Surabaya Redesign

Project utama baru untuk redesign portal Pemerintah Kota Surabaya.

## Arsitektur

- Next.js 16 App Router di folder `src/app/`
- React 19
- Server Components dan SSR untuk pengambilan data
- Next.js Route Handlers sebagai backend/BFF di `src/app/api/`
- Client Components hanya untuk interaksi Navbar, animasi Hero/About, dan WebGL MapLibre
- MapLibre GL untuk peta 3D interaktif
- Manrope variable font yang disimpan sebagai dependency lokal

Folder `frontend/` tidak menjadi dependency source code. Project tersebut hanya menjadi referensi kontrak API dan data awal saat proses migrasi.

### Struktur kode

```text
src/
├── app/                         # Wadah utama, routing, dan backend Next.js
│   ├── api/                     # Endpoint backend/BFF
│   ├── layout.tsx               # Akar global (pengganti App.js)
│   └── page.tsx                 # Penyusun urutan section homepage
├── components/
│   ├── navigation/              # Navbar dan navigasi global
│   └── sections/                # Potongan halaman berdasarkan fungsi
│       ├── hero/
│       ├── about/
│       ├── map/
│       └── news/
├── data/                        # Data statis dan fallback
└── lib/                         # Integrasi API dan pengolahan data server
```

Setiap section utama menggunakan satu file komponen dan satu CSS Module. Peta memiliki satu file tambahan `SurabayaMapCanvas` karena WebGL hanya dapat berjalan di browser. Tidak ada akhiran versi seperti `V2` pada nama final agar fungsi setiap file langsung terbaca.

## Environment

Project membaca environment berikut hanya di server:

- `BASE_API_URL`
- `SIGNATURE`
- `SURABAYA_SLUG`
- `NEXT_PUBLIC_IMG`

Untuk development lokal, `.env.local` sudah disalin dari konfigurasi development `frontend/`. File tersebut diabaikan Git.

## Menjalankan project

```powershell
cd C:\Users\ASUS\Documents\REYNALDI\PKL\redesign
yarn install
yarn dev
```

Buka `http://localhost:3000`.

Development menggunakan Turbopack agar kompilasi dan HMR cepat. Jika driver atau dependency lokal tertentu bermasalah dengan Turbopack, tersedia fallback:

```powershell
yarn dev:webpack
```

## Pemeriksaan

```powershell
yarn typecheck
yarn lint
yarn build
yarn start
```

Route homepage menggunakan SSR dinamis. Data API dipanggil server dan di-cache singkat oleh Next.js agar request berikutnya lebih cepat. Jika API tidak tersedia dalam lima detik, Navbar memakai fallback menu agar halaman tetap dapat dirender.

Backend Next.js dipisahkan per resource di `src/app/api/` agar kontrak, batas query, dan pengembangannya tetap jelas:

- `GET /api/health`
- `GET /api/organization`
- `GET /api/news?category=berita&limit=10`
- `GET /api/services?limit=15`
- `GET /api/videos?limit=6`
- `GET /api/agenda?limit=6`

Data demografi peta disiapkan Server Component. Rendering WebGL, geolocation, zoom, rotasi, dan klik wilayah tetap dijalankan browser karena API tersebut tidak tersedia di server.

Penjelasan kontrak props, state, dan alur API tersedia di [`docs/DATA_FLOW.md`](docs/DATA_FLOW.md).
