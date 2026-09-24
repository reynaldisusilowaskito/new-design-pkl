'use client'

import Link from 'next/link'
import { useExperience } from '@/context/ExperienceContext'
import { EVENT_CATEGORIES } from '@/lib/tourism-event'
import DetailMapLoader from './DetailMapLoader'
import mapStyles from './HotelDetailMap.module.css'
import styles from './TourismEvent.module.css'

const formatDate = (value, language) => {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return '-'
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(date)
}

export default function TourismEventDetail({ event }) {
  const { language, t } = useExperience()
  const name = language === 'en' ? event.nameEn : event.nameId
  const description = language === 'en' ? event.descriptionEn : event.descriptionId
  const categories = event.categoryIds.map((id) => EVENT_CATEGORIES[id]).join(' · ') || EVENT_CATEGORIES['8']

  return <article className={styles.detailPage} data-no-auto-translate="true">
    <Link href="/wisata/events" className={styles.back}>← {t('Kembali ke daftar event')}</Link>
    <header className={styles.detailHero} style={event.image ? { backgroundImage:`linear-gradient(90deg,rgba(12,22,38,.9),rgba(12,22,38,.28)),url("${event.image}")` } : undefined}>
      <div><span>{categories}</span><h1>{name}</h1><p>{event.organizer}</p></div>
    </header>
    <section className={styles.detailContent}>
      <div><span>{t('TENTANG EVENT')}</span><h2>{t('Informasi kegiatan.')}</h2><p>{description || t('Deskripsi event belum tersedia.')}</p></div>
      <aside><div><small>{t('Mulai')}</small><strong>{formatDate(event.startDate, language)}</strong></div><div><small>{t('Selesai')}</small><strong>{formatDate(event.endDate, language)}</strong></div><div><small>{t('Penyelenggara')}</small><strong>{event.organizer}</strong></div><div><small>{t('Alamat')}</small><strong>{event.address}</strong></div><nav><a href={event.mapsUrl} target="_blank" rel="noreferrer">{t('Buka di peta')} ↗</a></nav></aside>
    </section>
    {event.latitude !== null && event.longitude !== null && <section className={mapStyles.mapSection}><div><span>{t('LOKASI EVENT')}</span><h2>{t('Temukan lokasinya.')}</h2></div><DetailMapLoader latitude={event.latitude} longitude={event.longitude} name={name} address={event.address} language={language}/><p>{event.address} · {event.latitude}, {event.longitude}</p></section>}
  </article>
}
