import { getOrganization } from '@/lib/surabaya-api'

export async function GET() {
  return Response.json(await getOrganization())
}
