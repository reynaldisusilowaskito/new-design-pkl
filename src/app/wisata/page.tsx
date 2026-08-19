import TourismPageShell from '@/components/tourism/TourismPageShell'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismContent } from '@/lib/tourism-api'

export const revalidate = 900

export default async function TourismPage() {
  const [organization, tourism] = await Promise.all([getOrganization(), getTourismContent()])
  return <TourismPageShell navigation={organization.menu} tourism={tourism} organization={organization} />
}
