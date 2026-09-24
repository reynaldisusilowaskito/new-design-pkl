'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useExperience } from '@/context/ExperienceContext'
import styles from './NewsIndexPage.module.css'
import controls from './PaginationControls.module.css'
import canvas from './DefaultContentCanvas.module.css'

const fallbackImage = '/assets/redesign/hero/kota-lama-surabaya-2d-full.webp'

function formatDate(value, language) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return language === 'en' ? 'Latest' : 'Terbaru'
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta',
  }).format(date)
}

function CardImage({ item, priority = false }) {
  const [failed, setFailed] = useState(false)
  return <Image src={!item.image || failed ? fallbackImage : item.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized priority={priority} onError={() => setFailed(true)} />
}

const pageHref = (pathname, page, search) => {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (search) params.set('q', search)
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

/** @param {{ navigation: import('@/lib/surabaya-api').NavigationItem[], organization: import('@/lib/surabaya-api').Organization, items: import('@/lib/surabaya-api').NewsItem[], pagination: import('@/lib/surabaya-api').PaginatedResult<import('@/lib/surabaya-api').NewsItem>, pathname: string }} props */
export default function NewsIndexPage({ navigation, organization, items, pagination, pathname }) {
  const { t, language } = useExperience()
  const [category, setCategory] = useState('Semua')
  const categories = useMemo(() => ['Semua', ...new Set(items.map((item) => item.category).filter(Boolean))], [items])
  const visibleItems = useMemo(() => items.filter((item) => category === 'Semua' || item.category === category), [category, items])
  const pageNumbers = Array.from({ length:pagination.lastPage }, (_, index) => index + 1).filter((page) => page === 1 || page === pagination.lastPage || Math.abs(page - pagination.page) <= 2)

  return (
    <main className={`${styles.page} ${canvas.page}`}>
      <MainNavbar navigation={navigation} />
      <header className={`${styles.hero} ${canvas.hero}`}>
        <Link className="content-index-back" href="/#kabar"><span aria-hidden="true">←</span> {t('Kembali ke beranda')}</Link>
        <div><span>BERITA RESMI / SURABAYA</span><h1>{t('Kabar kota,')}<br /><em>{t('langsung dari sumbernya.')}</em></h1></div>
        <p>{t('Kebijakan, pembangunan, pelayanan publik, dan aktivitas warga dalam satu ruang yang mudah dijelajahi.')}</p>
      </header>

      <section className={styles.browser} aria-labelledby="news-list-title">
        <div className={styles.toolbar}>
          <div><span>BERITA</span><h2 id="news-list-title">{t('Terbaru')}</h2></div>
          <form className={controls.searchForm} action={pathname} method="get"><label><span aria-hidden="true">⌕</span><input name="q" defaultValue={pagination.search} maxLength={100} placeholder={t('Cari berita...')} /><b>{pagination.total}</b></label><button type="submit">{t('Cari')}</button></form>
        </div>
        <div className={styles.filters} aria-label={t('Filter kategori berita')}>
          {categories.map((item) => <button type="button" className={category === item ? styles.active : ''} onClick={() => setCategory(item)} key={item}>{t(item)}</button>)}
        </div>

        {visibleItems.length ? <div className={styles.grid}>
          {visibleItems.map((item, index) => (
            <Link href={item.url} className={`${styles.card} ${index === 0 ? styles.featured : ''}`} key={item.id}>
              <div className={styles.visual}><CardImage item={item} priority={index === 0} /><span>0{index + 1}</span></div>
              <div className={styles.copy}><div><b>{t(item.category)}</b><time>{formatDate(item.publishedAt, language)}</time></div><h3>{t(item.title)}</h3>{item.excerpt && <p>{t(item.excerpt)}</p>}<strong>{t('Baca berita')} <i aria-hidden="true">↗</i></strong></div>
            </Link>
          ))}
        </div> : <div className={styles.empty}><strong>{t('Berita tidak ditemukan')}</strong><p>{t('Coba gunakan kata kunci atau kategori lain.')}</p></div>}
        {pagination.lastPage > 1 && <nav className={controls.pagination} aria-label={t('Navigasi halaman')}>{pagination.page > 1 && <Link href={pageHref(pathname, pagination.page - 1, pagination.search)}>← {t('Sebelumnya')}</Link>}{pageNumbers.map((page, index) => <span key={page}>{index > 0 && pageNumbers[index - 1] !== page - 1 && <i>…</i>}<Link className={page === pagination.page ? controls.currentPage : ''} aria-current={page === pagination.page ? 'page' : undefined} href={pageHref(pathname, page, pagination.search)}>{page}</Link></span>)}{pagination.page < pagination.lastPage && <Link href={pageHref(pathname, pagination.page + 1, pagination.search)}>{t('Selanjutnya')} →</Link>}</nav>}
      </section>
      <SiteFooter organization={organization} />
    </main>
  )
}
