# Alur Data Redesign Surabaya

## Lapisan aplikasi

1. `src/lib/surabaya-api.ts` adalah adapter data server. File ini memanggil API resmi lama dan mengubah respons mentah menjadi kontrak UI seperti `NavigationItem`, `NewsItem`, dan `ServiceItem`.
2. `src/app/page.tsx` adalah Server Component dan penyusun homepage. Semua data awal diambil paralel dengan `Promise.all`, lalu diberikan ke section melalui props.
3. `src/components/sections/` hanya menampilkan kontrak UI. Section interaktif boleh menyimpan state tampilan seperti filter, pencarian, atau wilayah yang dipilih, tetapi tidak perlu mengetahui bentuk respons API mentah.
4. `src/app/api/` adalah endpoint BFF untuk kebutuhan browser atau integrasi lain. Homepage tidak memanggil endpoint internal ini karena Server Component dapat memanggil adapter `src/lib/` secara langsung tanpa satu HTTP request tambahan.

## Contoh alur berita

```text
API resmi Surabaya
  -> getNews() di src/lib/surabaya-api.ts
  -> respons mentah dinormalisasi menjadi NewsItem[]
  -> HomePage di src/app/page.tsx
  -> <NewsSection items={news} />
  -> filter kategori disimpan sebagai state lokal
  -> judul, tanggal, gambar, dan tautan ditampilkan
```

## Kontrak yang wajib dipertahankan

- `HeroSection`: prop `navigation: NavigationItem[]`.
- `InteractiveMapSection`: prop `districts`; setiap item memiliki `key`, `name`, dan `data` demografi.
- `NewsSection`: prop `items: NewsItem[]`.
- `GovernmentServicesSection`: prop `services: ServiceItem[]`.

Nama class CSS, struktur layout, dan animasi boleh diubah. Nama field kontrak di atas tidak boleh diubah sepihak. Jika bentuk API atau database berubah, lakukan penyesuaian di adapter `src/lib/`, bukan di seluruh komponen UI.

## Props dan state

- **Props** membawa data server yang menjadi sumber kebenaran.
- **State** hanya untuk kondisi UI sementara: menu terbuka, filter aktif, kata pencarian, status peta, dan kecamatan terpilih.
- Jangan menyalin seluruh props ke state. Simpan hanya nilai interaksi yang memang berubah di browser.
- Jangan memanggil API resmi dari komponen client jika data diperlukan saat render awal. Ambil di Server Component agar data masuk ke HTML SSR.

Dengan batas ini, sumber data nanti dapat diganti ke database cukup dengan mengganti implementasi adapter sambil mempertahankan tipe keluarannya.

## Aturan route dan tombol

- URL resmi lama tetap dipertahankan secara lokal, misalnya `/id/berita/:id/:slug`, `/id/agenda/:id/:slug`, dan `/id/page/0/:id/:slug`.
- Route lama yang belum mempunyai layar khusus ditangani oleh `src/app/[...legacyPath]/page.tsx` agar tidak kembali ke desain situs lama.
- Tautan internal memakai `next/link` dan tidak membuka tab baru. Tautan ke layanan/domain eksternal tetap memakai elemen `a`, `target="_blank"`, serta `rel="noreferrer"`.
- Detail berita mengambil kategori API `berita`; detail agenda mengikuti kontrak lama dengan kategori `info`, lalu mencoba `agenda-detail` dari WebDisplay sebagai fallback.
- Komponen tidak membentuk URL gambar resmi sendiri. Seluruh variasi path gambar dinormalisasi di `src/lib/surabaya-api.ts`, sedangkan UI menyediakan gambar lokal bila sumber resmi kosong atau gagal dimuat.

Dengan pola ini, migrasi ke backend/database baru cukup mengganti isi fungsi adapter. Kontrak props dan route publik tidak perlu dirombak.
