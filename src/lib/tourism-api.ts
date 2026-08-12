import 'server-only'

type TourismFile = { link?: string; fileTypeName?: string; fileType?: string }
type RawDestination = { id?: string; address?: string; latitude?: string; longitude?: string; nameIndonesia?: string; nameInggris?: string | null; descriptionIndonesia?: string; desctiptionInggris?: string | null; tourismCategory?: Array<{ name?: string }>; touristDestinationFiles?: TourismFile[] }
type RawCulinary = { id?: string; name?: string; address?: string; latitude?: string; longitude?: string; culinaryFiles?: TourismFile[] }
type RawHotel = { id?:string; name?:string; address?:string; latitude?:string; longitude?:string; websiteLink?:string; phoneNumber?:string; description?:string; hotelFiles?:TourismFile[]; hotelThumbnail?:TourismFile; hotelCategory?:{ starNumber?:number } }
type TourismResponse<T> = { data?: { data?: T[]; lastPage?: number } }

export type TourismItem = {
  id: string
  nameId: string
  nameEn: string
  descriptionId: string
  descriptionEn: string
  address: string
  image: string
  category: string
  mapsUrl: string
  latitude: number | null
  longitude: number | null
  stars: number
  website: string
  phone: string
  priceLabel: string
}

const fallbackImage = '/assets/redesign/hero/alun-alun-surabaya.jpg'
const thumbnail = (files: TourismFile[] = []) => files.find((file) => /image|gambar|thumbnail/i.test(`${file.fileTypeName} ${file.fileType}`))?.link || files[0]?.link || ''
const mapsUrl = (latitude?: string, longitude?: string, query?: string) => latitude && longitude
  ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Surabaya')}`
const coordinate = (value?:string) => { const parsed=Number(value); return Number.isFinite(parsed) ? parsed : null }
const inSurabaya = (latitude?:string, longitude?:string, address='') => {
  const lat=coordinate(latitude), lng=coordinate(longitude)
  return (lat !== null && lng !== null && lat >= -7.38 && lat <= -7.16 && lng >= 112.58 && lng <= 112.86) || /surabaya/i.test(address)
}

const tourismFetch = async <T>(path: string): Promise<T[]> => {
  try {
    const response = await fetch(`https://tourism.surabaya.go.id/api/kominfo/${path}${path.includes('?') ? '' : '?page=1'}`, { next:{ revalidate:900 }, signal:AbortSignal.timeout(5000) })
    if (!response.ok) return []
    const payload = await response.json() as TourismResponse<T>
    return Array.isArray(payload.data?.data) ? payload.data.data : []
  } catch { return [] }
}

const allPages = async <T>(path: string): Promise<T[]> => {
  try {
    const firstResponse = await fetch(`https://tourism.surabaya.go.id/api/kominfo/${path}?page=1`, { next:{ revalidate:900 }, signal:AbortSignal.timeout(5000) })
    if (!firstResponse.ok) return []
    const first = await firstResponse.json() as TourismResponse<T>
    const firstItems = Array.isArray(first.data?.data) ? first.data.data : []
    const lastPage = Math.min(Math.max(first.data?.lastPage || 1, 1), 30)
    if (lastPage === 1) return firstItems
    const remaining = await Promise.all(Array.from({ length:lastPage - 1 }, (_,index) => tourismFetch<T>(`${path}?page=${index + 2}`)))
    return firstItems.concat(...remaining)
  } catch { return [] }
}

const destinationFallback: TourismItem[] = [
  { id:'alun-alun', nameId:'Alun-Alun Surabaya', nameEn:'Surabaya City Square', descriptionId:'Ruang publik dan pusat seni di Balai Pemuda.', descriptionEn:'A public space and arts center at Balai Pemuda.', address:'Jl. Gubernur Suryo No. 15, Surabaya', image:fallbackImage, category:'Wisata Kota', mapsUrl:mapsUrl('-7.2631','112.7449'), latitude:-7.2631,longitude:112.7449,stars:0,website:'',phone:'',priceLabel:'' },
  { id:'tugu-pahlawan', nameId:'Tugu Pahlawan', nameEn:'Heroes Monument', descriptionId:'Monumen ikonik perjuangan Arek-Arek Suroboyo.', descriptionEn:'An iconic monument honoring Surabaya’s heroes.', address:'Jl. Pahlawan, Surabaya', image:'', category:'Sejarah', mapsUrl:mapsUrl('-7.2458','112.7378'),latitude:-7.2458,longitude:112.7378,stars:0,website:'',phone:'',priceLabel:'' },
  { id:'kota-lama', nameId:'Kota Lama Surabaya', nameEn:'Surabaya Old Town', descriptionId:'Kawasan bersejarah dengan arsitektur kolonial.', descriptionEn:'A historic district with colonial architecture.', address:'Kawasan Jembatan Merah, Surabaya', image:'', category:'Heritage', mapsUrl:mapsUrl('-7.2352','112.7354'),latitude:-7.2352,longitude:112.7354,stars:0,website:'',phone:'',priceLabel:'' },
]

