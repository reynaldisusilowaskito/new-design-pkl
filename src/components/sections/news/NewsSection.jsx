'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useExperience } from '@/context/ExperienceContext'
import styles from './NewsSection.module.css'

const NEWS_URL = '/id/berita'
function formatDate(value, language) {
  if (!value) return 'Terbaru'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? (language === 'en' ? 'Latest' : 'Terbaru') : new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Jakarta' }).format(date)
}

function NewsImage({ item, sizes }) {
  const [failed, setFailed] = useState(false)
  const source = !item.image || failed ? '/assets/redesign/hero/kota-lama-surabaya-2d-full.png' : item.image
  return (
    <Image
      src={source}
      alt=""
      fill
      sizes={sizes}
      unoptimized
      onError={() => { if (!failed) setFailed(true) }}
    />
  )
}

/** @param {{ items?: import('@/lib/surabaya-api').NewsItem[] }} props */
export default function NewsSection({ items = [] }) {
  const { t, language } = useExperience()
  const transitionRef = useRef(null)
  const categories = useMemo(
    () => ['Semua', ...new Set(items.map((item) => item.category).filter(Boolean))],
    [items],
  )
  const [activeCategory, setActiveCategory] = useState('Semua')
  const visibleItems = activeCategory === 'Semua'
    ? items
    : items.filter((item) => item.category === activeCategory)
  const [featured, ...moreNews] = visibleItems

  useEffect(() => {
    const transition = transitionRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!transition || reduceMotion.matches) return undefined

    let frame
    const updateTransition = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = transition.getBoundingClientRect()
        const distance = Math.max(1, bounds.height - window.innerHeight * 0.2)
        const progress = Math.min(0.68, Math.max(0, -bounds.top / distance))
        transition.style.setProperty('--news-progress', progress.toFixed(4))
      })
    }

    updateTransition()
    window.addEventListener('scroll', updateTransition, { passive: true })
    window.addEventListener('resize', updateTransition)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateTransition)
      window.removeEventListener('resize', updateTransition)
    }
  }, [])

  return (
    <section className={styles.news} id="kabar" aria-labelledby="news-title">
      <div className={styles.transitionHero} ref={transitionRef}>
        <div className={styles.transitionMeta}>
          <span>04 / {t('Berita')}</span><span>{t('PEMERINTAH KOTA SURABAYA')}</span>
        </div>
        <div className={styles.transitionIntro}>
          <div className={styles.sourceMarks} aria-hidden="true"><i>SBY</i><i>GO</i><i>ID</i></div>
          <p>{t('Informasi aktual dan terverifikasi')}<br />{t('dari setiap sudut Kota Surabaya.')}</p>
        </div>
        <div className={styles.sun} aria-hidden="true" />
        <p className={styles.dailyLabel}>{t('Surabaya Hari Ini')}</p>
        <h2>{t('KABAR KOTA')}</h2>
        <div className={styles.scrollCue}><span>SCROLL UNTUK MEMBACA</span><i /></div>
      </div>

      <div className={styles.ticker} aria-hidden="true">
        <p>BERITA TERBARU <span>●</span> INFORMASI TERVERIFIKASI <span>●</span> SURABAYA HARI INI <span>●</span> BERITA TERBARU <span>●</span> INFORMASI TERVERIFIKASI <span>●</span> SURABAYA HARI INI</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTop}>
          <p><span>04</span> {t('Kabar kota')}</p><p><i /> {t('Sumber resmi Pemerintah Kota Surabaya')}</p>
        </div>
        <div className={styles.headingRow}>
          <div><p className={styles.eyebrow}>{t('Berita terbaru')}</p><h2 id="news-title">{t('Yang terjadi')}<br /><em>{t('di Surabaya.')}</em></h2></div>
          <div className={styles.headingCopy}>
            <p>{t('Informasi aktual tentang kebijakan, pembangunan, pelayanan publik, dan kehidupan warga.')}</p>
            <Link href={NEWS_URL}>{t('Lihat seluruh berita')} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        {categories.length > 2 && (
          <div className={styles.filters} aria-label="Filter kategori berita">
            {categories.map((category) => (
              <button className={activeCategory === category ? styles.activeFilter : ''} onClick={() => setActiveCategory(category)} type="button" key={category}>{t(category)}</button>
            ))}
          </div>
        )}

        {featured ? (
          <div className={styles.newsLayout}>
            <Link className={styles.featured} href={featured.url}>
              <div className={styles.featuredImage}><NewsImage item={featured} sizes="(max-width: 980px) 100vw, 55vw" /><span className={styles.imageIndex}>01 / UTAMA</span></div>
              <div className={styles.featuredBody}>
                <div className={styles.meta}><span>{t(featured.category)}</span><time>{formatDate(featured.publishedAt, language)}</time></div>
                <h3>{t(featured.title)}</h3>
                {featured.excerpt && <p>{t(featured.excerpt)}</p>}
                <div className={styles.readMore}>{t('Baca selengkapnya')} <span aria-hidden="true">↗</span></div>
              </div>
            </Link>
            <div className={styles.newsList}>
              {moreNews.map((item, index) => (
                <Link href={item.url} key={item.id}>
                  <span className={styles.listIndex}>{String(index + 2).padStart(2, '0')}</span>
                  <div className={styles.listImage}><NewsImage item={item} sizes="132px" /></div>
                  <div className={styles.listCopy}><div className={styles.meta}><span>{t(item.category)}</span><time>{formatDate(item.publishedAt, language)}</time></div><h3>{t(item.title)}</h3></div>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        ) : <p className={styles.emptyState}>Berita resmi sedang disiapkan. Silakan buka kanal berita Pemerintah Kota Surabaya.</p>}

      </div>
    </section>
  )
}
