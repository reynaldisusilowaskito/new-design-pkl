'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useExperience } from '@/context/ExperienceContext'
import { EVENT_CATEGORIES } from '@/lib/tourism-event'
import styles from './TourismEvent.module.css'

const PAGE_SIZE = 9
const eventStatus = (event) => {
  const now = new Date()
  const start = new Date(event.startDate)
  const end = new Date(event.endDate || event.startDate)
  if (!Number.isFinite(start.getTime())) return 'upcoming'
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  if (now < start) return 'upcoming'
  if (now <= end) return 'ongoing'
  return 'past'
}

const dateRange = (event, language) => {
  const locale = language === 'en' ? 'en-US' : 'id-ID'
  const format = (value) => {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(locale, { day:'numeric', month:'long', year:'numeric' }).format(date) : '-'
  }
  const start = format(event.startDate)
  const end = format(event.endDate)
  return !event.endDate || start === end ? start : `${start} – ${end}`
}

export default function TourismEventList({ events = [] }) {
  const { language, t } = useExperience()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const rank = { ongoing:0, upcoming:1, past:2 }
    return events.filter((event) => {
      const matchesQuery = !needle || `${event.nameId} ${event.nameEn} ${event.organizer} ${event.address} ${event.descriptionId}`.toLowerCase().includes(needle)
      return matchesQuery && (category === 'all' || event.categoryIds.includes(category))
    }).sort((a, b) => rank[eventStatus(a)] - rank[eventStatus(b)] || new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [category, events, query])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const activePage = Math.min(page, pageCount)
  const visibleEvents = filtered.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE)
  const statusLabel = { ongoing:t('Sedang berlangsung'), upcoming:t('Akan datang'), past:t('Sudah berakhir') }

  return <section className={styles.listPage}>
    <header className={styles.listHero}>
      <Link href="/wisata">← {t('Kembali ke wisata')}</Link>
      <span>AGENDA KOTA</span>
      <h1>{t('Event di Surabaya.')}</h1>
      <p>{t('Temukan festival, pameran, pertunjukan, dan kegiatan pilihan di Kota Surabaya.')}</p>
    </header>
    <div className={styles.filters}>
      <label><span>{t('Cari event')}</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder={t('Nama, penyelenggara, atau lokasi...')} /></label>
      <label><span>{t('Kategori')}</span><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}><option value="all">{t('Semua kategori')}</option>{Object.entries(EVENT_CATEGORIES).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      <strong>{filtered.length} {t('event')}</strong>
    </div>
    <div className={styles.grid}>
      {visibleEvents.map((event) => {
        const status = eventStatus(event)
        const title = language === 'en' ? event.nameEn : event.nameId
        return <article className={`${styles.card} ${styles[status]}`} key={event.id}>
          <Link href={event.detailUrl} className={styles.cardLink} aria-label={`${t('Lihat detail')} ${title}`} />
          <div className={styles.image} style={event.image ? { backgroundImage:`linear-gradient(180deg,transparent,rgba(10,18,31,.76)),url("${event.image}")` } : undefined}><span>{statusLabel[status]}</span></div>
          <div className={styles.cardBody}><small>{event.categoryIds.map((id) => EVENT_CATEGORIES[id]).join(' · ') || EVENT_CATEGORIES['8']}</small><h2>{title}</h2><p>{dateRange(event, language)}</p><p>{event.address}</p><b>{event.organizer}</b></div>
        </article>
      })}
    </div>
    {!visibleEvents.length && <p className={styles.empty}>{t('Event tidak ditemukan. Coba ubah filter atau kata kunci.')}</p>}
    {pageCount > 1 && <nav className={styles.pagination} aria-label={t('Navigasi halaman')}><button type="button" onClick={() => setPage(Math.max(1, activePage - 1))} disabled={activePage === 1}>←</button>{Array.from({ length:pageCount }, (_, index) => index + 1).map((value) => <button type="button" className={value === activePage ? styles.currentPage : ''} onClick={() => setPage(value)} aria-current={value === activePage ? 'page' : undefined} key={value}>{value}</button>)}<button type="button" onClick={() => setPage(Math.min(pageCount, activePage + 1))} disabled={activePage === pageCount}>→</button></nav>}
  </section>
}
