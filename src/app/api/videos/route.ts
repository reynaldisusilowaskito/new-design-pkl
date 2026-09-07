import type { NextRequest } from 'next/server'
import { getCityVideos } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit')) || 6
  const limit = Math.min(Math.max(requestedLimit, 1), 12)

  return Response.json(await getCityVideos(limit))
}
