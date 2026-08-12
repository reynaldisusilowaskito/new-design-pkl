import 'server-only'
import fallbackMenu from '@/data/menu.fallback.json'

export type NavigationItem = {
  title: string
  url?: string
  icon?: string | null
  order?: number
  child?: NavigationItem[]
}

export type Organization = {
  menu: NavigationItem[]
  address?: string | null
  phone_number?: string | null
  whatsapp?: string | null
  instagram?: string | null
  youtube?: string | null
  twitter?: string | null
  facebook?: string | null
  tiktok?: string | null
}

type RawMenu = {
  value?: string
  linkUrl?: string
  logoUrl?: string | null
  order?: number
  subMenus?: RawMenu[]
}

type RawOrganization = {
  menus?: RawMenu[]
  address?: string
  phoneNumber?: string
  whatsapp?: string
  instagram?: string
  youtube?: string
  twitter?: string
  facebook?: string
  tiktok?: string
}

type RawPost = {
  id?: number | string
  title?: string
  slug?: string
  featureImageUrl?: string
  publishDate?: { Valid?: boolean; Time?: string } | string
  category?: string | { name?: string; value?: string }
  Categories?: Array<{ name?: string; value?: string; title?: string }>
  description?: string
  excerpt?: string
}

export type NewsItem = {
  id: string
  title: string
  slug: string
  image: string
  publishedAt: string
  category: string
  excerpt: string
  url: string
}

type RawService = {
  id?: number | string
  title?: string
  description?: string
  url?: string
  imageUrl?: string
}

export type ServiceItem = {
  id: string
  title: string
  description: string
  url: string
  image: string
  category: 'Warga' | 'Informasi' | 'Usaha' | 'Pendidikan'
  iconCode: string
  popular: boolean
}

export type CityAgendaItem = {
  id: string
  title: string
  publishedAt: string
  image: string
  url: string
  category: string
  location: string
  status: string
}

const fallbackNavigation = fallbackMenu as NavigationItem[]
const apiBase = process.env.BASE_API_URL?.replace(/\/$/, '')
const slug = process.env.SURABAYA_SLUG
const webdisplayBase = process.env.API_URL_WEBDISPLAY?.replace(/\/$/, '')

