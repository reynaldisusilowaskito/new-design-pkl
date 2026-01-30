# Guide: Mencegah Perubahan Layout Saat Zoom In/Out

## 📋 Ringkasan Masalah

Website Anda mengalami perubahan bentuk komponen ketika pengguna melakukan zoom in/out karena:

1. **Tidak ada pembatasan zoom** di viewport meta tag
2. **Penggunaan pixel absolut (px)** alih-alih unit responsif
3. **Tidak ada CSS anti-zoom** yang comprehensive
4. **Browser default behavior** yang mengizinkan text scaling

## ✅ Solusi yang Sudah Diterapkan

### 1. **Update Viewport Meta Tag** (`_document.tsx`)
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
```

**Penjelasan:**
- `width=device-width` - Set width ke device width
- `initial-scale=1` - Initial zoom level 100%
- `maximum-scale=1` - Mencegah user zoom lebih dari 100%
- `user-scalable=no` - Disable user zoom (paling penting!)
- `viewport-fit=cover` - Untuk notch/safe area support

### 2. **CSS Anti-Zoom Protection** (`globals.css`)
```css
html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

html, body {
  touch-action: manipulation;
}

* {
  touch-action: manipulation;
}

input, select, textarea, button {
  font-size: 16px !important;
}
```

**Penjelasan:**
- `-webkit-text-size-adjust: 100%` - Cegah browser auto-zoom text (Safari/mobile)
- `touch-action: manipulation` - Cegah double-tap zoom delay
- `font-size: 16px` pada input - Cegah iOS auto-zoom saat focus input

## 🎯 Best Practices untuk Komponen Responsif

### ✅ GUNAKAN:
```tsx
// Relative units
sx={{
  fontSize: 16,        // MUI akan convert ke px dengan proper scaling
  padding: 2,          // MUI spacing (8px × 2 = 16px)
  width: '100%',       // Relative width
  maxWidth: '500px',   // Max width for constraint
}}

// Atau dalam CSS
.container {
  font-size: 1rem;     /* = 16px */
  padding: 2rem;       /* = 32px */
  width: 100%;
  max-width: 50rem;    /* = 800px */
}
```

### ❌ HINDARI:
```tsx
// Fixed pixel sizes
sx={{
  fontSize: 16,        // OK tapi less flexible
  width: 500,          // BURUK - fixed width
  padding: 20,         // Kurang flexible
  height: 200,         // Fixed height
}}

// Hardcoded pixel values
sx={{ 
  width: '500px',      // BURUK
  height: '200px',     // BURUK
}}
```

## 📊 Perubahan File yang Sudah Dilakukan

### 1. `/pages/_document.tsx`
- ✅ Added viewport meta tag dengan `user-scalable=no`

### 2. `/styles/globals.css`
- ✅ Added `-webkit-text-size-adjust: 100%`
- ✅ Added `touch-action: manipulation`
- ✅ Added font-size: 16px untuk input elements
- ✅ Added proper html font-size base (16px)

## 🔧 Rekomendasi Tambahan untuk Kualitas Lebih Baik

### 1. **Audit Hardcoded Sizes**
Cari file komponen dengan pixel values dan ganti dengan:
```bash
# Search untuk hardcoded px values dalam komponen
grep -r "sx={{" components/ | grep -E "(width|height).*px"
```

Contoh update:
```tsx
// SEBELUM
sx={{ width: '500px', height: '200px' }}

// SESUDAH
sx={{ width: '100%', maxWidth: 'sm', height: 'auto' }}
```

### 2. **Gunakan MUI Breakpoints** (Sudah ada!)
```tsx
sx={{
  fontSize: { xs: 14, sm: 16, md: 18 },  // Responsive font
  padding: { xs: 1, md: 2 },              // Responsive padding
  display: { xs: 'block', md: 'flex' },   // Responsive layout
}}
```

### 3. **Optimalkan Responsive Images**
```tsx
// BURUK - fixed size
<img src="photo.jpg" width="200" height="200" />

// BAGUS - responsive
<Box
  component="img"
  src="photo.jpg"
  sx={{
    width: '100%',
    height: 'auto',
    maxWidth: '200px',
  }}
/>
```

### 4. **CSS Media Queries untuk Fine-tuning**
```css
@media (max-width: 600px) {
  .mobile-header {
    font-size: 14px;
    padding: 8px;
  }
}
```

## 🧪 Testing Zoom Behavior

### Desktop (Chrome DevTools):
1. Buka DevTools (F12)
2. Ctrl+Plus (zoom in) / Ctrl+Minus (zoom out)
3. Pastikan layout tetap stabil dan tidak bergeser

### Mobile Testing:
```bash
# Test di browser mobile atau mobile emulator
# Coba pinch zoom atau browser zoom controls
```

### Script untuk verifikasi (Optional):
```javascript
// Paste di console untuk monitor zoom level
window.addEventListener('resize', () => {
  const zoomLevel = window.devicePixelRatio;
  console.log('Current zoom:', Math.round(zoomLevel * 100) + '%');
});
```

## 📝 Checklist Implementasi

- [x] Update viewport meta tag di `_document.tsx`
- [x] Add CSS anti-zoom rules di `globals.css`
- [ ] Audit komponen untuk hardcoded sizes (opsional tapi recommended)
- [ ] Test zoom in/out functionality di berbagai device
- [ ] Test di desktop dan mobile browser
- [ ] Verify accessibility masih berfungsi

## ⚠️ Catatan Penting

1. **Accessibility**: `user-scalable=no` dapat mengurangi accessibility untuk pengguna dengan visual impairment. Pertimbangkan untuk menggunakan:
   ```html
   <!-- Alternative yang lebih accessible -->
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1" />
   ```

2. **iOS Limitation**: iOS 10+ mengabaikan `user-scalable=no` untuk accessibility reasons. Gunakan CSS + meta tag bersamaan.

3. **Browser Consistency**: Behavior bisa berbeda di berbagai browser. Test di Chrome, Firefox, Safari, dan mobile browsers.

## 🔗 Resources

- [MDN Viewport Meta Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [MUI Responsive Design](https://mui.com/material-ui/guides/responsive-ui/)
- [CSS Touch Action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
- [WebKit Text Size Adjust](https://webkit.org/blog/56/webkits-text-size-adjustment-for-handhelds/)

## 📞 Support & Questions

Jika ada masalah setelah implementasi, cek:
1. Buka DevTools dan lihat Console untuk errors
2. Check Network tab untuk failed resources
3. Verify viewport meta tag di `_document.tsx`
4. Test di different browsers (Chrome, Firefox, Safari)
