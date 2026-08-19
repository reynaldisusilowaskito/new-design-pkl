'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const ExperienceContext = createContext(null)

const english = {
  'Mengenal Surabaya': 'Discover Surabaya',
  'Layanan Publik': 'Public Services',
  'Informasi Publik': 'Public Information',
  Transparansi: 'Transparency',
  'Sosial Media': 'Social Media',
  'Navigasi utama': 'Main navigation',
  'Pengaturan tampilan': 'Display settings',
  'Ganti bahasa': 'Change language',
  'Aktifkan mode gelap': 'Enable dark mode',
  'Aktifkan mode terang': 'Enable light mode',
  'Tutup menu': 'Close menu',
  'Buka menu': 'Open menu',
  'Surabaya, kembali ke beranda': 'Surabaya, back to home',
  'Identitas resmi Kota Surabaya': 'Official Surabaya identity',
  'Portal resmi Kota Surabaya': 'Official Surabaya city portal',
  'Pilih informasi atau layanan yang ingin dibuka.': 'Choose the information or service you want to open.',
  'TAUTAN TERSEDIA': 'AVAILABLE LINKS',
  Buka: 'Open',
  'KOTA YANG': 'A CITY THAT IS',
  BERGERAK: 'MOVING',
  BERTUMBUH: 'GROWING',
  TERHUBUNG: 'CONNECTED',
  MELAYANI: 'SERVING',
  'GOTONG ROYONG MENUJU KOTA DUNIA YANG MAJU,': 'WORKING TOGETHER TOWARDS AN ADVANCED, HUMANE,',
  'HUMANIS, DAN BERKELANJUTAN': 'AND SUSTAINABLE GLOBAL CITY',
  'PORTAL RESMI PEMERINTAH KOTA SURABAYA': 'OFFICIAL SURABAYA CITY GOVERNMENT PORTAL',
  'KOTA PAHLAWAN': 'CITY OF HEROES',
  'AKSES CEPAT WARGA': 'QUICK CITIZEN ACCESS',
  'Mulai dari sini.': 'Start here.',
  'Cari layanan Pemerintah Kota Surabaya': 'Search Surabaya City Government services',
  'Cari layanan warga...': 'Search citizen services...',
  'Masih mencari layanan atau informasi kota?': 'Still looking for city services or information?',
  'Kami bantu menghubungkan kebutuhanmu dengan kanal resmi Pemerintah Kota Surabaya.': 'We help connect your needs with official Surabaya City Government channels.',
  'Jelajahi layanan': 'Explore services',
  'Sampaikan pengaduan': 'Submit a complaint',
  'PORTAL RESMI KOTA': 'OFFICIAL CITY PORTAL',
  Jelajahi: 'Explore',
  'Tentang Surabaya': 'About Surabaya',
  'Layanan warga': 'Citizen services',
  'Kabar kota': 'City news',
  'Video kota': 'City videos',
  'Kalender Surabaya': 'Surabaya Calendar',
  'PEMERINTAH KOTA': 'CITY GOVERNMENT',
  'Kembali ke atas': 'Back to top',
  'Kembali ke bagian atas': 'Back to the top',
  'Pemerintah Kota Surabaya': 'Surabaya City Government',
  'Kembali ke beranda': 'Back to home',
  'Temukan arah,': 'Find your way,', 'rasakan kotanya.': 'feel the city.',
  'Destinasi, ruang kota, dan cita rasa khas Surabaya dalam satu panduan.': 'Destinations, urban spaces, and Surabaya’s signature flavors in one guide.',
  'Wisata Kuliner': 'Culinary Tourism', 'WISATA KULINER': 'CULINARY TOURISM',
  'Cari tempat atau kawasan...': 'Search places or areas...', 'Jelajahi Surabaya.': 'Explore Surabaya.', 'Cicipi Surabaya.': 'Taste Surabaya.',
  'Dari ikon sejarah hingga ruang publik baru yang hidup.': 'From historical icons to vibrant new public spaces.',
  'Dari resep legendaris hingga tempat makan favorit warga.': 'From legendary recipes to local favorite places to eat.',
  'Buka di peta': 'Open in maps', 'Tempat tidak ditemukan. Coba kata kunci lainnya.': 'No places found. Try another keyword.',
  'Wisata, kuliner, dan hotel terdekat di Surabaya.': 'Nearby attractions, culinary spots, and hotels in Surabaya.',
  'Lokasimu ditemukan.': 'Your location was found.', 'Temukan yang terdekat.': 'Find what is nearby.',
  'Daftar otomatis diurutkan berdasarkan jarak dari lokasimu.': 'The list is automatically sorted by distance from your location.',
  'Izinkan lokasi untuk melihat jarak destinasi, kuliner, dan hotel terdekat.': 'Allow location access to see distances to nearby attractions, culinary spots, and hotels.',
  'Mendeteksi lokasi…': 'Detecting location…', 'Perbarui lokasi': 'Update location', 'Gunakan lokasi saya': 'Use my location',
  'Lokasi tidak tersedia. Periksa izin lokasi browser.': 'Location is unavailable. Check your browser location permission.',
  'Izin lokasi diblokir.': 'Location permission is blocked.',
  'Izinkan lokasi melalui ikon di samping alamat browser, lalu muat ulang halaman.': 'Allow location using the icon beside the browser address, then reload the page.',
  'Coba minta izin lagi': 'Request permission again',
  'Permintaan lokasi habis waktu. Pastikan GPS perangkat aktif lalu coba lagi.': 'The location request timed out. Make sure your device GPS is enabled, then try again.',
  'Lokasi tidak tersedia. Aktifkan layanan lokasi perangkat dan periksa izin browser.': 'Location is unavailable. Enable your device location services and check browser permission.',
  'Browser tidak dapat menampilkan permintaan izin selama status lokasi masih diblokir.': 'The browser cannot show a permission prompt while location access remains blocked.',
  'Hotel Terdekat': 'Nearby Hotels', 'HOTEL TERDEKAT': 'NEARBY HOTELS', 'Bintang hotel': 'Hotel rating', 'Jarak maksimum': 'Maximum distance',
  'Jarak hotel': 'Hotel distance', 'Semua bintang': 'All ratings', 'Semua jarak': 'All distances',
  'Harga tidak tersedia di API resmi. Hubungi hotel untuk tarif terkini.': 'Prices are unavailable in the official API. Contact the hotel for current rates.',
  'Menginap di Surabaya.': 'Stay in Surabaya.', 'Urutkan hotel berdasarkan bintang dan jarak aktual dari lokasimu.': 'Sort hotels by star rating and actual distance from your location.',
  'Pilihan ringkas, hanya berada di wilayah Surabaya.': 'Concise choices located only within Surabaya.', 'Cek hotel': 'View hotel', 'Hubungi hotel': 'Contact hotel',
  'Tempat tidak ditemukan. Coba ubah filter atau kata kunci.': 'No places found. Try changing the filters or search term.',
  'Kembali ke daftar hotel': 'Back to hotel list', 'TENTANG HOTEL': 'ABOUT THE HOTEL',
  'Informasi tempat menginap.': 'Accommodation information.', 'Deskripsi hotel belum tersedia.': 'Hotel description is not available yet.',
  'Kembali ke daftar kuliner': 'Back to culinary list', 'TENTANG KULINER': 'ABOUT THE CULINARY SPOT',
  'Informasi kuliner.': 'Culinary information.', 'Deskripsi kuliner belum tersedia.': 'Culinary description is not available yet.',
  'Kembali ke daftar destinasi': 'Back to destination list', 'TENTANG DESTINASI': 'ABOUT THE DESTINATION',
  'Informasi destinasi.': 'Destination information.', 'Deskripsi destinasi belum tersedia.': 'Destination description is not available yet.',
  'LOKASI KULINER': 'CULINARY LOCATION', 'LOKASI DESTINASI': 'DESTINATION LOCATION',
  'Belum tersedia': 'Not available', 'Alamat': 'Address', 'Telepon': 'Phone', 'Kunjungi website': 'Visit website',
  'GALERI HOTEL': 'HOTEL GALLERY', 'Lihat suasananya.': 'See the atmosphere.',
  'LOKASI HOTEL': 'HOTEL LOCATION', 'Temukan lokasinya.': 'Find its location.', 'Lokasi': 'Location', 'Hotel': 'Hotel',
  'RASA KHAS SURABAYA': 'SURABAYA SIGNATURE FLAVORS',
  'Destinasi': 'Destinations', 'Temukan Surabaya,': 'Discover Surabaya,', 'satu pengalaman sekaligus.': 'one experience at a time.',
  'Surabaya,': 'Surabaya,', 'satu pengalaman': 'one experience', 'sekaligus.': 'at a time.',
  'Pilihan destinasi, kuliner, dan hotel untuk memulai perjalananmu.': 'Selected destinations, culinary spots, and hotels to begin your journey.',
  'Mulai jelajahi': 'Start exploring', 'Lihat pilihan': 'View selections', 'Explore more': 'Explore more',
  'Kembali ke wisata': 'Back to tourism', 'Temukan tempat,': 'Find a place,', 'untuk beristirahat.': 'to rest.',
  'Pilihan hotel untuk singgah dan melanjutkan perjalananmu di Surabaya.': 'Selected hotels where you can rest before continuing your Surabaya journey.',
  'MENJELAJAHI CERITA, RASA, DAN RUANG DI SURABAYA.': 'EXPLORE SURABAYA THROUGH ITS STORIES, FLAVORS, AND PLACES.',
  'Pilih jalurmu.': 'Choose your path.', 'Rekomendasi pilihan untuk menikmati Surabaya sesuai caramu.': 'Curated recommendations for experiencing Surabaya your way.',
  'Kategori wisata': 'Tourism categories', 'Seni & Budaya': 'Arts & Culture', 'Kuliner': 'Culinary', 'Menginap': 'Stay',
  'Kategori': 'Category', 'Navigasi Surabaya': 'Surabaya navigation',
  'Navigasi halaman': 'Page navigation', 'Sebelumnya': 'Previous', 'Selanjutnya': 'Next',
  'HALAMAN': 'PAGE', 'Halaman': 'Page',
  'Lihat detail': 'View details', 'Lihat semua': 'View all',
  'Kota Lama': 'Old Town', 'KOTA LAMA': 'OLD TOWN', 'Sport': 'Sports', 'SPORT': 'SPORTS',
  'Landmark': 'Landmark', 'LANDMARK': 'LANDMARK', 'Sightseeing': 'Sightseeing', 'SIGHTSEEING': 'SIGHTSEEING',
  'Religious': 'Religious Tourism', 'RELIGIOUS': 'RELIGIOUS TOURISM',
  'Pemerintahan': 'Government', 'Visi & Misi': 'Vision & Mission',
  'Struktur Organisasi Pemerintah Kota Surabaya': 'Surabaya City Government Organization Structure',
  'Perangkat Daerah': 'Regional Departments', 'Profil Walikota Surabaya': 'Surabaya Mayor Profile',
  'Alamat Pemerintah Kota Surabaya': 'Surabaya City Government Address', 'Ada Apa di Surabaya ?': 'What’s in Surabaya?',
  'Akomodasi': 'Accommodation', 'Wisata': 'Tourism', 'Pengaduan Masyarakat': 'Public Complaints',
  'Perizinan': 'Licensing', 'Kesehatan': 'Health', 'Lawan Covid': 'Fight COVID',
  'Wadul Sertifikat Vaksin': 'Vaccine Certificate Support', 'Profil Sekolah': 'School Profiles',
  'Rapor Online': 'Online Report Cards', 'Sistem Informasi Aplikasi Guru': 'Teacher Application Information System',
  'Sosial Masyarakat': 'Social Services', 'Kependudukan': 'Population Services',
  'Foto': 'Photos', 'Infografis': 'Infographics', 'Berita Terbaru': 'Latest News', 'Siaran Pers': 'Press Releases',
  'Transparansi Anggaran': 'Budget Transparency', 'Kinerja Pemerintah': 'Government Performance',
  'Pengadaan Barang dan Jasa': 'Goods and Services Procurement', 'Laporan Keuangan': 'Financial Reports',
  'Satu Data Surabaya': 'One Data Surabaya',
  'Pejabat Pengelola Informasi dan Dokumentasi': 'Information and Documentation Management Officer',
  'Surabaya': 'Surabaya', 'Berita': 'News', 'Informasi resmi': 'Official information',
  'Kabar kota,': 'City news,', 'langsung dari sumbernya.': 'directly from the source.',
  'Kebijakan, pembangunan, pelayanan publik, dan aktivitas warga dalam satu ruang yang mudah dijelajahi.': 'Policies, development, public services, and community activities in one easy-to-explore place.',
  'Cari berita...': 'Search news...', 'Filter kategori berita': 'Filter news categories',
  'Baca berita': 'Read article', 'Berita tidak ditemukan': 'No news found',
  'Coba gunakan kata kunci atau kategori lain.': 'Try another keyword or category.',
  'Agenda kota,': 'City events,', 'jelas dalam satu tempat.': 'clearly organized in one place.',
  'Pengumuman, kegiatan pemerintah, dan informasi penting warga yang tersusun agar mudah ditemukan.': 'Announcements, government activities, and important citizen information organized for easy access.',
  'Cari agenda...': 'Search events...', 'Semua agenda': 'All events', 'Lihat semua agenda': 'View all events',
  'Agenda tidak ditemukan': 'No events found', 'Buka kalender lengkap': 'Open full calendar',
  'Informasi resmi Pemerintah Kota Surabaya.': 'Official information from the Surabaya City Government.',
  'Lihat lebih banyak': 'See more', 'Pilih pengalamanmu.': 'Choose your experience.',
  'Satu kota dengan banyak cerita untuk dijelajahi.': 'One city with many stories to explore.', 'Mulai menjelajah': 'Start exploring',
  'Makan enak,': 'Eat well,', 'kenali kotanya.': 'know the city.',
  'Jelajahi makanan khas dan tempat makan pilihan di Surabaya.': 'Explore Surabaya specialties and selected local places to eat.',
  'Lihat pilihan hari ini': "See today's pick", 'FILTER BAHAN UTAMA': 'FILTER BY MAIN INGREDIENT',
  'Pilih sesuai selera.': 'Choose what suits your taste.', 'SOROTAN KULINER': 'CULINARY HIGHLIGHT',
  'MAKANAN KHAS': 'SIGNATURE DISHES', 'Ikon rasa Surabaya.': 'Surabaya flavor icons.',
  'TEMPAT MAKAN': 'PLACES TO EAT', 'Restoran & kuliner pilihan.': 'Selected restaurants & culinary spots.',
  'Diurutkan berdasarkan jarak jika lokasimu diaktifkan.': 'Sorted by distance when your location is enabled.',
  'Administrasi Kependudukan': 'Population Administration',
  'Urus dokumen dan informasi administrasi kependudukan.': 'Manage population documents and administrative information.',
  'Urus dokumen kependudukan melalui KLAMPID New Generation.': 'Manage population documents through KLAMPID New Generation.',
  'Informasi layanan sosial dan program kesejahteraan masyarakat.': 'Social services and community welfare program information.',
  'Pusat informasi dan layanan pendidikan Kota Surabaya.': 'Surabaya education information and service center.',
  'Dapatkan informasi mengenai pengelolaan fasilitas, jaringan, dan utilitas kota untuk ruang publik Surabaya yang lebih tertata.': 'Find information on the management of city facilities, networks, and utilities for better-organized public spaces in Surabaya.',
  'Pengumuman Hasil Seleksi Administrasi Anggota Komisaris dan Anggota Direksi PT Yekape Surabaya Perseroda': 'Announcement of Administrative Selection Results for Members of the Board of Commissioners and Directors of PT Yekape Surabaya Perseroda',
  'PENGUMUMAN HASIL SELEKSI ADMINISTRASI ANGGOTA KOMISARIS DAN ANGGOTA DIREKSI PT YEKAPE SURABAYA PERSERODA': 'ANNOUNCEMENT OF ADMINISTRATIVE SELECTION RESULTS FOR MEMBERS OF THE BOARD OF COMMISSIONERS AND DIRECTORS OF PT YEKAPE SURABAYA PERSERODA',
  'Pengumuman Perpanjangan Seleksi Direksi dan Komisaris BUMD PT. RPH Perseroda': 'Announcement of the Extended Selection for Directors and Commissioners of PT RPH Perseroda',
  'Pengumuman Perpanjangan Seleksi Direksi dan Komisaris BUMD PT. BPR SAU': 'Announcement of the Extended Selection for Directors and Commissioners of PT BPR SAU',
  'Pengumuman Hasil Seleksi Anggota Direksi Perumda Air Minum Surya Sembada': 'Announcement of Selection Results for Directors of Perumda Air Minum Surya Sembada',
  'PEMERINTAH KOTA SURABAYA': 'SURABAYA CITY GOVERNMENT',
  'Mengenal Surabaya': 'Discover Surabaya',
  'Tentang kota': 'About the city',
  'Kota Pahlawan,': 'City of Heroes,',
  'gerbang Jawa Timur.': 'the gateway to East Java.',
  'Surabaya adalah ibu kota Provinsi Jawa Timur sekaligus pusat pemerintahan dan perekonomian provinsi. Tumbuh sebagai kota pelabuhan, Surabaya membawa semangat kepahlawanan ke dalam gerak kota yang maju, humanis, dan berkelanjutan.': 'Surabaya is the capital of East Java and the province’s center of government and economy. Growing as a port city, Surabaya carries its heroic spirit into a progressive, humane, and sustainable future.',
  'Baca profil resmi': 'Read the official profile',
  'Surabaya dalam angka': 'Surabaya in numbers',
  'Data administratif kota': 'City administrative data',
  'Kecamatan': 'Districts', 'Kelurahan': 'Subdistricts', 'Luas wilayah': 'Total area',
  'Sumber: Pemerintah Kota Surabaya': 'Source: Surabaya City Government',
  'Administrasi kependudukan': 'Population administration', 'Cek Status Penonaktifan NIK': 'Check NIK Deactivation Status',
  'Periksa status NIK dan lakukan konfirmasi data domisili secara daring melalui layanan resmi Pemerintah Kota Surabaya.': 'Check your NIK status and confirm domicile data online through the official Surabaya City Government service.',
  'Buka layanan NIK': 'Open NIK service', 'Kota ramah anak dunia': 'A global child-friendly city',
  'Kenali program, kebijakan, dan kabar Surabaya sebagai kota pertama di Indonesia yang terakreditasi UNICEF sebagai Kota Ramah Anak.': 'Discover Surabaya’s programs, policies, and news as Indonesia’s first UNICEF-accredited Child-Friendly City.',
  'Jelajahi CFCI Surabaya': 'Explore CFCI Surabaya', 'Mobilitas kota': 'City mobility', 'Transportasi': 'Transportation',
  'Temukan informasi mobilitas Surabaya, termasuk Suroboyo Bus, feeder WiraWiri, dan perkembangan sistem transportasi kota.': 'Find Surabaya mobility information, including Suroboyo Bus, WiraWiri feeders, and city transportation developments.',
  'Lihat informasi transportasi': 'View transportation information', 'Ekonomi kota': 'City economy', 'Bisnis dan Investasi': 'Business and Investment',
  'Akses gambaran ekonomi, perdagangan, dan peluang investasi di Surabaya sebagai pusat bisnis dan jasa di Indonesia timur.': 'Explore the economy, trade, and investment opportunities in Surabaya as Eastern Indonesia’s business and services hub.',
  'Jelajahi potensi ekonomi': 'Explore economic potential', 'Jelajahi kota': 'Explore the city', 'Wisata Surabaya': 'Explore Surabaya',
  'Pesan tiket destinasi resmi dan temukan pengalaman wisata di Kota Pahlawan dengan proses yang mudah dan transparan.': 'Book official destination tickets and discover tourism experiences in the City of Heroes with an easy, transparent process.',
  'Buka tiket wisata': 'Open tourism tickets', 'Infrastruktur kota': 'City infrastructure', 'Utilitas': 'Utilities',
  'Lihat informasi utilitas': 'View utility information',
  'Peta kota': 'City map', '31 kecamatan dapat dipilih': '31 selectable districts', 'Peta Interaktif,': 'Interactive Map,', 'jelajahi Surabaya.': 'explore Surabaya.',
  'Menyiapkan peta Surabaya…': 'Preparing the Surabaya map…', 'PILIH WILAYAH': 'SELECT AN AREA', 'Geser · zoom · klik': 'Drag · zoom · click',
  'Kecamatan terpilih': 'Selected district', 'Data berubah saat wilayah dipilih': 'Data updates when an area is selected',
  'Kepadatan penduduk': 'Population density', 'Rasio gender': 'Gender ratio', 'Usia produktif': 'Working-age population', 'Pertumbuhan': 'Growth',
  'Data demografi Surabaya': 'Surabaya demographic data', 'Disiapkan melalui Server Component': 'Prepared through a Server Component',
  'Kabar kota': 'City news', 'Sumber resmi Pemerintah Kota Surabaya': 'Official Surabaya City Government source',
  'Informasi aktual dan terverifikasi': 'Current and verified information', 'dari setiap sudut Kota Surabaya.': 'from every corner of Surabaya.',
  'Surabaya Hari Ini': 'Surabaya Today', 'KABAR KOTA': 'CITY NEWS', 'SCROLL UNTUK MEMBACA': 'SCROLL TO READ',
  'BERITA TERBARU': 'LATEST NEWS', 'INFORMASI TERVERIFIKASI': 'VERIFIED INFORMATION', 'SURABAYA HARI INI': 'SURABAYA TODAY',
  'Berita terbaru': 'Latest news', 'Yang terjadi': 'What is happening', 'di Surabaya.': 'in Surabaya.',
  'Informasi aktual tentang kebijakan, pembangunan, pelayanan publik, dan kehidupan warga.': 'Current information on policy, development, public services, and city life.',
  'Lihat seluruh berita': 'View all news', 'Semua': 'All', 'Baca selengkapnya': 'Read more', 'SUMBER TERVERIFIKASI': 'VERIFIED SOURCE',
  'Pelayanan Pemerintah': 'Government Services', 'Kota Surabaya': 'Surabaya City', 'PELAYANAN PUBLIK': 'PUBLIC SERVICES',
  'Cari layanan pemerintah': 'Search government services', 'Cari layanan...': 'Search services...', 'Layanan untuk warga': 'Services for residents',
  'layanan ditemukan': 'services found', 'Layanan belum ditemukan.': 'No services found.', 'Coba kata kunci atau kategori lainnya.': 'Try another keyword or category.',
  'Jelajahi berdasarkan kebutuhan': 'Browse by need', 'Warga': 'Residents', 'Informasi': 'Information', 'Usaha': 'Business', 'Pendidikan': 'Education',
  'Akses cepat': 'Quick access', 'Layanan yang paling sering dibutuhkan warga.': 'Services most frequently needed by residents.', 'Lihat semua layanan': 'View all services',
  'Video': 'Featured', 'Pilihan': 'Videos', 'tayangan terbaru dari kanal resmi kota': 'latest videos from the official city channel',
  'Lihat semua': 'View all', 'SIAP DITONTON': 'READY TO WATCH', 'PILIH VIDEO': 'SELECT VIDEO', 'Video Kota': 'City Videos',
  'Video berikutnya': 'Next video', 'Ringkasan': 'Overview', 'Informasi': 'Information', 'Bagikan': 'Share',
  'Video informasi resmi mengenai program, pelayanan, dan perkembangan terbaru Kota Surabaya.': 'Official information videos about Surabaya’s latest programs, services, and developments.',
  'Kanal resmi': 'Official channel', 'Buka kanal': 'Open channel', 'Kegiatan, program, dan cerita terbaru dari Kota Surabaya.': 'The latest activities, programs, and stories from Surabaya.',
  'Video lainnya': 'More videos', 'pilihan': 'options',
  'Kalender Surabaya': 'Surabaya Calendar', 'Temukan informasinya': 'Discover what’s on', 'KOTA INI': 'THIS CITY', 'SELALU PUNYA': 'ALWAYS HAS', 'CERITA.': 'A STORY.',
  'Agenda, pengumuman resmi, ruang kreatif, dan kegiatan warga dalam satu kalender kota.': 'Events, official announcements, creative spaces, and community activities in one city calendar.',
  'Lihat agenda': 'View events', 'Terbaru': 'Latest', 'Informasi berikutnya': 'Coming up', 'APA YANG TERJADI': 'WHAT IS HAPPENING', 'DI SURABAYA?': 'IN SURABAYA?',
  'Temukan informasi kota yang penting untuk aktivitasmu.': 'Find city information that matters for your activities.', 'Agenda pilihan': 'Featured event',
  'SUMBER RESMI': 'OFFICIAL SOURCE', 'Informasi ditampilkan dari API Pemerintah Kota Surabaya dan dapat diperbarui tanpa mengubah desain section.': 'Information is provided by the Surabaya City Government API and updates automatically.',
}

