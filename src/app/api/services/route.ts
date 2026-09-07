import type { NextRequest } from 'next/server'
import { getServices } from '@/lib/surabaya-api'

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit')) || 15
  const limit = Math.min(Math.max(requestedLimit, 1), 50)

  return Response.json(await getServices(limit))
}
