import type { NextRequest } from 'next/server'
import { getNews } from '@/lib/surabaya-api'

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') || 'berita'
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit')) || 10
  const limit = Math.min(Math.max(requestedLimit, 1), 30)

  return Response.json(await getNews(category, limit))
}
