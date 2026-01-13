# Card Gallery Component - Dokumentasi

## 📋 Overview
Tiga varian komponen galeri kartu dengan animasi hover 3D yang responsif dan menarik.

## 🎨 Varian Komponen

### 1. **StaggeredCardGallery** (Rekomendasi ⭐)
File: `components/card.gallery.staggered.tsx`

Layout kartu dengan stagger effect yang mirip dengan gambar design Anda. Kartu tersusun dengan rotasi dan offset yang berbeda-beda.

**Fitur:**
- Layout staggered dengan rotasi individual
- Animasi scale-up pada hover
- Drop shadow effect yang dinamis
- Z-index management otomatis

**Penggunaan:**
```tsx
import StaggeredCardGallery from '@/components/card.gallery.staggered';

export default function MyPage() {
  return (
    <StaggeredCardGallery 
      cards={[
        '/images/Card/front_card_1.png',
        '/images/Card/front_card_2.png',
        '/images/Card/front_card_3.png',
        '/images/Card/front_card_4.png',
      ]}
    />
  );
}
```

---

### 2. **RotateCardGallery**
File: `components/card.gallery.rotate.tsx`

Galeri kartu horizontal dengan animasi 3D yang responsif terhadap pergerakan mouse.

**Fitur:**
- Mouse position tracking untuk rotasi dinamis
- Horizontal scroll layout
- Shine effect overlay
- Spring animation yang smooth

**Penggunaan:**
```tsx
import RotateCardGallery from '@/components/card.gallery.rotate';

export default function MyPage() {
  return <RotateCardGallery />;
}
```

---

### 3. **CardGallery** (Basic)
File: `components/card.gallery.tsx`

Varian paling sederhana dengan layout flex dan animasi hover dasar.

**Fitur:**
- Layout responsif dengan flexbox
- Animasi scale dan rotate sederhana
- Shadow effect pada hover
- Cocok untuk tampilan desktop dan mobile

---

## 🎯 Customization

### Mengubah Kartu
```tsx
const customCards = [
  '/path/to/image1.png',
  '/path/to/image2.png',
  '/path/to/image3.png',
];

<StaggeredCardGallery cards={customCards} />
```

### Mengubah Ukuran Kartu
Edit di dalam component:
```tsx
width: '280px',  // Ubah lebar
height: '360px', // Ubah tinggi
```

### Mengubah Animasi
Sesuaikan `cardConfig` untuk staggered layout:
```tsx
const cardConfig = [
  {
    x: -180,      // Posisi horizontal
    y: 40,        // Posisi vertikal
    rotation: -12, // Rotasi awal
    zIndex: 1,    // Urutan depth
  },
  // ... kartu lainnya
];
```

---

## 🚀 Implementasi di Page Existing

### Contoh: Tambah ke Home Page
```tsx
// pages/index.tsx
import StaggeredCardGallery from '@/components/card.gallery.staggered';

export default function Home() {
  return (
    <Layout>
      {/* Komponen lain */}
      
      <Box sx={{ my: 8 }}>
        <StaggeredCardGallery />
      </Box>

      {/* Komponen lain */}
    </Layout>
  );
}
```

---

## 📱 Responsive Notes

### StaggeredCardGallery
- Desktop (>1024px): Layout penuh dengan offset sempurna
- Tablet (768-1024px): Ukuran kartu sedikit lebih kecil
- Mobile (<768px): Perlu penyesuaian layout (scroll horizontal)

**Jika perlu mobile responsive, gunakan media query:**
```tsx
sx={{
  width: { xs: '400px', sm: '500px', md: '600px' },
  height: { xs: '300px', sm: '350px', md: '450px' },
}}
```

---

## ⚙️ Dependencies
- `framer-motion`: ^12.26.1 (sudah terinstall)
- `@mui/material`: 5.5.3 (sudah terinstall)
- `react`: 18.2.0 (sudah terinstall)

---

## 🎬 Animasi Properties

### Spring Animation
```tsx
transition={{
  type: 'spring',
  stiffness: 300,  // Semakin tinggi = lebih stiff
  damping: 30,     // Semakin tinggi = lebih cepat stop
}}
```

Ubah nilai untuk animasi yang berbeda:
- **Stiffness 400 + Damping 40**: Animasi lebih responsif
- **Stiffness 200 + Damping 20**: Animasi lebih bouncy

---

## 📂 File Structure
```
components/
├── card.gallery.staggered.tsx    ⭐ Rekomendasi
├── card.gallery.rotate.tsx
├── card.gallery.tsx
pages/
├── card-gallery.tsx               (Demo page)
public/
└── images/
    └── Card/
        ├── front_card_1.png
        ├── front_card_2.png
        ├── front_card_3.png
        └── front_card_4.png
```

---

## 💡 Tips & Tricks

1. **Lazy Load Images**: Gunakan `next/image` untuk performa lebih baik
```tsx
import Image from 'next/image';

<Image 
  src={card} 
  alt="Card" 
  width={280} 
  height={360}
/>
```

2. **Add Click Handler**:
```tsx
onMouseEnter={() => handleCardClick(index)}
```

3. **Custom Easing**: 
```tsx
transition={{
  ease: [0.43, 0.13, 0.23, 0.96], // Cubic bezier
}}
```

---

## 🧪 Testing Demo
Buka: `http://localhost:3000/card-gallery`

---

**Created**: January 2026
**Framework**: Next.js 13 + React 18 + Framer Motion