const dynamicPhrases = [
  ['Pemerintah Kota Surabaya', 'Surabaya City Government'], ['Pemkot Surabaya', 'Surabaya City Government'],
  ['Pengumuman', 'Announcement'], ['Hasil Seleksi', 'Selection Results'], ['Administrasi', 'Administration'],
  ['Anggota Direksi', 'Board of Directors Member'], ['Anggota Komisaris', 'Board of Commissioners Member'],
  ['Pelayanan Informasi', 'Information Services'], ['Pelayanan Dinas Sosial', 'Social Services'],
  ['Pelayanan DISPENDIK', 'Education Department Services'], ['Administrasi Kependudukan', 'Population Administration'],
  ['Pengaduan Masyarakat', 'Public Complaints'], ['Pemberdayaan Ekonomi', 'Economic Empowerment'],
  ['Ketenagakerjaan', 'Employment'], ['Informasi lowongan, pelatihan, dan pelayanan tenaga kerja.', 'Job vacancies, training, and employment services.'],
  ['Urus dokumen dan informasi administrasi kependudukan.', 'Manage population documents and administration information.'],
  ['Pelatihan komputer dan literasi digital gratis untuk warga.', 'Free computer and digital literacy training for residents.'],
  ['Daftar antrean Puskesmas dan rumah sakit secara daring.', 'Book community health center and hospital queues online.'],
  ['Dokumentasi dan informasi hukum', 'Legal documentation and information'], ['Akses informasi rencana pengadaan pemerintah secara terbuka.', 'Access government procurement plans openly.'],
  ['Layanan pengadaan barang dan jasa pemerintah secara elektronik.', 'Electronic government procurement services.'],
  ['Sampaikan pengaduan, aspirasi, dan masukan melalui WargaKu.', 'Submit complaints, aspirations, and feedback through WargaKu.'],
  ['Temukan program pengembangan usaha dan ekonomi warga.', 'Discover business and community economic development programs.'],
  ['Ajukan dan pantau pelayanan perizinan secara terpadu.', 'Apply for and track integrated licensing services.'],
  ['Jelajahi data terbuka dan statistik resmi Kota Surabaya.', 'Explore Surabaya open data and official statistics.'],
  ['Kota Surabaya', 'Surabaya City'], ['Surabaya', 'Surabaya'], ['Berita', 'News'], ['Agenda Kota', 'City Events'],
  ['Informasi terbaru', 'Latest information'], ['Agenda berikutnya', 'Upcoming event'],
  ['Program KRISNA Surabaya Fasilitasi Pendidikan Kesetaraan di 9 Lokasi', 'Surabaya KRISNA Program Supports Equivalency Education at 9 Locations'],
  ['Pemkot Surabaya Sambut Dewan Pengawas KPK, Wali Kota Eri Cahyadi Bahas Optimalisasi Aset Hibah Barang Rampasan', 'Surabaya City Government Welcomes KPK Supervisory Board as Mayor Eri Cahyadi Discusses Optimization of Confiscated Grant Assets'],
  ['HUT ke-81 RI, Naik Transportasi Publik di Surabaya Cuma Rp81 Mulai 11 Agustus', '81st Indonesian Independence Day: Ride Public Transportation in Surabaya for Only Rp81 Starting August 11'],
  ['Wali Kota Eri Ajak Mahasiswa Baru ITS Jadi Generasi Kritis di Tengah Euforia AI', 'Mayor Eri Encourages New ITS Students to Become a Critical Generation Amid the AI Euphoria'],
  ['Pemkot Surabaya Integrasikan MICE dan Pariwisata untuk Perpanjang Lama Tinggal Peserta', 'Surabaya Integrates MICE and Tourism to Extend Participants’ Length of Stay'],
  ['Bimbingan Teknis Pengelolaan Pengaduan Masyarakat Tahun 2026', 'Technical Guidance on Public Complaint Management 2026'],
  ['Kelas Inspirasi', 'Inspiration Class'], ['Acara Puncak Hari Anak Nasional Tingkat Kota Surabaya Tahun 2026', 'Surabaya National Children’s Day Main Event 2026'],
  ['Pengumuman', 'Announcement'], ['Hasil Seleksi', 'Selection Results'], ['Administrasi', 'Administration'],
  ['Direksi', 'Directors'], ['Komisaris', 'Commissioners'], ['Perpanjangan', 'Extension'],
  ['Berbatasan dengan Selat Madura di utara dan timur', 'Borders the Madura Strait to the north and east'],
  ['Kabupaten Sidoarjo di selatan', 'Sidoarjo Regency to the south'], ['Kabupaten Gresik di barat', 'Gresik Regency to the west'],
  ['Anggota Dewan Pengawas dan Anggota Direksi', 'Members of the Supervisory Board and Board of Directors'],
  ['Anggota Komisaris dan Anggota Direksi', 'Members of the Board of Commissioners and Board of Directors'],
  ['Perseroan Terbatas', 'Limited Liability Company'], ['Perusahaan Umum Daerah', 'Regional Public Company'],
  ['Anggota', 'Members'], ['Dewan Pengawas', 'Supervisory Board'],
]

