'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useExperience } from '@/context/ExperienceContext'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import styles from './MediaPages.module.css'

const labels = { videos:'Video', podcasts:'Podcast', photos:'Foto' }
const formatDate = (value, language) => {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Jakarta' }).format(date)
}

export default function MediaDetailPage({ navigation, organization, item, pathname }) {
  const { language, t } = useExperience()
  const date = formatDate(item.publishedAt, language)
  const label = labels[item.type]
  return <main className={styles.page}>
    <MainNavbar navigation={navigation} />
    <article className={styles.detail}>
      <nav><Link href={pathname}>← {t(`Semua ${label.toLowerCase()}`)}</Link><Link href="/">{t('Beranda')} ↗</Link></nav>
      <header><span>{label.toUpperCase()} / SURABAYA</span><h1>{item.title}</h1><div>{date && <time>{date}</time>}{item.viewCount > 0 && <span>{item.viewCount.toLocaleString('id-ID')} {t('dilihat')}</span>}</div></header>
      {item.type === 'podcasts' && <section className={styles.podcast}>{item.image && <Image src={item.image} alt="" width={780} height={520} unoptimized />}{item.mediaUrl ? <audio controls preload="metadata" src={item.mediaUrl}>{t('Browser tidak mendukung pemutar audio.')}</audio> : <p>{t('File audio belum tersedia.')}</p>}</section>}
      {item.type === 'videos' && <section className={styles.video}>{item.mediaUrl && !/<video\b/i.test(item.content) && <video controls preload="metadata" poster={item.image || undefined}><source src={item.mediaUrl} /></video>}<div className={styles.richContent} dangerouslySetInnerHTML={{ __html:item.content }} /></section>}
      {item.type === 'photos' && <section className={styles.photos}>{item.images.length ? <div className={styles.gallery}>{item.images.map((image) => <figure key={image}><Image src={image} alt={item.title} fill sizes="(max-width:800px) 100vw, 50vw" unoptimized /></figure>)}</div> : item.image && <figure className={styles.cover}><Image src={item.image} alt={item.title} fill sizes="100vw" unoptimized /></figure>}<div className={styles.richContent} dangerouslySetInnerHTML={{ __html:item.content }} /></section>}
    </article>
    <SiteFooter organization={organization} />
  </main>
}
