'use client'

import Link from 'next/link'
import MainNavbar from '@/components/navigation/MainNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useExperience } from '@/context/ExperienceContext'
import styles from './LegacyPageTemplate.module.css'

/**
 * Default shell for legacy CMS pages. The route and CMS payload stay intact;
 * only their visual presentation changes to the redesign language.
 */
export default function LegacyPageTemplate({ navigation, organization, page, pathname }) {
  const { t } = useExperience()
  const words = page.title.split(/\s+/).filter(Boolean)
  const breadcrumb = pathname.split('/').filter(Boolean).join('  /  ')

  return (
    <main className={styles.page}>
      <MainNavbar navigation={navigation} />
      <section className={styles.hero} aria-labelledby="legacy-title">
        <span className={styles.routeLabel}>ARSIP INFORMASI KOTA</span>
        <p className={styles.breadcrumb}>{breadcrumb}</p>
        <h1 id="legacy-title">{words.slice(0, Math.ceil(words.length / 2)).join(' ')} <em>{words.slice(Math.ceil(words.length / 2)).join(' ')}</em></h1>
        <p>{t('Informasi resmi Pemerintah Kota Surabaya dalam wajah digital yang lebih mudah dibaca.')}</p>
      </section>

      <article className={styles.article}>
        <aside className={styles.articleMeta}>
          <span>01 / INFORMASI</span>
          <Link href="/#beranda">{t('Kembali ke beranda')} <b aria-hidden="true">↗</b></Link>
        </aside>
        <div className={styles.content}>
          <p className={styles.kicker}>{t('Pemerintah Kota Surabaya')}</p>
          <h2>{page.title}</h2>
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </article>
      <SiteFooter organization={organization} />
    </main>
  )
}
