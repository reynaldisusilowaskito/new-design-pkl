'use client'

import Link from 'next/link'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useExperience } from '@/context/ExperienceContext'
import styles from './LegacyPageTemplate.module.css'

/** Shared, low-friction view for every legacy information URL. */
export default function LegacyPageTemplate({ navigation, organization, page, pathname }) {
  const { t } = useExperience()
  const breadcrumb = pathname.split('/').filter(Boolean).slice(-2).join(' / ')

  return (
    <main className={styles.page}>
      <MainNavbar navigation={navigation} />
      <section className={styles.hero} aria-labelledby="legacy-title">
        <div className={styles.heroMeta}>
          <span className={styles.routeLabel}>INFORMASI KOTA</span>
          <p className={styles.breadcrumb}>{breadcrumb}</p>
        </div>
        <h1 id="legacy-title">{page.title}</h1>
        <p>{t('Informasi resmi Pemerintah Kota Surabaya.')}</p>
      </section>

      <article className={styles.article}>
        <aside className={styles.articleMeta}>
          <span>INFORMASI RESMI</span>
          <Link href="/#beranda">{t('Kembali ke beranda')} <b aria-hidden="true">↗</b></Link>
        </aside>
        <div className={styles.content}>
          <h2>{page.title}</h2>
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </article>
      <SiteFooter organization={organization} />
    </main>
  )
}
