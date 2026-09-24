import { notFound } from 'next/navigation'
import TourismPageShell from '@/components/tourism/TourismPageShell'
import { getOrganization } from '@/lib/surabaya-api'
import { getFallbackHotel, getTourismContent } from '@/lib/tourism-api'

export const revalidate=900

export default async function HotelDetailPage({params}:PageProps<'/wisata/hotels/[id]'>){
  const {id}=await params
  const [organization,tourism]=await Promise.all([getOrganization(),getTourismContent()])
  const decodedId=decodeURIComponent(id)
  const hotel=tourism.hotels.find(item=>item.id===decodedId) || getFallbackHotel(decodedId)
  if(!hotel)notFound()
  return <TourismPageShell navigation={organization.menu} detailItem={hotel} detailType="hotel" view="detail" />
}
