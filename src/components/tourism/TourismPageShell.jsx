import MainNavbar from '@/components/navigation/MainNavbar'
import TourismLanding from './TourismLanding'
import TourismExplorer from './TourismExplorer'
import styles from './TourismPageShell.module.css'

/** Shared visual shell for every tourism route. */
export default function TourismPageShell({ navigation, tourism, view = 'landing' }) {
  return (
    <main className={styles.page}>
      <MainNavbar navigation={navigation} />
      {view === 'landing'
        ? <TourismLanding {...tourism} />
        : <TourismExplorer {...tourism} initialView={view} />}
    </main>
  )
}
