import 'server-only'
import { sanitizeOfficialHtml } from './sanitize-official-html'

export type WebdisplayMediaType = 'videos' | 'podcasts' | 'photos'

type RawMedia = {
  id?: number | string
  title?: string
  feature_image?: string
  created_at?: string
  viewed_count?: number
  content?: string
  content_type?: string
}

type RawListResponse = {
  data?: RawMedia[]
  current_page?: number
  currentPage?: number
  last_page?: number
  lastPage?: number
  total?: number
}

export type WebdisplayMediaItem = {
  id: string
  title: string
  slug: string
  image: string
  publishedAt: string
  viewCount: number
  content: string
  contentType: string
  mediaUrl: string
  images: string[]
  url: string
  type: WebdisplayMediaType
}

export type WebdisplayMediaList = {
  items: WebdisplayMediaItem[]
  page: number
  lastPage: number
  total: number
}

const baseUrl = process.env.API_URL_WEBDISPLAY?.replace(/\/$/, '')
const publicOrigin = (() => {
  try { return baseUrl ? new URL(baseUrl).origin : 'https://webdisplay.surabaya.go.id' }
  catch { return 'https://webdisplay.surabaya.go.id' }
})()

const resourceByType = {
  videos: { list: 'videos', detail: 'video-detail' },
  podcasts: { list: 'podcasts', detail: 'podcast-detail' },
  photos: { list: 'infografis', detail: 'infografis-detail' },
} as const

const slugify = (value = '') => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const absoluteMediaUrl = (value = '') => {
  const clean = value.trim().replace(/^['"]|['"]$/g, '')
  if (!clean) return ''
  if (/^https?:\/\//i.test(clean)) return clean
  if (clean.startsWith('//')) return `https:${clean}`
  const relative = clean.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '')
  return `${publicOrigin}/${relative.replace(/^\//, '')}`
}

const normalizeMediaHtml = (value = '') => value.replace(
  /\b(src|poster)=(['"])(.*?)\2/gi,
  (_match, attribute, quote, url) => `${attribute}=${quote}${absoluteMediaUrl(url)}${quote}`,
)

const attributeUrls = (html: string, tag: string, attribute = 'src') => Array.from(
  html.matchAll(new RegExp(`<${tag}\\b[^>]*\\b${attribute}=["']([^"']+)["'][^>]*>`, 'gi')),
  (match) => absoluteMediaUrl(match[1]),
).filter(Boolean)

const firstMediaUrl = (html: string) => [
  ...attributeUrls(html, 'source'),
  ...attributeUrls(html, 'audio'),
  ...attributeUrls(html, 'video'),
][0] || ''

const mapItem = (raw: RawMedia, type: WebdisplayMediaType): WebdisplayMediaItem => {
  const id = String(raw.id || '')
  const title = raw.title || 'Media Kota Surabaya'
  const normalizedHtml = normalizeMediaHtml(raw.content || '')
  return {
    id,
    title,
    slug: slugify(title) || id,
    image: absoluteMediaUrl(raw.feature_image || ''),
    publishedAt: raw.created_at || '',
    viewCount: raw.viewed_count || 0,
    content: sanitizeOfficialHtml(type === 'photos' ? normalizedHtml.replace(/<img\b[^>]*>/gi, '') : normalizedHtml),
    contentType: raw.content_type || '',
    mediaUrl: firstMediaUrl(normalizedHtml),
    images: [...new Set(attributeUrls(normalizedHtml, 'img'))],
    url: `/${type}/${id}/${slugify(title) || id}`,
    type,
  }
}

const fetchWebdisplay = async <T>(path: string): Promise<T | null> => {
  if (!baseUrl) return null
  try {
    const response = await fetch(`${baseUrl}/${path.replace(/^\//, '')}`, {
      headers: {
        'Content-Type': 'application/json',
        Signature: process.env.SIGNATURE || 'no-signature',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      console.warn(JSON.stringify({ scope:'webdisplay-api', path, detail:`HTTP ${response.status}` }))
      return null
    }
    return response.json() as Promise<T>
  } catch (error) {
    console.warn(JSON.stringify({ scope:'webdisplay-api', path, detail:error instanceof Error ? error.message : 'Unknown fetch error' }))
    return null
  }
}

export async function getWebdisplayMediaList(type: WebdisplayMediaType, page = 1, limit = 15): Promise<WebdisplayMediaList> {
  const safePage = Math.max(1, Math.trunc(page) || 1)
  const safeLimit = Math.min(30, Math.max(1, Math.trunc(limit) || 15))
  const resource = resourceByType[type].list
  const payload = await fetchWebdisplay<RawListResponse>(`${resource}?per_page=${safeLimit}&page=${safePage}`)
  const items = Array.isArray(payload?.data) ? payload.data.map((item) => mapItem(item, type)) : []
  return {
    items,
    page: payload?.current_page || payload?.currentPage || safePage,
    lastPage: payload?.last_page || payload?.lastPage || 1,
    total: payload?.total || items.length,
  }
}

export async function getWebdisplayMediaDetail(type: WebdisplayMediaType, id: string): Promise<WebdisplayMediaItem | null> {
  const resource = resourceByType[type].detail
  const payload = await fetchWebdisplay<RawMedia | { data?: RawMedia }>(`${resource}?id=${encodeURIComponent(id)}`)
  if (!payload) return null
  const raw = 'data' in payload && payload.data ? payload.data : payload as RawMedia
  return raw.id || raw.title || raw.content ? mapItem(raw, type) : null
}
