import 'server-only'

type TourismFile = { id?:string; name?:string; path?:string; size?:string; ext?:string; link?: string; fileTypeName?: string; fileType?: string }
type RawDestination = { id?: string; address?: string; latitude?: string; longitude?: string; nameIndonesia?: string; nameInggris?: string | null; descriptionIndonesia?: string; desctiptionInggris?: string | null; tourismCategory?: Array<{ name?: string }>; touristDestinationFiles?: TourismFile[] }
type RawCulinary = {
  id?: string
  name?: string
  address?: string
  latitude?: string
  longitude?: string
  description?: string | null
  descriptionIndonesia?: string | null
  descriptionEnglish?: string | null
  culinaryFiles?: TourismFile[]
}
type RawHotel = { id?:string; name?:string; address?:string; latitude?:string; longitude?:string; websiteLink?:string; phoneNumber?:string; description?:string; hotelFiles?:TourismFile[]; hotelThumbnail?:TourismFile; hotelCategory?:{ starNumber?:number; starNumberName?:string } }
type TourismResponse<T> = { data?: { data?: T[]; lastPage?: number } }

export type TourismItem = {
  id: string
  nameId: string
  nameEn: string
  descriptionId: string
  descriptionEn: string
  address: string
  image: string
  images?: string[]
  hotelFiles?: TourismFile[]
  hotelCategoryName?: string
  category: string
  mapsUrl: string
  latitude: number | null
  longitude: number | null
  stars: number
  website: string
  phone: string
  priceLabel: string
}

const thumbnail = (files: TourismFile[] = []) => files.find((file) => file.fileType === 'thumbnail')?.link || files.find((file) => /image|gambar|thumbnail/i.test(`${file.fileTypeName} ${file.fileType}`))?.link || files[0]?.link || ''
const mapsUrl = (latitude?: string, longitude?: string, query?: string) => latitude && longitude
  ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Surabaya')}`
const coordinate = (value?:string) => { const parsed=Number(value); return Number.isFinite(parsed) ? parsed : null }
const plainText = (value?:string | null) => (value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
const languageScore = (value:string, words:string[]) => words.reduce((score,word)=>score+(value.match(new RegExp(`\\b${word}\\b`,'gi'))?.length || 0),0)
const looksIndonesian = (value:string) => {
  const indonesian=languageScore(value,['yang','dan','dengan','untuk','dari','kami','anda','adalah','terletak','kota','pengunjung','tempat','memiliki','menawarkan'])
  const english=languageScore(value,['the','and','with','for','from','this','that','is','are','located','rooms','guests','offers','minutes'])
  return indonesian>english
}
const culinaryDescriptions = (item:RawCulinary) => {
  const genericDescription=plainText(item.description)
  const apiDescriptionId=plainText(item.descriptionIndonesia) || (looksIndonesian(genericDescription)?genericDescription:'')
  const apiDescriptionEn=plainText(item.descriptionEnglish) || (genericDescription&&!looksIndonesian(genericDescription)?genericDescription:'')
  const name=plainText(item.name) || 'Kuliner Surabaya'
  const address=plainText(item.address) || 'Surabaya'
  return {
    id:apiDescriptionId || `${name} merupakan salah satu pilihan kuliner yang dapat ditemukan di ${address}`,
    en:apiDescriptionEn || `${name} is one of the culinary choices available at ${address}`,
  }
}
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
    const lastPage = Math.max(first.data?.lastPage || 1, 1)
    if (lastPage === 1) return firstItems
    const remaining = await Promise.all(Array.from({ length:lastPage - 1 }, (_,index) => tourismFetch<T>(`${path}?page=${index + 2}`)))
    return firstItems.concat(...remaining)
  } catch { return [] }
}

const hotelFallback: TourismItem[] = [
  { id:'hotel-majapahit',nameId:'Hotel Majapahit Surabaya',nameEn:'Hotel Majapahit Surabaya',descriptionId:'Hotel bersejarah di pusat Kota Surabaya.',descriptionEn:'A historic hotel in central Surabaya.',address:'Jl. Tunjungan No. 65, Surabaya',image:'',category:'Hotel',mapsUrl:mapsUrl('-7.2593','112.7390'),latitude:-7.2593,longitude:112.7390,stars:5,website:'https://www.hotel-majapahit.com',phone:'',priceLabel:'Hubungi hotel'},
  { id:'grand-dafam',nameId:'Grand Dafam Signature Surabaya',nameEn:'Grand Dafam Signature Surabaya',descriptionId:'Hotel pusat kota dekat kawasan bisnis dan wisata.',descriptionEn:'A city-center hotel near business and tourism areas.',address:'Jl. Kayoon No. 4-10, Surabaya',image:'',category:'Hotel',mapsUrl:mapsUrl('-7.2717','112.7488'),latitude:-7.2717,longitude:112.7488,stars:4,website:'',phone:'',priceLabel:'Hubungi hotel'},
]

