'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useExperience } from '@/context/ExperienceContext'
import styles from './TourismLanding.module.css'
import guide from './TourismGuide.module.css'

/** @param {{ destinations?: import('@/lib/tourism-api').TourismItem[], culinaries?: import('@/lib/tourism-api').TourismItem[], hotels?: import('@/lib/tourism-api').TourismItem[] }} props */
export default function TourismLanding({ destinations = [], culinaries = [], hotels = [] }) {
  const { language, t } = useExperience()
  const groups = [
    ['Destinasi', '/wisata/destinations', destinations, 'Ruang, sejarah, dan cerita kota yang selalu bergerak.'],
    ['Wisata Kuliner', '/wisata/culinaries', culinaries, 'Rasa khas yang membawa kita lebih dekat dengan Surabaya.'],
    ['Hotel Terdekat', '/wisata/hotels', hotels, 'Tempat singgah untuk melanjutkan perjalananmu.'],
  ]
  const name = (item) => language === 'en' ? item.nameEn : item.nameId

  return (
    <section className={styles.wrap}>
      <header className={styles.intro}>
        <div className={styles.introMeta}><span>08 / JELAJAHI KOTA</span><span>WISATA SURABAYA</span></div>
        <div className={styles.introCopy}>
          <p>EXPLORE SURABAYA</p>
          <h1>{t('Temukan Surabaya,')}<br /><em>{t('satu pengalaman sekaligus.')}</em></h1>
          <span>{t('Pilihan destinasi, kuliner, dan hotel untuk memulai perjalananmu.')}</span>
        </div>
        <nav className={styles.introRail} aria-label={t('Kategori wisata')}>
          {groups.map(([title, href, items], index) => (
            <Link href={href} key={href}><b>0{index + 1}</b><span>{t(title)}</span><i>{items.length}</i><em aria-hidden="true">↗</em></Link>
          ))}
        </nav>
      </header>

      <section className={guide.guideHero}>
        <div className={guide.guideCopy}><span>YOUR SURABAYA GUIDE</span><h2>{t('Pilih pengalamanmu.')}</h2><p>{t('Satu kota dengan banyak cerita untuk dijelajahi.')}</p><Link href="/wisata/destinations">{t('Mulai menjelajah')} →</Link></div>
        <div className={guide.guideVisual}>
          {groups.map(([title, href, items], index) => {
            const item = items[0]
            return <Link href={href} className={`${guide.orbitCard} ${guide[`orbit${index + 1}`]}`} key={href}><i style={item?.image ? { backgroundImage: `url("${item.image}")` } : undefined} /><span>{t(title)}</span></Link>
          })}
          <Image src="/assets/redesign/tourism/tourism-guide-3d.png" alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
        </div>
      </section>

      {groups.map(([title, href, items, description], groupIndex) => (
        <section className={styles.group} key={href}>
          <div className={styles.groupHead}><span>0{groupIndex + 1} / CURATED IN SURABAYA</span><h2>{t(title)}</h2><p>{t(description)}</p><Link href={href}>{t('Lihat lebih banyak')} <b aria-hidden="true">→</b></Link></div>
          <div className={styles.cards}>
            {items.slice(0, 3).map((item, index) => (
              <Link href={href} className={styles.card} key={item.id}>
                <i style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined} />
                <small>0{index + 1}</small><span>{name(item)}</span><em>{item.category}</em><strong>{item.address}</strong>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}
