import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import TourismLanding from './TourismLanding'
import TourismExplorer from './TourismExplorer'
import HotelDetail from './HotelDetail'
import TourismEventList from './TourismEventList'
import TourismEventDetail from './TourismEventDetail'
import styles from './TourismPageShell.module.css'

/**
 * Shared visual shell for every tourism route.
 * @param {{ navigation: unknown[], tourism?: Record<string, unknown>, organization?: unknown, detailItem?: import('@/lib/tourism-api').TourismItem | null, detailType?: 'hotel'|'culinary'|'destination', hotel?: import('@/lib/tourism-api').TourismItem | null, events?: import('@/lib/tourism-api').TourismEvent[], eventItem?: import('@/lib/tourism-api').TourismEvent | null, view?: string }} props
 */
export default function TourismPageShell({ navigation, tourism = {}, organization = null, detailItem = null, detailType = 'hotel', hotel = null, events = [], eventItem = null, view = 'landing' }) {
  return (
    <main className={styles.page}>
      <div className={styles.bubbleLayer} aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <MainNavbar navigation={navigation} />
      {view === 'landing'
        ? <TourismLanding {...tourism} />
        : view === 'events'
          ? <TourismEventList events={events} />
          : view === 'event-detail'
            ? <TourismEventDetail event={eventItem} />
        : view === 'detail' || view === 'hotel-detail'
          ? <HotelDetail item={detailItem || hotel} type={view === 'hotel-detail' ? 'hotel' : detailType} />
          : <TourismExplorer {...tourism} initialView={view} />}
      {view === 'landing' && organization && <SiteFooter organization={organization} />}
    </main>
  )
}
