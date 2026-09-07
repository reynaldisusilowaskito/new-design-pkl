import { getBackendReadiness } from '@/lib/surabaya-api'

export async function GET() {
  const backend = getBackendReadiness()
  return Response.json({
    status: 'ok',
    runtime: 'nextjs-server',
    backend,
    timestamp: new Date().toISOString(),
  })
}
