'use client'

import Image from 'next/image'
import { useExperience } from '@/context/ExperienceContext'
import styles from './SiteFooter.module.css'

const mandatoryMarks = '/assets/redesign/hero/surabaya-mandatory-marks.png'
const characters = '/assets/redesign/hero/suro-boyo-3d.png'
const navigation = [
  ['Tentang Surabaya', '#tentang'], ['Layanan warga', '#layanan'], ['Kabar kota', '#kabar'],
  ['Video kota', '#video'], ['Kalender Surabaya', '#agenda-kota'],
]
const validUrl = (value, fallback) => value?.startsWith('http') ? value : fallback

/** @param {{ organization: import('@/lib/surabaya-api').Organization }} props */
export default function SiteFooter({ organization }) {
  const { t } = useExperience()
  const phone = organization.phone_number || '(031) 531 2144'
  const socials = [
    ['Instagram', validUrl(organization.instagram, 'https://www.instagram.com/surabaya/')],
    ['YouTube', validUrl(organization.youtube, 'https://www.youtube.com/@BanggaSurabaya')],
    ['TikTok', validUrl(organization.tiktok, 'https://www.tiktok.com/@pidibaya')],
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.glow} aria-hidden="true" />
        <section className={styles.hero} aria-labelledby="footer-title">
          <div className={styles.heroCopy}>
            <div className={styles.identity}>
              <Image src={mandatoryMarks} alt={t('Identitas resmi Kota Surabaya')} width={134} height={51} sizes="92px" />
              <span>{t('PORTAL RESMI KOTA')}</span>
            </div>
            <h2 id="footer-title">{t('Masih mencari layanan atau informasi kota?')}</h2>
            <p>{t('Kami bantu menghubungkan kebutuhanmu dengan kanal resmi Pemerintah Kota Surabaya.')}</p>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href="#layanan">{t('Jelajahi layanan')} <span>→</span></a>
              <a className={styles.secondaryAction} href="https://wargaku.surabaya.go.id/" target="_blank" rel="noreferrer">{t('Sampaikan pengaduan')} <span>↗</span></a>
            </div>
          </div>
          <div className={styles.visual} aria-hidden="true">
            <span className={styles.cityType}>SBY</span><i className={styles.orbit} /><i className={styles.pedestal} />
            <Image src={characters} alt="" width={1538} height={1022} sizes="(max-width: 650px) 230px, 330px" />
          </div>
        </section>
        <div className={styles.infoBar}>
          <nav className={styles.navigation} aria-label={t('Jelajahi')}>
            {navigation.map(([label, href]) => <a href={href} key={label}>{t(label)}</a>)}
          </nav>
          <address className={styles.contact}>
            <span>{t('PEMERINTAH KOTA')}</span>
            <p>{organization.address || 'Jl. Jimerto No. 25–27 · Surabaya'}</p>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
          </address>
          <div className={styles.socials} aria-label={t('Sosial Media')}>
            {socials.map(([label, href]) => <a href={href} target="_blank" rel="noreferrer" key={label}>{label} <span>↗</span></a>)}
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>© 2026 {t('Pemerintah Kota Surabaya')}</p>
          <a href="https://surabaya.go.id/" target="_blank" rel="noreferrer">surabaya.go.id ↗</a>
          <a href="#beranda" aria-label={t('Kembali ke bagian atas')}>{t('Kembali ke atas')} ↑</a>
        </div>
      </div>
    </footer>
  )
}