export async function getTourismContent() {
  const [destinations, culinaries, hotels] = await Promise.all([allPages<RawDestination>('destination'), allPages<RawCulinary>('culinary'), allPages<RawHotel>('hotel')])
  const mappedHotels=hotels.filter((item)=>inSurabaya(item.latitude,item.longitude,item.address)).map((item,index):TourismItem => ({
    id:item.id || `hotel-${index}`,nameId:item.name || 'Hotel Surabaya',nameEn:item.name || 'Surabaya Hotel',descriptionId:`${item.name || 'Hotel ini'} merupakan pilihan tempat menginap yang berlokasi di ${item.address || 'Kota Surabaya'}.`,descriptionEn:`${item.name || 'This hotel'} is an accommodation option located at ${item.address || 'Surabaya'}.`,address:item.address || 'Surabaya',image:item.hotelThumbnail?.link || thumbnail(item.hotelFiles),images:item.hotelFiles?.filter(file=>file.fileType==='gallery').map(file=>file.link).filter((link):link is string=>Boolean(link)) || [],hotelFiles:item.hotelFiles || [],hotelCategoryName:item.hotelCategory?.starNumberName || 'Hotel',category:'Hotel',mapsUrl:mapsUrl(item.latitude,item.longitude,item.name),latitude:coordinate(item.latitude),longitude:coordinate(item.longitude),stars:item.hotelCategory?.starNumber || 0,website:item.websiteLink || '',phone:item.phoneNumber || '',priceLabel:'Hubungi hotel',
  }))
  return {
    destinations: destinations.map((item,index):TourismItem => ({
      id:item.id || `destination-${index}`, nameId:item.nameIndonesia || 'Destinasi Surabaya', nameEn:item.nameInggris || item.nameIndonesia || 'Surabaya Destination',
      descriptionId:item.descriptionIndonesia || `${item.nameIndonesia || 'Destinasi ini'} merupakan salah satu tempat menarik yang dapat dikunjungi di Kota Surabaya.`, descriptionEn:item.desctiptionInggris || `${item.nameInggris || item.nameIndonesia || 'This destination'} is one of the interesting places to visit in Surabaya.`,
      address:item.address || 'Surabaya', image:thumbnail(item.touristDestinationFiles), images:item.touristDestinationFiles?.filter(file=>file.fileType==='gallery').map(file=>file.link).filter((link):link is string=>Boolean(link)) || [], category:item.tourismCategory?.map(category=>category.name).filter(Boolean).join(', ') || 'Destinasi', mapsUrl:mapsUrl(item.latitude,item.longitude,item.nameIndonesia),latitude:coordinate(item.latitude),longitude:coordinate(item.longitude),stars:0,website:'',phone:'',priceLabel:'',
    })),
    culinaries: mapCulinaries(culinaries),
    hotels: mappedHotels.length ? mappedHotels : hotelFallback,
  }
}

const mapCulinaries = (culinaries: RawCulinary[]) => culinaries.map((item,index):TourismItem => {
  const description=culinaryDescriptions(item)
  return {
    id:item.id || `culinary-${index}`, nameId:item.name || 'Kuliner Surabaya', nameEn:item.name || 'Surabaya Culinary', descriptionId:description.id, descriptionEn:description.en,
    address:item.address || 'Surabaya', image:thumbnail(item.culinaryFiles), images:item.culinaryFiles?.filter(file=>file.fileType==='gallery').map(file=>file.link).filter((link):link is string=>Boolean(link)) || [], category:'Wisata Kuliner', mapsUrl:mapsUrl(item.latitude,item.longitude,item.name),latitude:coordinate(item.latitude),longitude:coordinate(item.longitude),stars:0,website:'',phone:'',priceLabel:'',
  }
})
