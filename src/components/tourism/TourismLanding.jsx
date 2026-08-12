'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useExperience } from '@/context/ExperienceContext'
import styles from './TourismLanding.module.css'
import guide from './TourismGuide.module.css'

/** @param {{ destinations?: import('@/lib/tourism-api').TourismItem[], culinaries?: import('@/lib/tourism-api').TourismItem[], hotels?: import('@/lib/tourism-api').TourismItem[] }} props */
export default function TourismLanding({ destinations=[],culinaries=[],hotels=[] }) {
  const { language,t }=useExperience()
  const groups=[['Destinasi','/wisata/destinations',destinations],['Wisata Kuliner','/wisata/culinaries',culinaries],['Hotel Terdekat','/wisata/hotels',hotels]]
  const name=item=>language==='en'?item.nameEn:item.nameId
  return <section className={styles.wrap}>
    <header><span>EXPLORE SURABAYA</span><h1>{t('Temukan Surabaya,')}<br/><em>{t('satu pengalaman sekaligus.')}</em></h1><p>{t('Pilihan destinasi, kuliner, dan hotel untuk memulai perjalananmu.')}</p></header>
    <section className={guide.guideHero}><div className={guide.guideCopy}><span>YOUR SURABAYA GUIDE</span><h2>{t('Pilih pengalamanmu.')}</h2><p>{t('Satu kota dengan banyak cerita untuk dijelajahi.')}</p><Link href="/wisata/destinations">{t('Mulai menjelajah')} →</Link></div><div className={guide.guideVisual}>{groups.map(([title,href,items],index)=>{const item=items[0];return <Link href={href} className={`${guide.orbitCard} ${guide[`orbit${index+1}`]}`} key={href}><i style={item?.image?{backgroundImage:`url("${item.image}")`}:undefined}/><span>{t(title)}</span></Link>})}<Image src="/assets/redesign/tourism/tourism-guide-3d.png" alt="" fill sizes="(max-width: 900px) 100vw, 58vw"/></div></section>
    {groups.map(([title,href,items])=><section className={styles.group} key={href}><div><span>CURATED IN SURABAYA</span><h2>{t(title)}</h2><Link href={href}>{t('Lihat lebih banyak')} →</Link></div><div className={styles.cards}>{items.slice(0,3).map(item=><Link href={href} className={styles.card} key={item.id}><i style={item.image?{backgroundImage:`url("${item.image}")`}:undefined}/><span>{name(item)}</span><small>{item.address}</small></Link>)}</div></section>)}
  </section>
}
