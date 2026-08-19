'use client'

import Link from 'next/link'
import { useExperience } from '@/context/ExperienceContext'
import DetailMapLoader from './DetailMapLoader'
import styles from './HotelDetail.module.css'
import mapStyles from './HotelDetailMap.module.css'

export default function HotelDetail({ item, type='hotel' }) {
  const { language,t }=useExperience()
  const name=language==='en'?item.nameEn:item.nameId
  const description=language==='en'?item.descriptionEn:item.descriptionId
  const gallery=[item.image,...(item.images || [])].filter((image,index,array)=>image&&array.indexOf(image)===index)
  const isHotel=type==='hotel'
  const isCulinary=type==='culinary'
  const listHref=isHotel?'/wisata/hotels':isCulinary?'/wisata/culinaries':'/wisata/destinations'
  const backLabel=isHotel?'Kembali ke daftar hotel':isCulinary?'Kembali ke daftar kuliner':'Kembali ke daftar destinasi'
  const aboutLabel=isHotel?'TENTANG HOTEL':isCulinary?'TENTANG KULINER':'TENTANG DESTINASI'
  const heading=isHotel?'Informasi tempat menginap.':isCulinary?'Informasi kuliner.':'Informasi destinasi.'
  const fallback=isHotel?'Deskripsi hotel belum tersedia.':isCulinary?'Deskripsi kuliner belum tersedia.':'Deskripsi destinasi belum tersedia.'
  const locationLabel=isHotel?'LOKASI HOTEL':isCulinary?'LOKASI KULINER':'LOKASI DESTINASI'
  const categoryLabel=language==='en'
    ? (isHotel?(item.stars?`${item.stars}-STAR HOTEL`:'SURABAYA HOTEL'):isCulinary?'SURABAYA CULINARY':item.category)
    : (isHotel?(item.stars?`HOTEL BINTANG ${item.stars}`:'HOTEL SURABAYA'):isCulinary?'KULINER SURABAYA':item.category)

  return <article className={styles.detail} data-no-auto-translate="true">
    <Link href={listHref} className={styles.back}>← {t(backLabel)}</Link>
    <header className={styles.hero} style={gallery[0]?{backgroundImage:`linear-gradient(90deg,rgba(12,22,38,.88),rgba(12,22,38,.22)),url("${gallery[0]}")`}:undefined}>
      <div><span>{categoryLabel}</span><h1>{name}</h1><p>{item.address}</p></div>
    </header>
    <section className={styles.content}>
      <div className={styles.description}><span>{t(aboutLabel)}</span><h2>{t(heading)}</h2><p>{description || t(fallback)}</p></div>
      <aside>
        {isHotel&&<div><small>{t('Bintang hotel')}</small><strong>{item.stars?(language==='en'?`${item.stars}-star hotel`:`Hotel bintang ${item.stars}`):t('Belum tersedia')}</strong></div>}
        {!isHotel&&<div><small>{t('Kategori')}</small><strong>{categoryLabel}</strong></div>}
        <div><small>{t('Alamat')}</small><strong>{item.address}</strong></div>
        {item.phone&&<div><small>{t('Telepon')}</small><a href={`tel:${item.phone}`}>{item.phone}</a></div>}
        <nav><a href={item.mapsUrl} target="_blank" rel="noreferrer">{t('Buka di peta')} ↗</a>{item.website&&<a href={item.website} target="_blank" rel="noreferrer">{t('Kunjungi website')} ↗</a>}</nav>
      </aside>
    </section>
    {item.latitude!==null&&item.longitude!==null&&<section className={mapStyles.mapSection}><div><span>{t(locationLabel)}</span><h2>{t('Temukan lokasinya.')}</h2></div><DetailMapLoader latitude={item.latitude} longitude={item.longitude} name={name} address={item.address} language={language}/><p>{item.address} · {item.latitude}, {item.longitude}</p></section>}
  </article>
}
