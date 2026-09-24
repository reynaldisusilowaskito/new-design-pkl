import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import LegacyPageTemplate from '@/components/legacy/LegacyPageTemplate'
import ContentDetailPage from '@/components/content/ContentDetailPage'
import NewsIndexPage from '@/components/content/NewsIndexPage'
import AgendaIndexPage from '@/components/content/AgendaIndexPage'
import MediaIndexPage from '@/components/media/MediaIndexPage'
import MediaDetailPage from '@/components/media/MediaDetailPage'
import { getLegacyRoutePage, getOrganization, getPaginatedAgenda, getPaginatedInfographics, getPaginatedNews } from '@/lib/surabaya-api'
import { getWebdisplayMediaDetail, getWebdisplayMediaList, type WebdisplayMediaType } from '@/lib/webdisplay-api'

export const revalidate = 300

type LegacyRouteProps = { params: Promise<{ legacyPath: string[] }>; searchParams: Promise<{ page?: string; q?: string }> }

const mediaRoute = (path: string[]) => {
  const offset = path[0] === 'id' ? 1 : 0
  const category = path[offset] as WebdisplayMediaType
  if (!['videos', 'podcasts', 'photos'].includes(category)) return null
  return { type:category, id:path[offset + 1], pathname:`/${path.slice(0, offset + 1).join('/')}` }
}

const descriptionFromHtml = (html: string) => html
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 160)

export async function generateMetadata({ params }: LegacyRouteProps): Promise<Metadata> {
  const { legacyPath } = await params
  const route = legacyPath.join('/')
  const media = mediaRoute(legacyPath)
  if (route === 'id/berita' || route === 'berita') {
    return {
      title: 'Berita',
      description: 'Kabar terbaru dan informasi resmi Pemerintah Kota Surabaya.',
      alternates: { canonical: '/id/berita' },
    }
  }
  if (route === 'id/agenda' || route === 'agenda') {
    return {
      title: 'Agenda Kota',
      description: 'Agenda dan pengumuman resmi Kota Surabaya.',
      alternates: { canonical: '/id/agenda' },
    }
  }
  if (media) {
    if (!media.id) return { title: media.type[0].toUpperCase() + media.type.slice(1), alternates:{ canonical:media.pathname } }
    const item = await getWebdisplayMediaDetail(media.type, media.id)
    return {
      title: item?.title || 'Media Kota Surabaya',
      description: item ? descriptionFromHtml(item.content) : 'Media resmi Pemerintah Kota Surabaya.',
      alternates: { canonical:`${media.pathname}/${media.id}/${item?.slug || legacyPath.at(-1)}` },
      openGraph: { title:item?.title, images:item?.image ? [item.image] : undefined },
    }
  }

  const page = await getLegacyRoutePage(legacyPath)
  return {
    title: page.title,
    description: descriptionFromHtml(page.content) || 'Informasi resmi Pemerintah Kota Surabaya.',
    alternates: { canonical: `/${route}` },
    openGraph: {
      type: page.kind === 'news' ? 'article' : 'website',
      title: page.title,
      description: descriptionFromHtml(page.content),
      images: page.image ? [page.image] : undefined,
    },
  }
}

export default async function LegacyCmsPage({ params, searchParams }: LegacyRouteProps) {
  const { legacyPath } = await params
  const query = await searchParams
  const isNewsIndex = legacyPath.join('/') === 'id/berita' || legacyPath.join('/') === 'berita'
  const isAgendaIndex = legacyPath.join('/') === 'id/agenda' || legacyPath.join('/') === 'agenda'
  const media = mediaRoute(legacyPath)

  if (legacyPath.length === 1 && (legacyPath[0] === 'news' || legacyPath[0] === 'pers')) {
    const target = new URLSearchParams()
    if (query.page) target.set('page', query.page)
    if (query.q) target.set('q', query.q)
    redirect(`/id/berita${target.size ? `?${target}` : ''}`)
  }

  if (isNewsIndex) {
    const page = Math.max(1, Number(query.page) || 1)
    const [organization, news] = await Promise.all([getOrganization(), getPaginatedNews(page, 15, query.q || '')])
    return <NewsIndexPage navigation={organization.menu} organization={organization} items={news.items} pagination={news} pathname={`/${legacyPath.join('/')}`} />
  }

  if (isAgendaIndex) {
    const page = Math.max(1, Number(query.page) || 1)
    const [organization, agenda] = await Promise.all([getOrganization(), getPaginatedAgenda(page, 15, query.q || '')])
    return <AgendaIndexPage navigation={organization.menu} organization={organization} items={agenda.items} pagination={agenda} pathname={`/${legacyPath.join('/')}`} />
  }

  if ((legacyPath.length === 1 && legacyPath[0] === 'infografis') || (legacyPath.length === 2 && legacyPath.join('/') === 'id/infografis')) {
    const page = Math.max(1, Number(query.page) || 1)
    const [organization, infographics] = await Promise.all([getOrganization(), getPaginatedInfographics(page, 15, query.q || '')])
    const pathname = `/${legacyPath.join('/')}`
    const mediaList = {
      ...infographics,
      items: infographics.items.map((item) => ({ ...item, contentType:'Infografis', viewCount:0 })),
    }
    return <MediaIndexPage navigation={organization.menu} organization={organization} media={mediaList} type="infografis" pathname={pathname} />
  }

  if (media) {
    if (media.id) {
      const [organization, item] = await Promise.all([getOrganization(), getWebdisplayMediaDetail(media.type, media.id)])
      if (item) return <MediaDetailPage navigation={organization.menu} organization={organization} item={item} pathname={media.pathname} />
      notFound()
    } else {
      const page = Math.max(1, Number(query.page) || 1)
      const [organization, mediaList] = await Promise.all([getOrganization(), getWebdisplayMediaList(media.type, page, media.type === 'podcasts' ? 14 : 15)])
      return <MediaIndexPage navigation={organization.menu} organization={organization} media={mediaList} type={media.type} pathname={media.pathname} />
    }
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
