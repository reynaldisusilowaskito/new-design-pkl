'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useExperience } from '@/context/ExperienceContext'
import styles from './AgendaIndexPage.module.css'
import controls from './PaginationControls.module.css'
import canvas from './DefaultContentCanvas.module.css'

const fallbackImage = '/assets/redesign/hero/alun-alun-surabaya.jpg'

function dateParts(value, language) {
  const parsed = new Date(value)
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { month:'short' }).format(date).replace('.', '').toUpperCase(),
    year: String(date.getFullYear()),
    full: new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { day:'numeric', month:'long', year:'numeric' }).format(date),
  }
}

function AgendaPhoto({ item, priority }) {
  const [failed, setFailed] = useState(false)
  return <Image src={!item.image || failed ? fallbackImage : item.image} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized priority={priority} onError={() => setFailed(true)} />
}

const pageHref = (pathname, page, search) => {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (search) params.set('q', search)
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

/** @param {{ navigation: import('@/lib/surabaya-api').NavigationItem[], organization: import('@/lib/surabaya-api').Organization, items: import('@/lib/surabaya-api').CityAgendaItem[], pagination: import('@/lib/surabaya-api').PaginatedResult<import('@/lib/surabaya-api').CityAgendaItem>, pathname: string }} props */
export default function AgendaIndexPage({ navigation, organization, items, pagination, pathname }) {
  const { t, language } = useExperience()
  const [category, setCategory] = useState('Semua')
  const categories = useMemo(() => ['Semua', ...new Set(items.map((item) => item.category).filter(Boolean))], [items])
  const visibleItems = useMemo(() => items.filter((item) => category === 'Semua' || item.category === category), [category, items])
  const pageNumbers = Array.from({ length:pagination.lastPage }, (_, index) => index + 1).filter((page) => page === 1 || page === pagination.lastPage || Math.abs(page - pagination.page) <= 2)

  return <main className={`${styles.page} ${canvas.page}`}>
    <MainNavbar navigation={navigation} />
    <header className={`${styles.hero} ${canvas.hero}`}><Link className="content-index-back" href="/#agenda-kota"><span aria-hidden="true">←</span> {t('Kembali ke beranda')}</Link><div><span>KALENDER RESMI / SURABAYA</span><h1>{t('Agenda kota,')}<br/><em>{t('jelas dalam satu tempat.')}</em></h1></div><p>{t('Pengumuman, kegiatan pemerintah, dan informasi penting warga yang tersusun agar mudah ditemukan.')}</p></header>
    <section className={styles.browser} aria-labelledby="agenda-index-title">
      <div className={styles.toolbar}><div><span>AGENDA KOTA</span><h2 id="agenda-index-title">{t('Semua agenda')}</h2></div><form className={controls.searchForm} action={pathname} method="get"><label><span aria-hidden="true">⌕</span><input name="q" defaultValue={pagination.search} maxLength={100} placeholder={t('Cari agenda...')}/><b>{pagination.total}</b></label><button type="submit">{t('Cari')}</button></form></div>
      <div className={styles.filters}>{categories.map((item)=><button className={category===item?styles.active:''} onClick={()=>setCategory(item)} type="button" key={item}>{t(item)}</button>)}</div>
      {visibleItems.length ? <div className={styles.grid}>{visibleItems.map((item,index)=>{const date=dateParts(item.publishedAt,language);return <Link className={`${styles.card} ${index===0?styles.featured:''}`} href={item.url} key={item.id}><div className={styles.visual}><AgendaPhoto item={item} priority={index===0}/><span>{t(item.status)}</span></div><div className={styles.date}><strong>{date.day}</strong><span>{date.month}<br/>{date.year}</span></div><div className={styles.copy}><div><b>{t(item.category)}</b><time>{date.full}</time></div><h3>{t(item.title)}</h3><p>{t(item.location)}</p><strong>{t('Lihat detail')} <i>↗</i></strong></div></Link>})}</div>:<div className={styles.empty}><strong>{t('Agenda tidak ditemukan')}</strong><p>{t('Coba gunakan kata kunci atau kategori lain.')}</p></div>}
      {pagination.lastPage > 1 && <nav className={controls.pagination} aria-label={t('Navigasi halaman')}>{pagination.page > 1 && <Link href={pageHref(pathname, pagination.page - 1, pagination.search)}>← {t('Sebelumnya')}</Link>}{pageNumbers.map((page, index) => <span key={page}>{index > 0 && pageNumbers[index - 1] !== page - 1 && <i>…</i>}<Link className={page === pagination.page ? controls.currentPage : ''} aria-current={page === pagination.page ? 'page' : undefined} href={pageHref(pathname, page, pagination.search)}>{page}</Link></span>)}{pagination.page < pagination.lastPage && <Link href={pageHref(pathname, pagination.page + 1, pagination.search)}>{t('Selanjutnya')} →</Link>}</nav>}
    </section>
    <SiteFooter organization={organization}/>
  </main>
}
