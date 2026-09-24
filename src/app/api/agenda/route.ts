import type { NextRequest } from 'next/server'
import { getPaginatedAgenda } from '@/lib/surabaya-api'

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit')) || 6
  const limit = Math.min(Math.max(requestedLimit, 1), 15)
  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1)
  const search = request.nextUrl.searchParams.get('search') || request.nextUrl.searchParams.get('q') || ''

  return Response.json(await getPaginatedAgenda(page, limit, search))
}
