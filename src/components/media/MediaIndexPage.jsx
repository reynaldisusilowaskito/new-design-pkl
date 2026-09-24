'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useExperience } from '@/context/ExperienceContext'
import styles from './MediaPages.module.css'

const labels = {
  videos: { title:'Video', intro:'Siaran dan dokumentasi video resmi Kota Surabaya.' },
  podcasts: { title:'Podcast', intro:'Percakapan dan informasi audio resmi Kota Surabaya.' },
  photos: { title:'Foto', intro:'Dokumentasi visual kegiatan dan perkembangan Kota Surabaya.' },
  infografis: { title:'Infografis', intro:'Informasi visual resmi mengenai Kota Surabaya.' },
}

const formatDate = (value, language) => {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return language === 'en' ? 'Latest' : 'Terbaru'
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Jakarta' }).format(date)
}

export default function MediaIndexPage({ navigation, organization, media, type, pathname }) {
  const { language, t } = useExperience()
  const [query, setQuery] = useState('')
  const visibleItems = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return media.items.filter((item) => !keyword || `${item.title} ${item.contentType}`.toLowerCase().includes(keyword))
  }, [media.items, query])
  const label = labels[type]

  return <main className={styles.page}>
    <MainNavbar navigation={navigation} />
    <header className={styles.hero}><Link href="/#kabar">← {t('Kembali ke beranda')}</Link><span>MEDIA KOTA / SURABAYA</span><h1>{t(label.title)}</h1><p>{t(label.intro)}</p></header>
    <section className={styles.browser}>
      <div className={styles.toolbar}><div><span>ARSIP MEDIA</span><h2>{t('Terbaru')}</h2></div><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${t('Cari')} ${label.title.toLowerCase()}...`} /><b>{visibleItems.length}</b></label></div>
      {visibleItems.length ? <div className={styles.grid}>{visibleItems.map((item, index) => <Link href={`${pathname}/${item.id}/${item.slug}`} className={styles.card} key={item.id}><div className={styles.visual}>{item.image && <Image src={item.image} alt="" fill sizes="(max-width:760px) 100vw, (max-width:1100px) 50vw, 33vw" unoptimized priority={index === 0} />}<span>{String(index + 1).padStart(2, '0')}</span><b>{type === 'videos' ? '▶' : type === 'podcasts' ? '◉' : '＋'}</b></div><div><time>{formatDate(item.publishedAt, language)}</time><h3>{item.title}</h3>{item.viewCount > 0 && <small>{item.viewCount.toLocaleString('id-ID')} {t('dilihat')}</small>}<strong>{t('Lihat detail')} ↗</strong></div></Link>)}</div> : <p className={styles.empty}>{t('Media tidak ditemukan.')}</p>}
      {media.lastPage > 1 && <nav className={styles.pagination} aria-label={t('Navigasi halaman')}>{media.page > 1 && <Link href={`${pathname}?page=${media.page - 1}`}>← {t('Sebelumnya')}</Link>}<span>{t('Halaman')} {media.page} / {media.lastPage}</span>{media.page < media.lastPage && <Link href={`${pathname}?page=${media.page + 1}`}>{t('Selanjutnya')} →</Link>}</nav>}
    </section>
    <SiteFooter organization={organization} />
  </main>
}