const culinaryFallback: TourismItem[] = [
  { id:'rujak-cingur', nameId:'Rujak Cingur', nameEn:'Rujak Cingur', descriptionId:'Petis, sayuran, buah, dan cingur khas Surabaya.', descriptionEn:'Surabaya-style shrimp paste, vegetables, fruit, and cingur.', address:'Surabaya', image:'', category:'Kuliner Khas', mapsUrl:mapsUrl(undefined,undefined,'Rujak Cingur Surabaya'),latitude:null,longitude:null,stars:0,website:'',phone:'',priceLabel:'' },
  { id:'lontong-balap', nameId:'Lontong Balap', nameEn:'Lontong Balap', descriptionId:'Lontong, tauge, lentho, tahu, dan kuah gurih.', descriptionEn:'Rice cake, bean sprouts, lentho, tofu, and savory broth.', address:'Surabaya', image:'', category:'Kuliner Khas', mapsUrl:mapsUrl(undefined,undefined,'Lontong Balap Surabaya'),latitude:null,longitude:null,stars:0,website:'',phone:'',priceLabel:'' },
  { id:'sate-klopo', nameId:'Sate Klopo', nameEn:'Sate Klopo', descriptionId:'Sate kelapa berbumbu dengan aroma panggang khas.', descriptionEn:'Seasoned coconut satay with a distinctive grilled aroma.', address:'Surabaya', image:'', category:'Kuliner Khas', mapsUrl:mapsUrl(undefined,undefined,'Sate Klopo Surabaya'),latitude:null,longitude:null,stars:0,website:'',phone:'',priceLabel:'' },
]

const hotelFallback: TourismItem[] = [
  { id:'hotel-majapahit',nameId:'Hotel Majapahit Surabaya',nameEn:'Hotel Majapahit Surabaya',descriptionId:'Hotel bersejarah di pusat Kota Surabaya.',descriptionEn:'A historic hotel in central Surabaya.',address:'Jl. Tunjungan No. 65, Surabaya',image:'',category:'Hotel',mapsUrl:mapsUrl('-7.2593','112.7390'),latitude:-7.2593,longitude:112.7390,stars:5,website:'https://www.hotel-majapahit.com',phone:'',priceLabel:'Hubungi hotel'},
  { id:'grand-dafam',nameId:'Grand Dafam Signature Surabaya',nameEn:'Grand Dafam Signature Surabaya',descriptionId:'Hotel pusat kota dekat kawasan bisnis dan wisata.',descriptionEn:'A city-center hotel near business and tourism areas.',address:'Jl. Kayoon No. 4-10, Surabaya',image:'',category:'Hotel',mapsUrl:mapsUrl('-7.2717','112.7488'),latitude:-7.2717,longitude:112.7488,stars:4,website:'',phone:'',priceLabel:'Hubungi hotel'},
]

export async function getTourismContent() {
  const [destinations, culinaries, hotels] = await Promise.all([allPages<RawDestination>('destination'), allPages<RawCulinary>('culinary'), allPages<RawHotel>('hotel')])
  return {
    destinations: destinations.filter((item)=>inSurabaya(item.latitude,item.longitude,item.address)).slice(0,18).map((item,index):TourismItem => ({
      id:item.id || `destination-${index}`, nameId:item.nameIndonesia || 'Destinasi Surabaya', nameEn:item.nameInggris || item.nameIndonesia || 'Surabaya Destination',
      descriptionId:item.descriptionIndonesia || 'Jelajahi salah satu destinasi menarik di Kota Surabaya.', descriptionEn:item.desctiptionInggris || item.descriptionIndonesia || 'Explore one of Surabaya’s interesting destinations.',
      address:item.address || 'Surabaya', image:thumbnail(item.touristDestinationFiles), category:item.tourismCategory?.[0]?.name || 'Destinasi', mapsUrl:mapsUrl(item.latitude,item.longitude,item.nameIndonesia),latitude:coordinate(item.latitude),longitude:coordinate(item.longitude),stars:0,website:'',phone:'',priceLabel:'',
    })).concat(destinationFallback).filter((item,index,array)=>array.findIndex((entry)=>entry.nameId===item.nameId)===index) || destinationFallback,
    culinaries: mapCulinaries(culinaries),
    hotels: hotels.filter((item)=>inSurabaya(item.latitude,item.longitude,item.address)).slice(0,24).map((item,index):TourismItem => ({
      id:item.id || `hotel-${index}`,nameId:item.name || 'Hotel Surabaya',nameEn:item.name || 'Surabaya Hotel',descriptionId:(item.description || 'Akomodasi di Kota Surabaya.').replace(/<[^>]+>/g,'').slice(0,120),descriptionEn:'Accommodation in Surabaya.',address:item.address || 'Surabaya',image:item.hotelThumbnail?.link || thumbnail(item.hotelFiles),category:'Hotel',mapsUrl:mapsUrl(item.latitude,item.longitude,item.name),latitude:coordinate(item.latitude),longitude:coordinate(item.longitude),stars:item.hotelCategory?.starNumber || 0,website:item.websiteLink || '',phone:item.phoneNumber || '',priceLabel:'Hubungi hotel',
    })).concat(hotelFallback).filter((item,index,array)=>array.findIndex((entry)=>entry.nameId===item.nameId)===index),
  }
}

const mapCulinaries = (culinaries: RawCulinary[]) => culinaries.filter((item)=>inSurabaya(item.latitude,item.longitude,item.address)).map((item,index):TourismItem => ({
  id:item.id || `culinary-${index}`, nameId:item.name || 'Kuliner Surabaya', nameEn:item.name || 'Surabaya Culinary', descriptionId:'Temukan cita rasa khas dan pilihan kuliner favorit di Surabaya.', descriptionEn:'Discover distinctive flavors and favorite culinary choices in Surabaya.',
  address:item.address || 'Surabaya', image:thumbnail(item.culinaryFiles), category:'Wisata Kuliner', mapsUrl:mapsUrl(item.latitude,item.longitude,item.name),latitude:coordinate(item.latitude),longitude:coordinate(item.longitude),stars:0,website:'',phone:'',priceLabel:'',
})).concat(culinaryFallback).filter((item,index,array)=>array.findIndex((entry)=>entry.nameId===item.nameId)===index)
