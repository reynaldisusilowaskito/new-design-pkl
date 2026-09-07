'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useExperience } from '@/context/ExperienceContext'
import styles from './TourismLanding.module.css'

/** @param {{ destinations?: import('@/lib/tourism-api').TourismItem[], culinaries?: import('@/lib/tourism-api').TourismItem[], hotels?: import('@/lib/tourism-api').TourismItem[] }} props */
export default function TourismLanding({ destinations = [], culinaries = [], hotels = [] }) {
  const { language, t } = useExperience()
  const heroRef = useRef(null)
  const [activeGroup, setActiveGroup] = useState(0)
  const groups = [
    { label:'Destinasi', short:'Seni & Budaya', href:'/wisata/destinations', items:destinations },
    { label:'Wisata Kuliner', short:'Kuliner', href:'/wisata/culinaries', items:culinaries },
    { label:'Hotel Terdekat', short:'Menginap', href:'/wisata/hotels', items:hotels },
  ]
  const current = groups[activeGroup]
  const name = item => language === 'en' ? item.nameEn : item.nameId
  const imageStyle = (item, fallback) => ({ backgroundImage:item?.image ? `url("${item.image}"), url("${fallback}")` : `url("${fallback}")` })
  const handlePointerMove = event => {
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
    <div className={styles.hiddenTrack}>
      <header className={styles.intro} ref={heroRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.introMeta}><span>08 / JELAJAHI KOTA</span><span>WISATA SURABAYA</span></div>
        <div className={styles.introCopy}>
          <p>EXPLORE SURABAYA</p>
          <h1>{t('Surabaya,')}<br />{t('satu pengalaman')}<br /><em>{t('sekaligus.')}</em></h1>
          <span>{t('Pilihan destinasi, kuliner, dan hotel untuk memulai perjalananmu.')}</span>
          <div className={styles.heroActions}><Link href="#koleksi">{t('Mulai jelajahi')}</Link><Link href="#koleksi">{t('Lihat pilihan')}</Link></div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <span className={`${styles.decoration} ${styles.decorationOne}`}>✦</span><span className={`${styles.decoration} ${styles.decorationTwo}`}>✿</span><span className={`${styles.decoration} ${styles.decorationThree}`}>✦</span>
          <span className={styles.glassOrb} /><span className={styles.glassRing} /><span className={styles.glassBlock} />
        </div>
        <div className={styles.heroBottom}><span>{t('MENJELAJAHI CERITA, RASA, DAN RUANG DI SURABAYA.')}</span><Link href="#koleksi">{t('Explore more')}</Link></div>
      </header>

      <section className={styles.collection} id="koleksi">
        <header className={styles.collectionHead}>
          <div><span>CURATED CITY GUIDE</span><h2>{t('Pilih jalurmu.')}</h2></div>
          <p>{t('Rekomendasi pilihan untuk menikmati Surabaya sesuai caramu.')}</p>
        </header>

        <div className={styles.categoryTabs} role="tablist" aria-label={t('Kategori wisata')}>
          {groups.map((group, index) => (
            <button key={group.href} type="button" role="tab" aria-selected={activeGroup === index} className={activeGroup === index ? styles.activeTab : ''} onClick={() => setActiveGroup(index)}>
              <span>0{index + 1}</span>{t(group.short)}
            </button>
          ))}
        </div>

        <div className={styles.collectionGrid} role="tabpanel">
          {current.items.slice(0, 6).map((item, index) => (
            <article className={styles.placeCard} key={item.id}>
              <Link href={current.href} className={styles.placeImage} style={imageStyle(item, '/assets/redesign/hero/alun-alun-surabaya.jpg')} aria-label={`${t('Lihat detail')} ${name(item)}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </Link>
              <div><em>{t(item.category || current.label)}</em><h3>{name(item)}</h3><p>{item.address}</p><Link href={current.href} aria-label={`${t('Buka')} ${name(item)}`}>↗</Link></div>
            </article>
          ))}
        </div>

        <Link className={styles.seeAll} href={current.href}>{t('Lihat semua')} {t(current.label)} <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  )
}
