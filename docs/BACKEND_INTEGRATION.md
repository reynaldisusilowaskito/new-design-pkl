# Kontrak Integrasi Backend

Dokumen ini menjadi checklist saat backend resmi dan database MySQL diberikan. Frontend tidak terhubung langsung ke MySQL. Semua akses data melewati API backend dan adapter server di `src/lib/`.

```text
Browser -> Next.js App Router -> adapter src/lib -> API backend -> MySQL
```

## Environment server

| Variabel | Wajib | Fungsi |
| --- | --- | --- |
| `BASE_API_URL` | Ya untuk data resmi | Base URL API utama tanpa credential di URL |
| `SIGNATURE` | Sesuai backend | Signature server-to-server; tidak boleh memakai awalan `NEXT_PUBLIC_` |
| `SURABAYA_SLUG` | Ya | Identitas tenant/domain pada API lama |
| `API_URL_WEBDISPLAY` | Opsional | Sumber fallback agenda lama |
| `NEXT_PUBLIC_SITE_URL` | Ya saat production | Origin canonical, contoh `https://surabaya.go.id` |
| `NEXT_PUBLIC_IMG` | Sesuai backend | Base URL aset publik bila masih dibutuhkan |

Gunakan `.env.example` sebagai daftar nama saja. Secret asli disimpan pada environment deployment, bukan Git.

## Kontrak UI yang harus dipertahankan

Backend boleh berubah, tetapi adapter harus tetap menghasilkan tipe berikut:

- `Organization` dan `NavigationItem[]`
- `NewsItem[]`
- `CityAgendaItem[]`
- `ServiceItem[]`
- `LegacyPage`
- kontrak wisata pada `src/lib/tourism-api.ts`

Jika respons backend baru berbeda, ubah transformasi di `src/lib/`, bukan komponen UI. Dengan cara ini desain tidak perlu dibongkar saat database dipasang.

## Syarat API sebelum integrasi

Mentor/backend developer perlu memberikan:

1. Base URL untuk development, staging, dan production.
2. OpenAPI/Swagger atau koleksi Postman.
3. Contoh respons sukses dan error untuk setiap endpoint.
4. Mekanisme signature/authentication serta masa berlakunya.
5. Pagination: `page`, `limit`, `total`, dan `lastPage`.
6. Aturan pencarian, filter, sorting, bahasa, dan timezone.
7. Host gambar/file yang diizinkan.
8. Rate limit dan kebijakan cache.
9. Health/readiness endpoint backend.
10. Prosedur migrasi/seed MySQL untuk tim backend—credential database tidak diberikan ke browser.

## Keamanan dan kegagalan

- Rich text CMS wajib disanitasi di server sebelum dirender.
- Signature dan credential MySQL tidak boleh berada dalam variable `NEXT_PUBLIC_*`.
- Semua fetch memiliki timeout dan fallback agar halaman tetap dapat digunakan.
- Fallback tidak boleh menyembunyikan insiden: error upstream dicatat secara terstruktur pada log server.
- Route Handler memvalidasi dan membatasi query sebelum meneruskannya ke adapter.

## Definition of done integrasi

- `GET /api/health` menunjukkan konfigurasi backend siap tanpa membocorkan secret.
- Menu, berita, agenda, layanan, halaman legacy, dan wisata memakai data staging.
- Detail dan indeks mendukung pagination sebenarnya.
- Respons kosong, timeout, 4xx, 5xx, dan gambar rusak diuji.
- `yarn verify` dan `yarn build` lolos di pull request.
- Smoke test route lama dan route redesign lolos di staging.
