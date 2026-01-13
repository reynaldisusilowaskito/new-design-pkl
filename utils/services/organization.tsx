import axiosConfig from 'utils/axios.config'
import { filter } from 'lodash'

function replaceKeysDeep(menu) {
  if (menu.title === 'Child Friendly Initiative' || menu.title === 'Transportasi') {
    console.log('fufud', menu)
  }
  return {
    title: menu.value,
    url: menu.linkUrl,
    icon: menu.logoUrl,
    order: menu.order,
    child: menu?.subMenus?.length ? menu.subMenus.map((item) => replaceKeysDeep(item)) : [],
  }
}

// Default fallback menu for development
const defaultMenuFallback = [
  {
    title: 'MENGENAL SURABAYA',
    url: '#',
    icon: null,
    order: 1,
    child: [
      {
        title: 'Tentang Surabaya',
        url: '/page/0/1/sekilas-tentang-surabaya',
        icon: null,
        order: 1,
        child: [],
      },
      {
        title: 'Pemerintahan',
        url: '#',
        icon: null,
        order: 2,
        child: [],
      },
      {
        title: 'Ada Apa di Surabaya',
        url: '#',
        icon: null,
        order: 3,
        child: [],
      },
    ],
  },
  {
    title: 'LAYANAN PUBLIK',
    url: '#',
    icon: null,
    order: 2,
    child: [
      {
        title: 'Pengaduan Masyarakat',
        url: '#',
        icon: null,
        order: 1,
        child: [],
      },
      {
        title: 'Perizinan',
        url: '#',
        icon: null,
        order: 2,
        child: [],
      },
    ],
  },
  {
    title: 'INFORMASI PUBLIK',
    url: '#',
    icon: null,
    order: 3,
    child: [],
  },
  {
    title: 'TRANSPARANSI',
    url: '#',
    icon: null,
    order: 4,
    child: [],
  },
  {
    title: 'PPID',
    url: '#',
    icon: null,
    order: 5,
    child: [],
  },
  {
    title: 'APEKSI',
    url: '#',
    icon: null,
    order: 6,
    child: [],
  },
]

export const getOrganization = async () => {
  return await axiosConfig(true)
    .get(`public/${process.env.SURABAYA_SLUG}`)
    .then((response) => {
      const { data } = response.data
      const footer = filter(data?.attributes, { type: 'footer' })
      const sosmed = filter(data?.attributes, { type: 'sosmed' })
      return data
        ? {
          contact_title: data.contactTitle || null,
          address: data.address || null,
          whatsapp: data.whatsapp || null,
          phone_number: data.phoneNumber || null,
          social_media_title: data.socialMediaTitle || null,
          instagram: data.instagram || null,
          youtube: data.youtube || null,
          twitter: data.twitter || null,
          facebook: data.facebook || null,
          tiktok: data.tiktok || null,
          menu: data?.menus?.length ? data.menus.map((item) => replaceKeysDeep(item)) : defaultMenuFallback,
          footer: footer?.length ? footer.map((item) => {
            return {
              title: item.value || null,
              description: item.description || null,
              icon: item.imageUrl || null,
            }
          }) : [],
          social_media: sosmed?.length ? sosmed.map((item) => {
            return {
              title: item.value || null,
              url: item.description || null,
              icon: item.imageUrl || null,
            }
          }) : [],
          sliders: data.carousels?.length
            ? data.carousels.map((item) => {
              return {
                title: item.title,
                feature_image: `images/sliders/slider_${data.id}/${item.imageUrl}`,
              }
            })
            : null,
        }
        : {
          // Fallback ketika API tidak mengembalikan data
          contact_title: null,
          address: null,
          whatsapp: null,
          phone_number: null,
          social_media_title: null,
          instagram: null,
          youtube: null,
          twitter: null,
          facebook: null,
          tiktok: null,
          menu: defaultMenuFallback,
          footer: [],
          social_media: [],
          sliders: null,
        }
    })
    .catch((err: any) => {
      console.log('Getting Error from API, using fallback menu:', err.message)
      // Return fallback data when API fails
      return {
        contact_title: null,
        address: null,
        whatsapp: null,
        phone_number: null,
        social_media_title: null,
        instagram: null,
        youtube: null,
        twitter: null,
        facebook: null,
        tiktok: null,
        menu: defaultMenuFallback,
        footer: [],
        social_media: [],
        sliders: null,
      }
    })
}