const apiFetch = async <T>(path: string, revalidate = 300): Promise<T | null> => {
  if (!apiBase) return null
  try {
    const response = await fetch(`${apiBase}/${path.replace(/^\//, '')}`, {
      next: { revalidate },
      headers: {
        'Content-Type': 'application/json',
        Signature: process.env.SIGNATURE || 'no-signature',
      },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null
    return response.json() as Promise<T>
  } catch {
    return null
  }
}

const tourismUrl = (title?: string, url?: string) => /^wisata$/i.test(title?.trim() || '') ? '/wisata' : url
const transformMenu = (item: RawMenu): NavigationItem => ({
  title: item.value || 'Menu',
  url: tourismUrl(item.value, item.linkUrl),
  icon: item.logoUrl,
  order: item.order,
  child: Array.isArray(item.subMenus) ? item.subMenus.map(transformMenu) : [],
})

const completeNavigation = (items: NavigationItem[]) => {
  const key = (title: string) => title.toLocaleLowerCase('id-ID').replace(/[^a-z0-9]/g, '')
  const normalized = new Set(items.map((item) => key(item.title)))
  return [...items, ...fallbackNavigation.filter((item) => !normalized.has(key(item.title)))]
}

const webdisplayFetch = async <T>(path: string, revalidate = 300): Promise<T | null> => {
  if (!webdisplayBase) return null
  try {
    const response = await fetch(`${webdisplayBase}/${path.replace(/^\//, '')}`, {
      next: { revalidate }, signal: AbortSignal.timeout(5000),
    })
    return response.ok ? response.json() as Promise<T> : null
  } catch { return null }
}

export const getOrganization = async (): Promise<Organization> => {
  const response = slug ? await apiFetch<{ data?: RawOrganization }>(`public/${slug}`) : null
  const data = response?.data
  return {
    menu: Array.isArray(data?.menus) && data.menus.length ? completeNavigation(data.menus.map(transformMenu)) : fallbackNavigation,
    address: data?.address ?? null,
    phone_number: data?.phoneNumber ?? null,
    whatsapp: data?.whatsapp ?? null,
    instagram: data?.instagram ?? null,
    youtube: data?.youtube ?? null,
    twitter: data?.twitter ?? null,
    facebook: data?.facebook ?? null,
    tiktok: data?.tiktok ?? null,
  }
}

const normalizePost = (post: RawPost): NewsItem => {
  const category = typeof post.category === 'string'
    ? post.category
    : post.category?.name || post.category?.value
      || post.Categories?.[0]?.name || post.Categories?.[0]?.value || post.Categories?.[0]?.title
      || 'Berita'
  const rawDate = typeof post.publishDate === 'string'
    ? post.publishDate
    : post.publishDate?.Valid ? post.publishDate.Time : ''
  const id = String(post.id || post.slug || '')
  const slug = post.slug || id

  return {
    id,
    title: post.title || 'Kabar terbaru Kota Surabaya',
    slug,
    image: post.featureImageUrl
      ? post.featureImageUrl.startsWith('http') || post.featureImageUrl.startsWith('/images/')
        ? post.featureImageUrl
        : post.featureImageUrl.includes('pictures/')
          ? `https://surabaya.go.id/uploads/${post.featureImageUrl.replace(/^\/uploads\//, '')}`
          : `https://surabaya.go.id/uploads/images/posts/post_${id}/${post.featureImageUrl}`
      : '',
    publishedAt: rawDate || '',
    category,
    excerpt: post.excerpt || post.description || '',
    url: `https://www.surabaya.go.id/id/berita/${id}/${slug}`,
  }
}

const fallbackAgenda: CityAgendaItem[] = [
  { id: '25474', title: 'Pengumuman Perpanjangan Seleksi Direksi dan Komisaris BUMD PT. RPH Perseroda', publishedAt: '2026-08-03T14:01:51Z', image: 'https://surabaya.go.id/uploads/images/posts/post_25474/blob_1331_0.jpg', url: 'https://surabaya.go.id/id/agenda/25474/pengumuman-perpanjangan-seleksi-direksi-dan-komisaris-bumd-pt-rph-perseroda', category: 'Pengumuman Kota', location: 'Kota Surabaya', status: 'Informasi terbaru' },
  { id: '25470', title: 'Pengumuman Hasil Seleksi Anggota Direksi Perumda Air Minum Surya Sembada', publishedAt: '2026-08-03T13:53:18Z', image: 'https://surabaya.go.id/uploads/images/posts/post_25470/blob_1855_0.jpg', url: 'https://surabaya.go.id/id/agenda/25470/pengumuman-hasil-seleksi-anggota-direksi-perusahaan-umum-daerah-air-minum-surya-sembada-kota-surabaya', category: 'Agenda Kota', location: 'Kota Surabaya', status: 'Informasi terbaru' },
  { id: '25469', title: 'Pengumuman Perpanjangan Seleksi Direksi dan Komisaris BUMD PT. BPR SAU', publishedAt: '2026-08-03T12:41:39Z', image: 'https://surabaya.go.id/uploads/images/posts/post_25469/blob_1369_0.jpg', url: 'https://surabaya.go.id/id/agenda/25469/pengumuman-perpanjangan-seleksi-direksi-dan-komisaris-bumd-pt-bpr-sau', category: 'Pengumuman Kota', location: 'Kota Surabaya', status: 'Agenda berikutnya' },
  { id: '25365', title: 'SE Wali Kota Tentang Pembatasan Pemungutan Iuran di Lingkungan RT dan RW', publishedAt: '2026-07-13T02:29:40Z', image: 'https://surabaya.go.id/uploads/images/posts/post_25365/blob_8197_0.jpg', url: 'https://surabaya.go.id/id/agenda/25365/se-walikota-tentang-pembatasan-pemungutan-iuran-kepada-masyarakat-di-lingkungan-rt-dan-rw-di-wilayah-kota-surabaya', category: 'Informasi Warga', location: 'Kota Surabaya', status: 'Agenda berikutnya' },
  { id: '25362', title: 'Seleksi Direksi dan Komisaris BUMD PT. RPH Perseroda', publishedAt: '2026-07-13T02:17:56Z', image: 'https://surabaya.go.id/uploads/images/posts/post_25362/blob_6640_0.jpg', url: 'https://surabaya.go.id/id/agenda/25362/seleksi-direksi-dan-komisaris-bumd-pt-rph-perseroda', category: 'Agenda Kota', location: 'Kota Surabaya', status: 'Agenda pilihan' },
]

const fallbackNews: NewsItem[] = [
  { id:'25117', title:'SITS dan Layanan Digital Terintegrasi Perkuat Transformasi Smart City Surabaya', slug:'sits-dan-layanan-digital-terintegrasi-perkuat-transformasi-smart-city-surabaya', image:'', publishedAt:'2026-02-18T08:00:00+07:00', category:'Pemerintahan', excerpt:'Pemerintah Kota Surabaya terus memperkuat layanan publik berbasis digital yang terintegrasi.', url:'https://www.surabaya.go.id/id/berita/25117/sits-dan-layanan-digital-terintegrasi-perkuat-transformasi-smart-city-surabaya' },
  { id:'9491', title:'Pemkot Surabaya Tata Jaringan Kabel Utilitas di Kawasan Kota Lama', slug:'tata-jaringan-kabel-utilitas-di-kawasan-kota-lama', image:'', publishedAt:'2026-02-12T08:00:00+07:00', category:'Pembangunan', excerpt:'Penataan utilitas dilakukan untuk meningkatkan keamanan dan kualitas ruang kota.', url:'https://www.surabaya.go.id/id/berita/9491/tata-jaringan-kabel-utilitas-di-kawasan-kota-lama-pemkot-surabaya-lakukan-pemotongan-kabel' },
  { id:'layanan-digital', title:'Layanan Digital Kota Surabaya Semakin Mudah Diakses Warga', slug:'layanan-digital-kota-surabaya', image:'', publishedAt:'2026-02-08T08:00:00+07:00', category:'Pelayanan Publik', excerpt:'Berbagai kebutuhan administrasi dan pengaduan warga tersedia melalui kanal resmi pemerintah kota.', url:'https://www.surabaya.go.id/id/berita' },
  { id:'ruang-publik', title:'Ruang Publik Surabaya Terus Diperkuat untuk Aktivitas Warga', slug:'ruang-publik-surabaya', image:'', publishedAt:'2026-02-04T08:00:00+07:00', category:'Kota', excerpt:'Ruang kota yang aman dan nyaman mendukung interaksi serta kegiatan kreatif masyarakat.', url:'https://www.surabaya.go.id/id/berita' },
]

export const getCityAgenda = async (limit = 6): Promise<CityAgendaItem[]> => {
  type WebAgenda = { id?:number|string; title?:string; name?:string; slug?:string; publish_date?:string; date?:string; feature_image?:string; feature_image_url?:string; image?:string; location?:string; address?:string }
  const publicAgenda = await webdisplayFetch<{ data?: WebAgenda[] | { data?: WebAgenda[] } }>(`agenda?per_page=${limit}&page=1`, 300)
  const agendaPayload = Array.isArray(publicAgenda?.data) ? publicAgenda.data
    : publicAgenda?.data && 'data' in publicAgenda.data && Array.isArray(publicAgenda.data.data) ? publicAgenda.data.data : []
  if (agendaPayload.length) return agendaPayload.slice(0, limit).map((item, index) => {
    const id = String(item.id || item.slug || index)
    const agendaSlug = item.slug || id
    const rawImage = item.feature_image_url || item.feature_image || item.image || ''
    const image = rawImage.startsWith('http') ? rawImage
      : item.feature_image ? `https://surabaya.go.id/uploads/${item.feature_image.replace(/^\/?uploads\//, '')}`
        : rawImage ? `https://webdisplay.surabaya.go.id${rawImage.startsWith('/') ? '' : '/'}${rawImage}` : ''
    return {
      id, title:item.title || item.name || 'Agenda Kota Surabaya', publishedAt:item.publish_date || item.date || '',
      image,
      url:`https://www.surabaya.go.id/id/agenda/${id}/${agendaSlug}`, category:'Agenda Kota',
      location:item.location || item.address || 'Kota Surabaya', status:index < 2 ? 'Informasi terbaru' : 'Agenda berikutnya',
    }
  })
  if (!slug) return fallbackAgenda
  const response = await apiFetch<{ data?: RawPost[] }>(`public/${slug}/post/info?limit=${limit}&page=1&search=&orderColumn=publish_date&orderBy=desc`, 300)
  if (!Array.isArray(response?.data) || !response.data.length) return fallbackAgenda
  return response.data.map((post, index) => {
    const id = String(post.id || post.slug || '')
    const postSlug = post.slug || id
    const publishedAt = typeof post.publishDate === 'string'
      ? post.publishDate
      : post.publishDate?.Valid ? post.publishDate.Time || '' : ''
    const image = post.featureImageUrl
      ? post.featureImageUrl.startsWith('http')
        ? post.featureImageUrl
        : `https://surabaya.go.id/uploads/images/posts/post_${id}/${post.featureImageUrl}`
      : ''
    return {
      id,
      title: post.title || 'Informasi Kota Surabaya',
      publishedAt,
      image,
      url: `https://surabaya.go.id/id/agenda/${id}/${postSlug}`,
      category: index % 2 ? 'Agenda Kota' : 'Pengumuman Kota',
      location: 'Kota Surabaya',
      status: index < 2 ? 'Informasi terbaru' : 'Agenda berikutnya',
    }
  })
}

export const getNews = async (category = 'berita', limit = 6): Promise<NewsItem[]> => {
  if (!slug) return fallbackNews.slice(0, limit)
  const response = await apiFetch<{ data?: RawPost[] }>(`public/${slug}/post/${category}?limit=${limit}&page=1&search=&orderColumn=publish_date&orderBy=desc`, 60)
  return Array.isArray(response?.data) && response.data.length
    ? response.data.map(normalizePost)
    : fallbackNews.slice(0, limit)
}

const fallbackServices: ServiceItem[] = [
  ['Administrasi Kependudukan','Urus dokumen kependudukan melalui KLAMPID New Generation.','https://klampid-dispendukcapil.surabaya.go.id','NIK','Warga',true],
  ['E-Health','Daftar antrean Puskesmas dan rumah sakit secara daring.','https://ehealth.surabaya.go.id','EH','Warga',true],
  ['SSW Alfa','Ajukan dan pantau pelayanan perizinan secara terpadu.','https://sswalfa.surabaya.go.id','SSW','Usaha',true],
  ['Pengaduan Masyarakat','Sampaikan pengaduan dan aspirasi melalui WargaKu.','https://wargaku.surabaya.go.id','W','Warga',true],
  ['Pelayanan Informasi PPID','Akses dan ajukan permohonan informasi publik.','https://ppid.surabaya.go.id','PI','Informasi',true],
  ['JDIH','Dokumentasi dan informasi hukum Pemerintah Kota Surabaya.','https://jdih.surabaya.go.id','JH','Informasi',false],
  ['Satu Data','Jelajahi data terbuka dan statistik resmi Kota Surabaya.','https://opendata.surabaya.go.id','1D','Informasi',false],
  ['Pelayanan DISPENDIK','Pusat informasi dan layanan pendidikan Kota Surabaya.','https://dispendik.surabaya.go.id','PD','Pendidikan',false],
] .map(([title,description,url,iconCode,category,popular], index) => ({ id:`fallback-${index}`, title, description, url, image:'', iconCode, category, popular })) as ServiceItem[]

export const getServices = async (limit = 15) => {
  if (!slug) return fallbackServices.slice(0, limit)
  const response = await apiFetch<{ data?: RawService[] }>(`public/${slug}/service?limit=${limit}&page=1&search=`, 60)
  if (!Array.isArray(response?.data) || !response.data.length) return fallbackServices.slice(0, limit)

  const presentationByTitle: Record<string, Pick<ServiceItem, 'description' | 'category' | 'iconCode' | 'popular'>> = {
    'Ketenagakerjaan': { description: 'Informasi lowongan, pelatihan, dan pelayanan tenaga kerja.', category: 'Warga', iconCode: 'KR', popular: false },
    'Administrasi Kependudukan': { description: 'Urus dokumen dan informasi administrasi kependudukan.', category: 'Warga', iconCode: 'NIK', popular: true },
    'BLC': { description: 'Pelatihan komputer dan literasi digital gratis untuk warga.', category: 'Pendidikan', iconCode: 'BLC', popular: false },
    'E-Health': { description: 'Daftar antrean Puskesmas dan rumah sakit secara daring.', category: 'Warga', iconCode: 'EH', popular: true },
    'JDIH': { description: 'Dokumentasi dan informasi hukum Pemerintah Kota Surabaya.', category: 'Informasi', iconCode: 'JH', popular: false },
    'RUP': { description: 'Akses informasi rencana pengadaan pemerintah secara terbuka.', category: 'Informasi', iconCode: 'RUP', popular: false },
    'LPSE': { description: 'Layanan pengadaan barang dan jasa pemerintah secara elektronik.', category: 'Usaha', iconCode: 'LP', popular: false },
    'Pengaduan Masyarakat': { description: 'Sampaikan pengaduan, aspirasi, dan masukan melalui WargaKu.', category: 'Warga', iconCode: 'W', popular: true },
    'Pemberdayaan Ekonomi': { description: 'Temukan program pengembangan usaha dan ekonomi warga.', category: 'Usaha', iconCode: 'UM', popular: false },
    'Pelayanan Informasi (PPID) Kota Surabaya': { description: 'Ajukan permohonan dan akses informasi publik pemerintah kota.', category: 'Informasi', iconCode: 'PI', popular: true },
    'Pelayanan Informasi PPID': { description: 'Ajukan permohonan dan akses informasi publik pemerintah kota.', category: 'Informasi', iconCode: 'PI', popular: true },
    'Pelayanan Dinas Sosial': { description: 'Informasi layanan sosial dan program kesejahteraan masyarakat.', category: 'Warga', iconCode: 'DS', popular: false },
    'Pelayanan DISPENDIK': { description: 'Pusat informasi dan layanan pendidikan Kota Surabaya.', category: 'Pendidikan', iconCode: 'PD', popular: false },
    'SSW Alfa': { description: 'Ajukan dan pantau pelayanan perizinan secara terpadu.', category: 'Usaha', iconCode: 'SSW', popular: true },
    'Satu Data': { description: 'Jelajahi data terbuka dan statistik resmi Kota Surabaya.', category: 'Informasi', iconCode: '1D', popular: false },
  }

  return response.data.map((service): ServiceItem => {
    const title = service.title || 'Layanan Pemerintah Kota Surabaya'
    const presentation = presentationByTitle[title] || {
      description: 'Akses layanan resmi Pemerintah Kota Surabaya.',
      category: 'Informasi' as const,
      iconCode: 'PI',
      popular: false,
    }
    return {
      id: String(service.id || title),
      title,
      description: service.description || presentation.description,
      url: service.url || '#',
      image: service.imageUrl || '',
      category: presentation.category,
      iconCode: presentation.iconCode,
      popular: presentation.popular,
    }
  })
}
