'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { useExperience } from '@/context/ExperienceContext'
import styles from './TourismLanding.module.css'
import guide from './TourismGuide.module.css'

/** @param {{ destinations?: import('@/lib/tourism-api').TourismItem[], culinaries?: import('@/lib/tourism-api').TourismItem[], hotels?: import('@/lib/tourism-api').TourismItem[] }} props */
export default function TourismLanding({ destinations = [], culinaries = [], hotels = [] }) {
  const { language, t } = useExperience()
  const heroRef = useRef(null)
  const groups = [
    ['Destinasi', '/wisata/destinations', destinations, 'Ruang, sejarah, dan cerita kota yang selalu bergerak.'],
    ['Wisata Kuliner', '/wisata/culinaries', culinaries, 'Rasa khas yang membawa kita lebih dekat dengan Surabaya.'],
    ['Hotel Terdekat', '/wisata/hotels', hotels, 'Tempat singgah untuk melanjutkan perjalananmu.'],
  ]
  const name = (item) => language === 'en' ? item.nameEn : item.nameId
  const handlePointerMove = (event) => {
    const hero = heroRef.current
    if (!hero) return
    const bounds = hero.getBoundingClientRect()
    hero.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 2}`)
    hero.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 2}`)
  }
  const resetPointer = () => {
    heroRef.current?.style.setProperty('--pointer-x', '0')
    heroRef.current?.style.setProperty('--pointer-y', '0')
  }

  return (
    <section className={styles.wrap}>
      <header className={styles.intro} ref={heroRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.introMeta}><span>08 / JELAJAHI KOTA</span><span>WISATA SURABAYA</span></div>
        <div className={styles.introCopy}>
          <p>EXPLORE SURABAYA</p>
          <h1>{t('Surabaya,')}<br />{t('satu pengalaman')}<br /><em>{t('sekaligus.')}</em></h1>
          <span>{t('Pilihan destinasi, kuliner, dan hotel untuk memulai perjalananmu.')}</span>
          <div className={styles.heroActions}><Link href="/wisata/destinations">{t('Mulai jelajahi')}</Link><Link href="#destinasi">{t('Lihat pilihan')}</Link></div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <span className={`${styles.decoration} ${styles.decorationOne}`}>✦</span><span className={`${styles.decoration} ${styles.decorationTwo}`}>✿</span><span className={`${styles.decoration} ${styles.decorationThree}`}>✦</span>
          <span className={styles.glassOrb} /><span className={styles.glassRing} /><span className={styles.glassBlock} />
        </div>
        <div className={styles.heroBottom}><span>{t('MENJELAJAHI CERITA, RASA, DAN RUANG DI SURABAYA.')}</span><Link href="#destinasi">{t('Explore more')}</Link></div>
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
        <section className={styles.group} id={groupIndex === 0 ? 'destinasi' : groupIndex === 1 ? 'kuliner' : 'hotel'} key={href}>
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
