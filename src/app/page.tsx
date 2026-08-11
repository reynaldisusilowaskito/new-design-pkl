import HeroSection from '@/components/sections/hero/HeroSection'
import AboutSection from '@/components/sections/about/AboutSection'
import InteractiveMapSection from '@/components/sections/map/InteractiveMapSection'
import NewsSection from '@/components/sections/news/NewsSection'
import GovernmentServicesSection from '@/components/sections/services/GovernmentServicesSection'
import VideoShowcaseSection from '@/components/sections/videos/VideoShowcaseSection'
import CityAgendaSection from '@/components/sections/agenda/CityAgendaSection'
import SiteFooter from '@/components/layout/SiteFooter'
import { getCityAgenda, getNews, getOrganization, getServices } from '@/lib/surabaya-api'
import { getCityVideos } from '@/lib/youtube-api'
import { getDistricts } from '@/lib/map-data'
import styles from './page.module.css'

export const revalidate = 60

export default async function HomePage() {
  const [organization, districts, news, services, videos, agenda] = await Promise.all([
    getOrganization(),
    Promise.resolve(getDistricts()),
    getNews('berita', 6),
    getServices(15),
    getCityVideos(6),
    getCityAgenda(6),
  ])

  return (
    <main className={styles.page}>
      <HeroSection navigation={organization.menu} />
      <AboutSection />
      <InteractiveMapSection districts={districts} />
      <NewsSection items={news} />
      <GovernmentServicesSection services={services} />
      <VideoShowcaseSection videos={videos} />
      <CityAgendaSection events={agenda} />
      <SiteFooter organization={organization} />
    </main>
  )
}