const translateToEnglish = (text) => {
  if (typeof text !== 'string') return text
  if (english[text]) return english[text]
  let translatedText = text
  if (/^pengumuman\s+hasil\s+seleksi\s+administrasi/i.test(translatedText.trim())) {
    translatedText = translatedText
      .replace(/pengumuman\s+hasil\s+seleksi\s+administrasi/gi, 'Announcement of Administrative Selection Results for')
      .replace(/anggota\s+dewan\s+pengawas\s+dan\s+anggota\s+direksi/gi, 'Members of the Supervisory Board and Board of Directors')
      .replace(/anggota\s+komisaris\s+dan\s+anggota\s+direksi/gi, 'Members of the Board of Commissioners and Board of Directors')
      .replace(/anggota\s+direksi\s+dan\s+anggota\s+komisaris/gi, 'Members of the Board of Directors and Board of Commissioners')
      .replace(/anggota\s+direksi/gi, 'Members of the Board of Directors')
      .replace(/perseroan\s+terbatas/gi, 'Limited Liability Company')
      .replace(/perusahaan\s+umum\s+daerah/gi, 'Regional Public Company')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return [...dynamicPhrases]
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((result, [source, target]) => result.replaceAll(source, target), translatedText)
}

export function ExperienceProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [language, setLanguageState] = useState('id')
  const [preferencesReady, setPreferencesReady] = useState(false)
  const translatedNodes = useRef(new Map())

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme = window.localStorage.getItem('surabaya-theme')
      const preferredTheme = storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const storedLanguage = window.localStorage.getItem('surabaya-language') === 'en' ? 'en' : 'id'
      setTheme(preferredTheme)
      setLanguageState(storedLanguage)
      setPreferencesReady(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!preferencesReady) return
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('surabaya-theme', theme)
  }, [preferencesReady, theme])

  useEffect(() => {
    if (!preferencesReady) return
    document.documentElement.lang = language
    window.localStorage.setItem('surabaya-language', language)
  }, [language, preferencesReady])

  useEffect(() => {
    if (!preferencesReady) return undefined
    translatedNodes.current = new Map()
    const originals = translatedNodes.current
    const translateTree = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const parent = node.parentElement
        if (parent && !parent.closest('[data-no-auto-translate]') && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
          if (!originals.has(node)) originals.set(node, node.nodeValue)
          const original = originals.get(node) || ''
          const trimmed = original.trim()
          if (trimmed) {
            const translated = original.replace(trimmed, translateToEnglish(trimmed))
            if (node.nodeValue !== translated) node.nodeValue = translated
          }
        }
        node = walker.nextNode()
      }
      root.querySelectorAll?.('input[placeholder]').forEach((input) => {
        if (!input.dataset.originalPlaceholder) input.dataset.originalPlaceholder = input.placeholder
        input.placeholder = english[input.dataset.originalPlaceholder] || input.dataset.originalPlaceholder
      })
    }
    if (language === 'id') {
      document.querySelectorAll('input[data-original-placeholder]').forEach((input) => { input.placeholder = input.dataset.originalPlaceholder })
      return undefined
    }
    translateTree(document.body)
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') translateTree(mutation.target.parentElement || document.body)
      mutation.addedNodes.forEach((node) => node.nodeType === Node.ELEMENT_NODE && translateTree(node))
    }))
    observer.observe(document.body, { childList:true, characterData:true, subtree:true })
    return () => observer.disconnect()
  }, [language, preferencesReady])

  const setLanguage = useCallback((value) => setLanguageState(value === 'en' ? 'en' : 'id'), [])
  const toggleTheme = useCallback(() => setTheme((current) => current === 'light' ? 'dark' : 'light'), [])
  const t = useCallback((text) => language === 'en' ? translateToEnglish(text) : text, [language])
  const value = useMemo(() => ({ language, setLanguage, theme, toggleTheme, t }), [language, setLanguage, theme, toggleTheme, t])

  return (
    <ExperienceContext.Provider value={value}>
      <div key={language} style={{ display: 'contents' }}>{children}</div>
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const context = useContext(ExperienceContext)
  if (!context) throw new Error('useExperience must be used inside ExperienceProvider')
  return context
}
