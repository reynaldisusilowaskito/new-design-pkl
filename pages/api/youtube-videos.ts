import type { NextApiRequest, NextApiResponse } from 'next'

const CHANNEL_URL = 'https://www.youtube.com/@BanggaSurabaya'

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  // Bypass YouTube consent gate so the real channel page is served
  'Cookie': 'CONSENT=YES+; SOCS=CAI',
}

export interface YoutubeVideo {
  videoId: string
  title: string
  published: string
  thumbnail: string
}

/** Try several patterns YouTube uses to embed the channel ID in page HTML */
function extractChannelId(html: string): string | null {
  const patterns = [
    // Most reliable: the RSS <link> tag YouTube embeds in every channel page <head>
    /feeds\/videos\.xml\?channel_id=(UC[\w-]+)/,
    /"channelId":"(UC[\w-]+)"/,
    /"externalId":"(UC[\w-]+)"/,
    /"browseId":"(UC[\w-]+)"/,
    /channel_id=(UC[\w-]+)/,
    /\/channel\/(UC[\w-]+)/,
  ]
  for (const pat of patterns) {
    const m = html.match(pat)
    if (m) return m[1]
  }
  return null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try @handle page first, then /videos and /about as fallbacks
    let channelId: string | null = null
    const urls = [CHANNEL_URL, `${CHANNEL_URL}/videos`, `${CHANNEL_URL}/about`]

    for (const url of urls) {
      const pageRes = await fetch(url, { headers: BROWSER_HEADERS })
      if (!pageRes.ok) continue
      const html = await pageRes.text()
      channelId = extractChannelId(html)
      if (channelId) break
    }

    if (!channelId) throw new Error('Channel ID not found')

    // Fetch RSS feed
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { headers: BROWSER_HEADERS }
    )
    if (!rssRes.ok) throw new Error(`RSS fetch failed: ${rssRes.status}`)
    const xml = await rssRes.text()

    // Parse entries
    const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g))
    const videos: YoutubeVideo[] = entries.slice(0, 6).map(entry => {
      const content   = entry[1]
      const videoId   = (content.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1] || ''
      const rawTitle  = (content.match(/<title>(.*?)<\/title>/)            || [])[1] || ''
      const published = (content.match(/<published>(.*?)<\/published>/)    || [])[1] || ''
      const title     = rawTitle
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      return { videoId, title, published, thumbnail }
    })

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate')
    return res.status(200).json({ videos })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
}
