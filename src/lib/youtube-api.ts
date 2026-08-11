import 'server-only'

const CHANNEL_ID = 'UCQ_7hWz0IXYMZOSLL3PoKIQ'
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@BanggaSurabaya'

export type CityVideo = {
  id: string
  youtubeId: string
  title: string
  publishedAt: string
  category: string
  image: string
  url: string
}

const fallbackVideos: CityVideo[] = [
  ['UT_iC5P2Jos', 'Opening Ceremony - Surabaya Great Expo 2026', '2026-08-06', 'Siaran Kota'],
  ['OJvdHZ9Pr6c', 'Bimbingan Teknis - Pengelolaan Pengaduan Masyarakat Tahun 2026', '2026-08-01', 'Pelayanan Publik'],
  ['EoI5tTThPmM', 'Kelas Inspirasi', '2026-07-30', 'Inspirasi Warga'],
  ['4qpeBIjxHk4', 'Acara Puncak Hari Anak Nasional Tingkat Kota Surabaya Tahun 2026', '2026-07-29', 'Kegiatan Kota'],
  ['AFtg6j7Oe7k', 'Sekarang Jauh Lebih Tertata! Penataan Kawasan Kalitebu', '2026-07-28', 'Shorts'],
  ['ZawTN79fhe4', 'Selamat Hari Anak Nasional', '2026-07-28', 'Kegiatan Kota'],
].map(([youtubeId, title, publishedAt, category]) => ({
  id: youtubeId,
  youtubeId,
  title,
  publishedAt,
  category,
  image: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  url: `https://www.youtube.com/watch?v=${youtubeId}`,
}))

const decodeXml = (value: string) => value
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")

export async function getCityVideos(limit = 6): Promise<CityVideo[]> {
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(3500),
    })
    if (!response.ok) return fallbackVideos.slice(0, limit)
    const xml = await response.text()
    const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).slice(0, limit)
    const videos = entries.map((entry): CityVideo => {
      const content = entry[1]
      const youtubeId = content.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || ''
      const title = decodeXml(content.match(/<title>(.*?)<\/title>/)?.[1] || 'Video Kota Surabaya')
      const publishedAt = content.match(/<published>(.*?)<\/published>/)?.[1] || ''
      return {
        id: youtubeId,
        youtubeId,
        title,
        publishedAt,
        category: 'Video Kota',
        image: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${youtubeId}`,
      }
    }).filter((video) => video.youtubeId)
    return videos.length ? videos : fallbackVideos.slice(0, limit)
  } catch {
    return fallbackVideos.slice(0, limit)
  }
}
