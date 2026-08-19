import { notFound } from 'next/navigation'
import TourismPageShell from '@/components/tourism/TourismPageShell'
import { getOrganization } from '@/lib/surabaya-api'
import { getTourismContent } from '@/lib/tourism-api'

export const revalidate=900

export default async function CulinaryDetailPage({params}:PageProps<'/wisata/culinaries/[id]'>){
  const {id}=await params
  const [organization,tourism]=await Promise.all([getOrganization(),getTourismContent()])
  const culinary=tourism.culinaries.find(item=>item.id===decodeURIComponent(id))
  if(!culinary)notFound()
  return <TourismPageShell navigation={organization.menu} detailItem={culinary} detailType="culinary" view="detail" />
}
