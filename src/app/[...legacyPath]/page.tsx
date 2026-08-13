import { notFound } from 'next/navigation'
import LegacyPageTemplate from '@/components/legacy/LegacyPageTemplate'
import { getLegacyPage, getOrganization } from '@/lib/surabaya-api'

export const revalidate = 300

type LegacyRouteProps = { params: Promise<{ legacyPath: string[] }> }

const isLegacyCmsPath = (path: string[]) => (
  (path[0] === 'page' && path[1] === '0')
  || (path[0] === 'id' && path[1] === 'page' && path[2] === '0')
)

export default async function LegacyCmsPage({ params }: LegacyRouteProps) {
  const { legacyPath } = await params
  if (!isLegacyCmsPath(legacyPath)) notFound()

  const idIndex = legacyPath[0] === 'id' ? 3 : 2
  const id = legacyPath[idIndex]
  const slug = legacyPath.slice(idIndex + 1).join('-')
  if (!id || !slug) notFound()

  const [organization, page] = await Promise.all([
    getOrganization(),
    getLegacyPage(id, slug),
  ])

  return <LegacyPageTemplate navigation={organization.menu} organization={organization} page={page} pathname={`/${legacyPath.join('/')}`} />
}
