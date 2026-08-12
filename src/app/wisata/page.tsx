import MainNavbar from '@/components/navigation/MainNavbar'
import TourismLanding from '@/components/tourism/TourismLanding'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismContent } from '@/lib/tourism-api'
import styles from './wisata.module.css'

export const revalidate = 900

export default async function TourismPage() {
  const [organization, tourism] = await Promise.all([getOrganization(), getTourismContent()])
  return <main className={styles.page}><MainNavbar navigation={organization.menu} /><TourismLanding {...tourism} /></main>
}
