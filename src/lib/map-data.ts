import demography from '@/data/demografi.surabaya.json'

export type SurabayaDistrict = {
  name: string
  key: string
  data: (typeof demography)[keyof typeof demography]
}

const titleCase = (value: string) => value.toLowerCase().split(' ').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')

export const getDistricts = (): SurabayaDistrict[] => Object.entries(demography).map(([key, data]) => ({
  name: titleCase(key),
  key,
  data,
}))
