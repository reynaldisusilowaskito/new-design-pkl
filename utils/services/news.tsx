import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import axiosConfig from 'utils/axios.config'
import schema from 'types/schemas'
dayjs.extend(utc)
dayjs.extend(timezone)

async function getCount(search: string, category: string) {
  return await axiosConfig(true)
    .get(
      `public/${process.env.SURABAYA_SLUG}/post/${
        category ? `${category}` : ''
      }/count?search=${search}`
    )
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return null
    })
}

export const getDetail = async (
  slug: string,
  category: string
): Promise<schema['schemas']['Article']> => {
  const getData: schema['schemas']['Article'] = await axiosConfig(true)
    .get(`public/${process.env.SURABAYA_SLUG}/post/${category || ''}/${slug || ''}`)
    .then((response) => {
      const { data } = response?.data
      return {
        id: data.id,
        title: data.title,
        feature_image_url: data.featureImageUrl,
        publish_date:
          data.publishDate && data.publishDate.Valid
            ? dayjs.tz(dayjs(data.publishDate.Time), 'Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ssZ')
            : '',
        slug: data.slug,
        view_count: data.viewsCount,
        details: data.postDetails?.length
          ? data.postDetails.map((detail) => {
              return {
                page: detail.page,
                content: detail.content,
              }
            })
          : [],
      }
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return null
    })
  return getData
}

// Fallback data untuk development/testing
const fallbackNewsData = [
  {
    id: 1,
    title: 'Berita Terbaru Kota Surabaya',
    feature_image_url: '/images/Agenda/kegiatanmenanampohon.webp',
    publish_date: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    slug: 'berita-terbaru-1',
    view_count: 0,
    details: [],
    content: 'Konten berita',
  },
  {
    id: 2,
    title: 'Perkembangan Pembangunan Surabaya',
    feature_image_url: '/images/Agenda/PembangunanSurabaya.webp',
    publish_date: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    slug: 'berita-terbaru-2',
    view_count: 0,
    details: [],
    content: 'Konten berita',
  },
]

export const getNews = async (
  page: number = 1,
  search: string = '',
  limit: number = 10,
  category: string = ''
) => {
  const endpoint = `public/${process.env.SURABAYA_SLUG}/post/${
    category ? `${category}` : ''
  }?limit=${limit}&page=${page}&search=${search}&orderColumn=publish_date&orderBy=desc`
  
  console.log('[getNews] Fetching from endpoint:', endpoint)
  console.log('[getNews] Base URL:', process.env.BASE_API_URL)
  
  const getData = await axiosConfig(true)
    .get(endpoint)
    .then(async (response) => {
      console.log('[getNews] API Response:', response.data)
      const { data } = response.data
      return data?.length
        ? await Promise.all(
            data.map(async (item) => {
              const detail = await getDetail(item.slug, category)
              return {
                id: item.id,
                title: item.title,
                feature_image_url: item.featureImageUrl,
                publish_date:
                  item.publishDate && item.publishDate.Valid
                    ? dayjs
                        .tz(dayjs(item.publishDate.Time), 'Asia/Jakarta')
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                    : '',
                slug: item.slug,
                view_count: item.viewsCount,
                details: item.postDetails?.length
                  ? item.postDetails.map((detail) => {
                      return {
                        page: detail.page,
                        content: detail?.content || '',
                      }
                    })
                  : [],
                content:
                  detail?.details && detail?.details.length ? detail?.details[0].content : '',
              }
            })
          )
        : []
    })
    .catch((err: any) => {
      console.error('[getNews] API Error:', {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        statusText: err.response?.statusText,
      })
      console.warn('[getNews] Using fallback data')
      return fallbackNewsData
    })
  
  const count = await getCount(search, category)
  console.log('[getNews] Final data length:', getData.length)
  return { data: getData, count }
}
