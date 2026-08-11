'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AboutSection.module.css'

const featureSprites = '/assets/redesign/about/surabaya-feature-sprites.png'
const statSprites = '/assets/redesign/about/surabaya-stat-sprites.png'

const cityFacts = [
  { value: '31', label: 'Kecamatan', sprite: '0% 50%' },
  { value: '153', label: 'Kelurahan', sprite: '50% 50%' },
  { value: '333', unit: 'km²', label: 'Luas wilayah', sprite: '100% 50%' },
]

const cityCards = [
  {
    kicker: 'Administrasi kependudukan',
    title: 'Cek Status Penonaktifan NIK',
    text: 'Periksa status NIK dan lakukan konfirmasi data domisili secara daring melalui layanan resmi Pemerintah Kota Surabaya.',
    fact: 'Buka layanan NIK',
    color: '#f7d8de',
    ink: '#172337',
    sprite: '0% 0%',
    href: 'https://cekinwarga.surabaya.go.id/konfirmasi-data-survey',
  },
  {
    kicker: 'Kota ramah anak dunia',
    title: 'Child Friendly City Initiative',
    text: 'Kenali program, kebijakan, dan kabar Surabaya sebagai kota pertama di Indonesia yang terakreditasi UNICEF sebagai Kota Ramah Anak.',
    fact: 'Jelajahi CFCI Surabaya',
    color: '#f6eee9',
    ink: '#172337',
    sprite: '50% 0%',
    href: 'https://surabaya.go.id/id/page/0/22707/news-about-child-friendly-initiative',
  },
  {
    kicker: 'Mobilitas kota',
    title: 'Transportasi',
    text: 'Temukan informasi mobilitas Surabaya, termasuk Suroboyo Bus, feeder WiraWiri, dan perkembangan sistem transportasi kota.',
    fact: 'Lihat informasi transportasi',
    color: '#776788',
    ink: '#fff8f4',
    sprite: '100% 0%',
    href: 'https://surabaya.go.id/id/berita/25117/sits-dan-layanan-digital-terintegrasi-perkuat-transformasi-smart-city-surabaya',
  },
  {
    kicker: 'Ekonomi kota',
    title: 'Bisnis dan Investasi',
    text: 'Akses gambaran ekonomi, perdagangan, dan peluang investasi di Surabaya sebagai pusat bisnis dan jasa di Indonesia timur.',
    fact: 'Jelajahi potensi ekonomi',
    color: '#e95d6f',
    ink: '#fff8f4',
    sprite: '0% 100%',
    href: 'https://www.surabaya.go.id/id/page/0/8177/sosial-ekonomi',
  },
  {
    kicker: 'Jelajahi kota',
    title: 'Wisata Surabaya',
    text: 'Pesan tiket destinasi resmi dan temukan pengalaman wisata di Kota Pahlawan dengan proses yang mudah dan transparan.',
    fact: 'Buka tiket wisata',
    color: '#f3c867',
    ink: '#172337',
    sprite: '50% 100%',
    href: 'https://tiketwisata.surabaya.go.id',
  },
  {
    kicker: 'Infrastruktur kota',
    title: 'Utilitas',
    text: 'Dapatkan informasi mengenai pengelolaan fasilitas, jaringan, dan utilitas kota untuk ruang publik Surabaya yang lebih tertata.',
    fact: 'Lihat informasi utilitas',
    color: '#9fc8d8',
    ink: '#172337',
    sprite: '100% 100%',
    href: 'https://www.surabaya.go.id/id/berita/9491/tata-jaringan-kabel-utilitas-di-kawasan-kota-lama-pemkot-surabaya-lakukan-pemotongan-kabel',
  },
]

