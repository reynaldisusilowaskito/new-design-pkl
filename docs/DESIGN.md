# Design System — Surabaya Redesign

Dokumen ini menjelaskan desain yang **telah diimplementasikan** di proyek `redesign/`. Ia menjadi acuan UI/UX ketika section baru, route baru, atau data dari backend ditambahkan. Kontrak data dibahas lebih khusus pada [DATA_FLOW.md](./DATA_FLOW.md).

## 1. Arah desain

Redesign ini memosisikan portal Pemerintah Kota Surabaya sebagai pengalaman digital kota yang hangat, editorial, dan interaktif. Identitas tidak dibangun dengan pola hijau administratif lama; ia menggunakan kontras antara warna lembut, objek 3D, tipografi besar, dan informasi resmi yang terstruktur.

Prinsip utamanya:

- **Kota sebagai pengalaman.** Hero menceritakan Surabaya melalui Tugu Pahlawan, Suro-Boyo, Kota Lama, awan, dan transisi scroll.
- **Informasi resmi tanpa terasa kaku.** Data, layanan, berita, dan agenda tetap bersumber dari kanal resmi, namun diberi hierarki visual yang singkat dan mudah dipindai.
- **Interaksi memiliki tujuan.** Hover, deck kartu, filter, pencarian, map, carousel, dan modal dipakai untuk eksplorasi; bukan sekadar dekorasi.
- **Cepat sebagai bagian dari desain.** Data awal dirender dari server, section berat ditunda, dan gambar eksternal tidak memakai optimizer server yang dapat gagal pada DNS internal sumber lama.

## 2. Fondasi visual

### Palet

| Token | Nilai light | Peran |
| --- | --- | --- |
| `--paper` | `#fff7f6` | Latar utama hangat |
| `--ice` | `#edf2f7` | Latar dingin / permukaan sekunder |
| `--blush` | `#fbe1e1` | Bidang aksen lembut |
| `--rose` | `#f4c5c8` | Aksen utama, fokus dan CTA |
| `--lavender` | `#c5b3d2` | Aksen editorial dan grid |
| `--ink` | `#182438` | Teks utama dan bidang gelap |

Mode gelap mengganti token utama melalui `data-theme="dark"`: `--paper` menjadi `#101827`, `--ice` menjadi `#0b1422`, dan `--ink` menjadi `#f8f2ef`. Jangan memasukkan warna terang langsung pada component baru jika token dapat dipakai.

### Tipografi

- Font aplikasi: **Manrope Variable**.
- Heading memakai bobot medium (`450–600`) dengan letter-spacing negatif untuk karakter editorial.
- Judul besar sering dipadukan antara teks solid dan teks outlined melalui `-webkit-text-stroke`.
- Label metadata menggunakan huruf kapital, ukuran kecil, dan tracking lebar (`.12–.17em`).

### Bentuk dan kedalaman

- Radius utama: `20–34px` untuk panel dan section shell; pill dipakai untuk filter, switch, dan CTA kecil.
- Glass effect terbatas pada navbar, popup, badge, dan kontrol; gunakan `backdrop-filter` hanya pada elemen kecil agar GPU tetap ringan.
- Bayangan lembut bernuansa biru/ungu menggantikan shadow hitam murni.
- Grid, orbit, lingkaran dan marquee adalah elemen dekoratif tingkat rendah; seluruhnya `aria-hidden` dan tidak boleh menghalangi interaksi.

## 3. Urutan dan narasi homepage

`src/app/page.tsx` menyusun halaman dengan urutan berikut.

| Urutan | Section | Tujuan pengalaman | Komponen |
| --- | --- | --- | --- |
| 01 | Hero | Kesan pertama, identitas dan akses cepat | `sections/hero/HeroSection` |
| 02 | About | Memahami skala, profil, dan fokus kota | `sections/about/AboutSection` |
| 03 | Map | Eksplorasi 31 kecamatan dan data demografi | `sections/map/InteractiveMapSection` |
| 04 | News | Membaca informasi kota terbaru | `sections/news/NewsSection` |
| 05 | Services | Menemukan layanan pemerintah | `sections/services/GovernmentServicesSection` |
| 06 | Video | Menonton konten kanal Bangga Surabaya | `sections/videos/VideoShowcaseSection` |
| 07 | Agenda | Menemukan agenda dan pengumuman | `sections/agenda/CityAgendaSection` |
| 08 | Footer | Navigasi lanjutan, kontak, sosial, dan CTA | `layout/SiteFooter` |

Nomor section (`01`, `02`, dan seterusnya) harus dipertahankan saat section disunting atau ditambah karena ia membentuk narasi scroll.

## 4. Hero dan navbar

### Hero

Hero adalah scene scroll dengan tinggi sekitar dua viewport lebih. Tiga lapisan utamanya:

1. **Atmosfer:** gradient paper/blush, partikel geometri, dan awan bergerak.
2. **Landmark:** ilustrasi Kota Lama sebagai landasan bawah dan Tugu Pahlawan sebagai objek vertikal yang bergerak sepanjang scroll.
3. **Identitas dan aksi:** headline “Kota yang …”, slogan wajib, Suro-Boyo 3D, pencarian cepat, dan bubble shortcut.

Pada mode gelap, awan berubah menjadi bulan dan bintang. Kota Lama menjadi malam melalui pengurangan exposure pada gambar dasar dan jendela bangunan yang memancarkan cahaya amber kecil. Cahaya harus tetap mengikuti façade; jangan gunakan repeat gradient atau garis vertikal yang melintasi gambar.

Splash awal memunculkan tiga mark wajib dan wordmark Surabaya sebelum scene aktif. Bila user memakai `prefers-reduced-motion`, splash dan gerak non-esensial disederhanakan.

