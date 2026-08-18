'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { heroParticles, heroServices, heroWords } from '@/data/heroContent'
import MainNavbar from '@/components/navigation/MainNavbar'
import { useExperience } from '@/context/ExperienceContext'
import styles from './HeroSection.module.css'

const characters = '/assets/redesign/hero/suro-boyo-3d.webp'
const lowerBackgroundDay = '/assets/redesign/hero/kota-lama-day.webp'
const lowerBackgroundNight = '/assets/redesign/hero/kota-lama-night-windows.webp'
const searchSupporters = '/assets/redesign/hero/suro-boyo-chroma.webp'
const monument = '/assets/redesign/hero/tugu-pahlawan-3d.webp'
const mandatoryMarks = '/assets/redesign/hero/surabaya-mandatory-marks.webp'
const splashWordmark = '/assets/redesign/hero/surabaya-wordmark-black-transparent.webp'

// Survives App Router navigation and resets on an actual document reload.
let splashPlayedForCurrentDocument = false

function isLandingPageDocument() {
  const navigationEntry = performance.getEntriesByType('navigation')[0]

  try {
    const initialPath = navigationEntry?.name
      ? new URL(navigationEntry.name).pathname
      : window.location.pathname
    return initialPath === '/' && window.location.pathname === '/'
  } catch {
    return window.location.pathname === '/'
  }
}

