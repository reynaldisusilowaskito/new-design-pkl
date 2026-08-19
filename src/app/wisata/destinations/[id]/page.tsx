import { notFound } from 'next/navigation'
import TourismPageShell from '@/components/tourism/TourismPageShell'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismContent } from '@/lib/tourism-api'

export const revalidate=900

export default async function DestinationDetailPage({params}:PageProps<'/wisata/destinations/[id]'>){
  const {id}=await params
  const [organization,tourism]=await Promise.all([getOrganization(),getTourismContent()])
  const destination=tourism.destinations.find(item=>item.id===decodeURIComponent(id))
  if(!destination)notFound()
  return <TourismPageShell navigation={organization.menu} detailItem={destination} detailType="destination" view="detail" />
}
