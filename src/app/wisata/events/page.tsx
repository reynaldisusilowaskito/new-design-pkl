import TourismPageShell from '@/components/tourism/TourismPageShell'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismEvents } from '@/lib/tourism-api'

export const revalidate = 900

export default async function EventsPage() {
  const [organization, events] = await Promise.all([getOrganization(), getTourismEvents()])
  return <TourismPageShell navigation={organization.menu} events={events} view="events" />
}