function AboutSection() {
  const sectionRef = useRef(null)
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!section || reduceMotion.matches) return undefined

    let frame
    const updateScrollText = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect()
        const travel = window.innerHeight + bounds.height
        const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / travel))
        section.style.setProperty('--scroll-progress', progress.toFixed(4))
      })
    }

    updateScrollText()
    window.addEventListener('scroll', updateScrollText, { passive: true })
    window.addEventListener('resize', updateScrollText)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScrollText)
      window.removeEventListener('resize', updateScrollText)
    }
  }, [])

  return (
    <section className={styles.about} id="tentang" aria-labelledby="about-title" ref={sectionRef}>
      <div className={styles.topLine}>
        <p><span>02</span> Mengenal Surabaya</p>
        <p>07° 09′–07° 21′ LS&nbsp;&nbsp; / &nbsp;&nbsp;112° 36′–112° 54′ BT</p>
      </div>

      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>Tentang kota</p>
          <h2 id="about-title">Kota Pahlawan,<br /><em>gerbang Jawa Timur.</em></h2>
        </div>

        <div className={styles.summary}>
          <p>
            Surabaya adalah ibu kota Provinsi Jawa Timur sekaligus pusat pemerintahan
            dan perekonomian provinsi. Tumbuh sebagai kota pelabuhan, Surabaya
            membawa semangat kepahlawanan ke dalam gerak kota yang maju, humanis,
            dan berkelanjutan.
          </p>
          <a href="https://surabaya.go.id/page/0/76094/sekilas-kota-surabaya" target="_blank" rel="noreferrer">
            Baca profil resmi <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className={styles.quickFacts} aria-label="Data administratif Kota Surabaya">
        <div className={styles.factsIntro}>
          <span>Surabaya dalam angka</span>
          <small>Data administratif kota</small>
        </div>
        {cityFacts.map((fact, index) => (
          <p key={fact.label}>
            <small>0{index + 1}</small>
            <i
              className={styles.statIcon}
              style={{ backgroundImage: `url(${statSprites})`, '--stat-position': fact.sprite }}
              aria-hidden="true"
            />
            <strong>{fact.value}{fact.unit && <em> {fact.unit}</em>}</strong>
            <span>{fact.label}</span>
          </p>
        ))}
        <small className={styles.factSource}>Sumber: Pemerintah Kota Surabaya</small>
      </div>

      <div className={styles.scrollMarquee} aria-hidden="true">
        <p>KOTA SURABAYA <span>·</span> KOTA SURABAYA <span>·</span> KOTA SURABAYA</p>
      </div>

      <div className={styles.cardDeck} style={{ '--active-card': activeCard }}>
        {cityCards.map((card, index) => (
          <a
            className={`${styles.cityCard} ${activeCard === index ? styles.activeCard : ''}`}
            style={{
              '--card-index': index,
              '--card-color': card.color,
              '--card-ink': card.ink,
              '--sprite-position': card.sprite,
            }}
            onMouseEnter={() => setActiveCard(index)}
            onFocus={() => setActiveCard(index)}
            onClick={(event) => {
              if (activeCard !== index) {
                event.preventDefault()
                setActiveCard(index)
              }
            }}
            href={card.href}
            target="_blank"
            rel="noreferrer"
            key={card.title}
          >
            <div className={styles.cardCopy}>
              <p className={styles.cardKicker}><span>0{index + 1}</span>{card.kicker}</p>
              <h3>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
              <p className={styles.cardFact}>{card.fact} <span aria-hidden="true">↗</span></p>
            </div>
            <div
              className={styles.cardObject}
              style={{ backgroundImage: `url(${featureSprites})` }}
              aria-hidden="true"
            />
            <span className={styles.cardNumber}>0{index + 1}</span>
          </a>
        ))}
      </div>

      <div className={styles.contextStrip}>
        <p>Berbatasan dengan <strong>Selat Madura</strong> di utara dan timur</p>
        <span />
        <p><strong>Kabupaten Sidoarjo</strong> di selatan</p>
        <span />
        <p><strong>Kabupaten Gresik</strong> di barat</p>
      </div>
    </section>
  )
}

export default AboutSection
