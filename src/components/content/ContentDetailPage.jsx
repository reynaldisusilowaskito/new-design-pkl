'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useExperience } from '@/context/ExperienceContext'
import styles from './ContentDetailPage.module.css'

function formatDate(value, language) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Jakarta' }).format(date)
}

export default function ContentDetailPage({ navigation, organization, page }) {
  const { language, t } = useExperience()
  const [imageFailed, setImageFailed] = useState(false)
  const agenda = page.kind === 'agenda'
  const date = formatDate(page.publishedAt, language)
  const listHref = agenda ? '/id/agenda' : '/id/berita'

  return (
    <main className={`${styles.page} ${agenda ? styles.agenda : styles.news}`}>
      <MainNavbar navigation={navigation} />

      <article className={styles.article}>
        <header className={styles.header}>
          <Link className={styles.back} href={listHref}><span aria-hidden="true">←</span> {t(agenda ? 'Agenda Kota' : 'Berita')}</Link>
          <p className={styles.label}>{agenda ? 'AGENDA KOTA' : 'KABAR KOTA'}</p>
          <h1>{page.title}</h1>
          <div className={styles.meta}>
            {date && <time dateTime={page.publishedAt}>{date}</time>}
            <span>{t('Pemerintah Kota Surabaya')}</span>
            {page.viewCount > 0 && <span>{page.viewCount.toLocaleString('id-ID')} dibaca</span>}
          </div>
        </header>

        <figure className={styles.cover}>
          <Image src={!page.image || imageFailed ? '/assets/redesign/hero/kota-lama-surabaya-2d-full.png' : page.image} alt={page.title} fill sizes="(max-width: 900px) 100vw, 1180px" unoptimized onError={() => { if (!imageFailed) setImageFailed(true) }} priority />
        </figure>

        <div className={styles.readingGrid}>
          <aside>
            <span>{agenda ? 'AGENDA' : 'BERITA'}</span>
            <p>{date || t('Informasi resmi')}</p>
            <Link href={listHref}>{t(agenda ? 'Lihat agenda' : 'Lihat seluruh berita')} ↗</Link>
          </aside>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </article>

      <SiteFooter organization={organization} />
    </main>
  )
}
