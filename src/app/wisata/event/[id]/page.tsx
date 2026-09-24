import { notFound } from 'next/navigation'
import TourismPageShell from '@/components/tourism/TourismPageShell'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismEvents } from '@/lib/tourism-api'

export const revalidate = 900

export default async function EventDetailPage({ params }: PageProps<'/wisata/event/[id]'>) {
  const { id } = await params
  const [organization, events] = await Promise.all([getOrganization(), getTourismEvents()])
  const event = events.find((item) => item.id === decodeURIComponent(id))
  if (!event) notFound()

  return <TourismPageShell navigation={organization.menu} eventItem={event} view="event-detail" />
}