### Navbar

Navbar berada di dalam Hero, berbentuk capsule gelap semi-transparan. Isinya harus berasal dari `organization.menu`, bukan array visual baru. Menu desktop membuka mega menu; tablet/mobile menggunakan tombol menu.

Kontrol bahasa Indonesia/Inggris dan mode terang/gelap dikelompokkan sebagai satu control capsule kecil agar tidak bersaing dengan menu. Interaksi menu menggunakan klik sebagai mekanisme utama; hover hanya boleh meningkatkan affordance, tidak boleh membuat user kehilangan panel yang sedang dibuka.

## 5. Section konten

### About

About memakai gradient lavender-to-paper sebagai transisi dari Hero. Kontennya terdiri dari profil ringkas, tiga fakta kota, dan deck enam kartu. Kartu aktif membesar saat hover/focus; klik pertama di kartu nonaktif memilih kartu, klik berikutnya mengikuti link. Ini mencegah navigasi tidak sengaja.

### Peta interaktif

Peta berada dalam shell gelap dengan sidebar statistik. Peta MapLibre hanya dimuat ketika section mendekati viewport (`IntersectionObserver`) dan diletakkan dalam client-only dynamic import agar SSR tidak membuat error WebGL/hydration. Data demografi datang dari server melalui prop `districts`; kecamatan yang dipilih mengubah sidebar.

Bangunan 3D bersifat progressive: tampilan kota detail baru terlihat ketika zoom memadai. Kontrol navigasi, geolokasi, fullscreen, hover batas kecamatan, dan klik wilayah harus tidak menghalangi fallback/error state.

### News dan Agenda

News memakai transisi editorial “Kabar Kota”, filter kategori lokal, satu berita utama, dan daftar berita tambahan. Agenda menggunakan collage modular: hero agenda, kalender tanggal, kartu foto, daftar agenda, serta source tile.

Gambar dari `surabaya.go.id` menggunakan `next/image` dengan `unoptimized` secara lokal di komponen terkait. Ini disengaja untuk menghindari penolakan SSRF oleh image optimizer ketika domain sumber menyelesaikan hostname ke IP privat. Jangan mengaktifkan `dangerouslyAllowLocalIP` global hanya untuk gambar ini.

### Layanan, video, dan footer

- **Layanan:** pencarian dan filter kategori di browser, dengan grid layanan dari data server dan panel layanan populer.
- **Video:** koleksi horizontal, pilihan aktif, modal player `youtube-nocookie`, serta kontrol keyboard Escape.
- **Footer:** CTA akhir, navigasi anchor, kontak organisasi, link sosial, dan visual Suro-Boyo.

## 6. Interaksi, aksesibilitas, dan responsivitas

- Semua control interaktif memakai elemen native `button`, `a`, `input`, atau `form`.
- Dialog video menggunakan `role="dialog"`, `aria-modal`, dan dapat ditutup dengan Escape.
- Status peta memakai `aria-live`; peta memiliki `aria-label`.
- Gambar dekoratif memakai `alt=""` dan `aria-hidden`; gambar bermakna memiliki teks alternatif.
- Breakpoint utama berada sekitar `1200px`, `1080px`, `900px`, `780px`, `650px`, `620px`, `600px`, dan `480px`, disesuaikan per section.
- Tidak boleh ada horizontal scroll. Elemen besar harus memakai `minmax(0, 1fr)`, `clamp()`, `max-width`, atau overflow yang disengaja.
- Hormati `prefers-reduced-motion`; gerakan scene, marquee, hover, dan animasi dekoratif harus memiliki fallback diam.

## 7. Asset dan layering

Asset visual disimpan di `public/assets/redesign/`:

- `hero/`: Tugu Pahlawan, Suro-Boyo, Kota Lama, wordmark, mark wajib, dan ilustrasi pendukung.
- `about/`: sprite fitur dan statistik.
- `tourism/`: ilustrasi route wisata.
- `vendor/maplibre/`: worker MapLibre lokal untuk kompatibilitas browser.

Gunakan `next/image` untuk asset lokal berukuran besar, beri `sizes` yang sesuai, dan gunakan `fetchPriority="high"` hanya untuk landmark Hero yang benar-benar LCP. Hindari menambahkan gambar dekoratif besar ke initial bundle jika dapat dimuat saat section masuk viewport.

## 8. Batas implementasi dan aturan perubahan

1. Data server masuk melalui `src/lib/` lalu diberikan dari Server Component di `src/app/page.tsx`; UI tidak boleh memanggil API lama langsung saat render awal.
2. Perubahan struktur API dilakukan di adapter `src/lib/`, bukan di setiap section.
3. State client hanya untuk interaksi sementara: filter, pencarian, menu, video aktif, tema, bahasa, dan kecamatan terpilih.
4. Jangan menambah dependency untuk animasi sederhana; CSS dan DOM native adalah standar proyek.
5. Jaga visual mode terang dan gelap sebagai dua kondisi yang sama-sama dirancang, bukan sekadar invert warna.
6. Sebelum handoff, jalankan `yarn lint`, `yarn build`, dan `git diff --check`.

## 9. Lokasi implementasi utama

```text
src/app/page.tsx                         Komposisi SSR homepage
src/app/globals.css                      Token global dan override dark mode
src/context/ExperienceContext.jsx        Bahasa, tema, preferensi browser
src/components/navigation/               Navbar dan mega menu
src/components/sections/hero/            Scene Hero dan akses cepat
src/components/sections/{about,map,...}/  Section homepage per domain
src/components/layout/SiteFooter.*        Penutup halaman
src/lib/                                 Adapter data dan normalisasi API
public/assets/redesign/                  Asset visual terkurasi
```