function HeroSection({ navigation }) {
  const { t } = useExperience()
  const heroRef = useRef(null)
  const splashDecisionMade = useRef(false)
  const [activeWord, setActiveWord] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [playSplash, setPlaySplash] = useState(true)

  useLayoutEffect(() => {
    if (splashDecisionMade.current) return
    splashDecisionMade.current = true

    const shouldPlay = !splashPlayedForCurrentDocument && isLandingPageDocument()
    if (shouldPlay) splashPlayedForCurrentDocument = true
    setPlaySplash(shouldPlay)
  }, [])

  const matchingServices = heroServices.filter((service) => {
    const searchableText = `${service.label} ${service.detail}`.toLowerCase()
    return searchableText.includes(searchQuery.trim().toLowerCase())
  })

  const handleSearch = (event) => {
    event.preventDefault()
    if (!searchQuery.trim() || matchingServices.length === 0) return
    window.location.hash = matchingServices[0].href
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return undefined

    let wordTimer
    const wordDelay = window.setTimeout(() => {
      wordTimer = window.setInterval(() => {
        setActiveWord((current) => (current + 1) % heroWords.length)
      }, 2400)
    }, 6000)

    return () => {
      window.clearTimeout(wordDelay)
      window.clearInterval(wordTimer)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!hero || reduceMotion.matches) return undefined

    let frame
    const updateScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect()
        const distance = Math.max(hero.offsetHeight - window.innerHeight, 1)
        const progress = Math.min(Math.max(-bounds.top / distance, 0), 1)
        const headlineProgress = Math.min(progress / .32, 1)
        const servicesProgress = Math.min(Math.max((progress - .72) / .18, 0), 1)
        const monumentTravel = Number.parseFloat(getComputedStyle(hero).getPropertyValue('--monument-travel')) || -96

        hero.style.setProperty('--monument-y', `${progress * monumentTravel}vh`)
        hero.style.setProperty('--identity-y', `${progress * -distance}px`)
        hero.style.setProperty('--headline-opacity', (1 - headlineProgress).toFixed(3))
        hero.style.setProperty('--headline-y', `${headlineProgress * -54}px`)
        hero.style.setProperty('--services-opacity', servicesProgress.toFixed(3))
        hero.style.setProperty('--services-y', `${(1 - servicesProgress) * 34}px`)
        hero.style.setProperty('--landmark-y', `${(1 - progress) * 100}vh`)
      })
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!hero || reduceMotion.matches) return undefined

    let frame
    const handlePointer = (event) => {
      const bounds = hero.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - .5
      const y = (event.clientY - bounds.top) / bounds.height - .5

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        hero.style.setProperty('--pointer-x', x.toFixed(3))
        hero.style.setProperty('--pointer-y', y.toFixed(3))
      })
    }

    const resetPointer = () => {
      hero.style.setProperty('--pointer-x', 0)
      hero.style.setProperty('--pointer-y', 0)
    }

    hero.addEventListener('pointermove', handlePointer)
    hero.addEventListener('pointerleave', resetPointer)

    return () => {
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', handlePointer)
      hero.removeEventListener('pointerleave', resetPointer)
    }
  }, [])

  return (
    <section className={`${styles.hero} ${!playSplash ? styles.introComplete : ''}`} id="beranda" ref={heroRef}>
      {playSplash && <div className={styles.introSplash} aria-hidden="true">
        <div className={styles.introIdentity}>
          <div className={styles.introMarksWrap}>
            <Image className={styles.introMarks} src={mandatoryMarks} alt="" width={134} height={51} preload />
          </div>
          <i className={styles.introDivider} />
          <div className={styles.introWordmarkWrap}>
            <Image className={styles.introWordmark} src={splashWordmark} alt="" width={2176} height={723} sizes="(max-width: 600px) 58vw, 570px" preload />
          </div>
        </div>
        <span className={styles.introCaption}>PEMERINTAH KOTA SURABAYA</span>
        <span className={styles.introIndex}>01 / SURABAYA</span>
      </div>}

      <div className={styles.stickyScene}>
        <MainNavbar navigation={navigation} immediate={!playSplash} />

        <div className={styles.pixelField} aria-hidden="true">
          {heroParticles.map((particle, index) => (
            <i style={{ '--x': `${particle.x}%`, '--y': `${particle.y}%`, '--size': `${particle.size}px`, '--delay': `${particle.delay}s`, '--duration': `${particle.duration}s` }} key={index} />
          ))}
        </div>

        <div className={styles.cloudField} aria-hidden="true">
          <i className={styles.cloudRight} style={{ '--cloud-top': '15%', '--cloud-size': '240px', '--cloud-duration': '38s', '--cloud-delay': '-7s', '--cloud-opacity': '.76' }} />
          <i className={styles.cloudLeft} style={{ '--cloud-top': '28%', '--cloud-size': '175px', '--cloud-duration': '31s', '--cloud-delay': '-20s', '--cloud-opacity': '.66' }} />
          <i className={styles.cloudRight} style={{ '--cloud-top': '43%', '--cloud-size': '205px', '--cloud-duration': '46s', '--cloud-delay': '-29s', '--cloud-opacity': '.58' }} />
          <i className={styles.cloudLeft} style={{ '--cloud-top': '58%', '--cloud-size': '285px', '--cloud-duration': '52s', '--cloud-delay': '-12s', '--cloud-opacity': '.52' }} />
          <i className={styles.cloudRight} style={{ '--cloud-top': '69%', '--cloud-size': '150px', '--cloud-duration': '34s', '--cloud-delay': '-24s', '--cloud-opacity': '.62' }} />
          <i className={styles.cloudLeft} style={{ '--cloud-top': '8%', '--cloud-size': '130px', '--cloud-duration': '43s', '--cloud-delay': '-35s', '--cloud-opacity': '.56' }} />
        </div>

        <div className={styles.lowerLandscape} aria-hidden="true">
          <Image className={styles.dayLandscape} src={lowerBackgroundDay} alt="" width={1920} height={1080} sizes="100vw" />
          <Image className={styles.nightLandscape} src={lowerBackgroundNight} alt="" width={1920} height={1080} sizes="100vw" />
        </div>

        <div className={styles.mandate}>PORTAL RESMI PEMERINTAH KOTA SURABAYA <span>•</span> KOTA PAHLAWAN</div>

        <div className={styles.monumentScene} aria-hidden="true">
          <div className={styles.monumentGlow} />
          <Image src={monument} alt="" width={1024} height={1536} sizes="(max-width: 900px) 100vw, 70vw" fetchPriority="high" quality={95} />
        </div>

        <div className={styles.cityIdentity} aria-label="Identitas Kota Surabaya">
          <div className={styles.cityCharacters} aria-hidden="true">
            <div />
            <Image src={characters} alt="" width={1538} height={1022} sizes="(max-width: 600px) 66vw, 36vw" />
          </div>
        </div>

        <div className={styles.content}>
          <h1>
            <span>{t('KOTA YANG')}</span>
            <span className={styles.wordWindow}>
              {heroWords.map((word, index) => (
                <strong className={index === activeWord ? styles.wordActive : ''} key={word}>{t(word)}</strong>
              ))}
            </span>
          </h1>
          <p className={styles.slogan}>{t('GOTONG ROYONG MENUJU KOTA DUNIA YANG MAJU,')}<br />{t('HUMANIS, DAN BERKELANJUTAN')}</p>
        </div>

        <div className={styles.serviceStage} id="akses-cepat">
          <div className={styles.serviceIntro}>
            <span>{t('AKSES CEPAT WARGA')}</span>
            <h2>{t('Mulai dari sini.')}</h2>
          </div>
          <div className={styles.searchSupport}>
          <form className={styles.searchBox} onSubmit={handleSearch} role="search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label={t('Cari layanan Pemerintah Kota Surabaya')}
              placeholder={t('Cari layanan warga...')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="submit" aria-label="Cari layanan"><span aria-hidden="true">↗</span></button>
          </form>
          {searchQuery.trim() && (
            <div className={styles.searchResults} aria-live="polite">
              {matchingServices.length > 0 ? matchingServices.map((service) => (
                <a href={service.href} key={service.key}>
                  <ServiceGlyph type={service.key} />
                  <span><strong>{service.label}</strong><small>{service.detail}</small></span>
                  <b aria-hidden="true">↗</b>
                </a>
              )) : <p>Layanan tidak ditemukan. Coba kata kunci lain.</p>}
            </div>
          )}
          <Image className={styles.searchSupporters} src={searchSupporters} alt="Suro dan Boyo menopang kolom pencarian" width={1536} height={1024} sizes="385px" />
          </div>
          <div className={styles.serviceBubbles} aria-label="Akses cepat layanan">
            {heroServices.map((service, index) => (
              <a
                href={service.href}
                className={styles.serviceBubble}
                style={{ '--bubble-delay': `${index * -.7}s` }}
                aria-label={service.label}
                title={service.label}
                key={service.key}
              >
                <ServiceGlyph type={service.key} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.scrollHint}>
          <i />
        </div>
      </div>
    </section>
  )
}

function ServiceGlyph({ type }) {
  const paths = {
    administrasi: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    kesehatan: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
    pendidikan: <><path d="m3 6 9-3 9 3-9 3-9-3Z" /><path d="M6 8.5V15c3 2.2 9 2.2 12 0V8.5M21 7v7" /></>,
    pengaduan: <><path d="M5 5h14v11H9l-4 4V5Z" /><path d="M9 9h6M9 12h4" /></>,
  }

  return <svg className={styles.serviceIcon} viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>
}

export default HeroSection
