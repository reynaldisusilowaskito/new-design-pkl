import type { NextRequest } from 'next/server'
import { getPaginatedAgenda, getPaginatedInfographics, getPaginatedNews } from '@/lib/surabaya-api'

export async function GET(request: NextRequest) {
  const requestedCategory = request.nextUrl.searchParams.get('category') || 'berita'
  const category = ['berita', 'info', 'infografis'].includes(requestedCategory) ? requestedCategory : 'berita'
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit')) || 10
  const limit = Math.min(Math.max(requestedLimit, 1), 30)
  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1)
  const search = request.nextUrl.searchParams.get('search') || request.nextUrl.searchParams.get('q') || ''

  if (category === 'info') return Response.json(await getPaginatedAgenda(page, limit, search))
  if (category === 'infografis') return Response.json(await getPaginatedInfographics(page, limit, search))
  return Response.json(await getPaginatedNews(page, limit, search))
}
