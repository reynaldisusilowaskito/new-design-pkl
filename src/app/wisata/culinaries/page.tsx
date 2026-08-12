import MainNavbar from '@/components/navigation/MainNavbar'
import TourismExplorer from '@/components/tourism/TourismExplorer'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismContent } from '@/lib/tourism-api'
import styles from '../wisata.module.css'

export const revalidate = 900

export default async function CulinariesPage() {
  const [organization, tourism] = await Promise.all([getOrganization(), getTourismContent()])
  return <main className={styles.page}><MainNavbar navigation={organization.menu} /><TourismExplorer {...tourism} initialView="culinary" /></main>
}
