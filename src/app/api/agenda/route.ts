import type { NextRequest } from 'next/server'
import { getCityAgenda } from '@/lib/surabaya-api'

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit')) || 6
  const limit = Math.min(Math.max(requestedLimit, 1), 15)

  return Response.json(await getCityAgenda(limit))
}
