import LegacyPageTemplate from '@/components/legacy/LegacyPageTemplate'
import ContentDetailPage from '@/components/content/ContentDetailPage'
import NewsIndexPage from '@/components/content/NewsIndexPage'
import AgendaIndexPage from '@/components/content/AgendaIndexPage'
import { getCityAgenda, getLegacyRoutePage, getNews, getOrganization } from '@/lib/surabaya-api'

export const revalidate = 300

type LegacyRouteProps = { params: Promise<{ legacyPath: string[] }> }

export default async function LegacyCmsPage({ params }: LegacyRouteProps) {
  const { legacyPath } = await params
  const isNewsIndex = legacyPath.join('/') === 'id/berita' || legacyPath.join('/') === 'berita'
  const isAgendaIndex = legacyPath.join('/') === 'id/agenda' || legacyPath.join('/') === 'agenda'

  if (isNewsIndex) {
    const [organization, news] = await Promise.all([getOrganization(), getNews('berita', 24)])
    return <NewsIndexPage navigation={organization.menu} organization={organization} items={news} />
  }

  if (isAgendaIndex) {
    const [organization, agenda] = await Promise.all([getOrganization(), getCityAgenda(36)])
    return <AgendaIndexPage navigation={organization.menu} organization={organization} items={agenda} />
  }

  const [organization, page] = await Promise.all([
    getOrganization(),
    getLegacyRoutePage(legacyPath),
  ])

  if (page.kind === 'news' || page.kind === 'agenda') {
    return <ContentDetailPage navigation={organization.menu} organization={organization} page={page} />
  }

  return <LegacyPageTemplate navigation={organization.menu} organization={organization} page={page} pathname={`/${legacyPath.join('/')}`} />
}
