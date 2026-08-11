'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './NewsSection.module.css'

const NEWS_URL = 'https://www.surabaya.go.id/id/berita'
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

function formatDate(value) {
  if (!value) return 'Terbaru'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Terbaru' : dateFormatter.format(date)
}

function NewsImage({ item, sizes }) {
  if (!item.image) return <span aria-hidden="true" />
  return <Image src={item.image} alt="" fill sizes={sizes} />
}

/** @param {{ items?: import('@/lib/surabaya-api').NewsItem[] }} props */
export default function NewsSection({ items = [] }) {
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
        const progress = Math.min(1, Math.max(0, -bounds.top / distance))
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
          <span>04 / BERITA</span><span>PEMERINTAH KOTA SURABAYA</span>
        </div>
        <div className={styles.transitionIntro}>
          <div className={styles.sourceMarks} aria-hidden="true"><i>SBY</i><i>GO</i><i>ID</i></div>
          <p>Informasi aktual dan terverifikasi<br />dari setiap sudut Kota Surabaya.</p>
        </div>
        <div className={styles.sun} aria-hidden="true" />
        <p className={styles.dailyLabel}>Surabaya Hari Ini</p>
        <h2>KABAR KOTA</h2>
        <div className={styles.scrollCue}><span>SCROLL UNTUK MEMBACA</span><i /></div>
      </div>

      <div className={styles.ticker} aria-hidden="true">
        <p>BERITA TERBARU <span>●</span> INFORMASI TERVERIFIKASI <span>●</span> SURABAYA HARI INI <span>●</span> BERITA TERBARU <span>●</span> INFORMASI TERVERIFIKASI <span>●</span> SURABAYA HARI INI</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTop}>
          <p><span>04</span> Kabar kota</p><p><i /> Sumber resmi Pemerintah Kota Surabaya</p>
        </div>
        <div className={styles.headingRow}>
          <div><p className={styles.eyebrow}>Berita terbaru</p><h2 id="news-title">Yang terjadi<br /><em>di Surabaya.</em></h2></div>
          <div className={styles.headingCopy}>
            <p>Informasi aktual tentang kebijakan, pembangunan, pelayanan publik, dan kehidupan warga.</p>
            <a href={NEWS_URL} target="_blank" rel="noreferrer">Lihat seluruh berita <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        {categories.length > 2 && (
          <div className={styles.filters} aria-label="Filter kategori berita">
            {categories.map((category) => (
              <button className={activeCategory === category ? styles.activeFilter : ''} onClick={() => setActiveCategory(category)} type="button" key={category}>{category}</button>
            ))}
          </div>
        )}

        {featured ? (
          <div className={styles.newsLayout}>
            <a className={styles.featured} href={featured.url} target="_blank" rel="noreferrer">
              <div className={styles.featuredImage}><NewsImage item={featured} sizes="(max-width: 980px) 100vw, 55vw" /><span className={styles.imageIndex}>01 / UTAMA</span></div>
              <div className={styles.featuredBody}>
                <div className={styles.meta}><span>{featured.category}</span><time>{formatDate(featured.publishedAt)}</time></div>
                <h3>{featured.title}</h3>
                {featured.excerpt && <p>{featured.excerpt}</p>}
                <div className={styles.readMore}>Baca selengkapnya <span aria-hidden="true">↗</span></div>
              </div>
            </a>
            <div className={styles.newsList}>
              {moreNews.map((item, index) => (
                <a href={item.url} target="_blank" rel="noreferrer" key={item.id}>
                  <span className={styles.listIndex}>{String(index + 2).padStart(2, '0')}</span>
                  <div className={styles.listImage}><NewsImage item={item} sizes="132px" /></div>
                  <div className={styles.listCopy}><div className={styles.meta}><span>{item.category}</span><time>{formatDate(item.publishedAt)}</time></div><h3>{item.title}</h3></div>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        ) : <p className={styles.emptyState}>Berita resmi sedang disiapkan. Silakan buka kanal berita Pemerintah Kota Surabaya.</p>}

        <div className={styles.sourceNote}><span>SUMBER TERVERIFIKASI</span><p>Data dimuat dari API resmi <a href={NEWS_URL} target="_blank" rel="noreferrer">surabaya.go.id</a>.</p></div>
      </div>
    </section>
  )
}
