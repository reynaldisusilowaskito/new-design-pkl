'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import MainNavbar from '@/components/navigation/MainNavbar'
import { useExperience } from '@/context/ExperienceContext'
import styles from './HeroSection.module.css'

const dayForeground = '/assets/redesign/hero/kota-lama-foreground-day-final.webp'
const nightForeground = '/assets/redesign/hero/kota-lama-foreground-night.webp'
const blueWave = '/assets/redesign/hero/background ombak.webp'
const suraBaya = '/assets/redesign/hero/sura-dan-baya-biru.webp'
const cityLine = '/assets/redesign/hero/skyline-gold-lines.webp'
const mandatoryMarks = '/assets/redesign/hero/surabaya-mandatory-marks.webp'
const splashWordmark = '/assets/redesign/hero/surabaya-wordmark-black-transparent.webp'

let splashPlayedForCurrentDocument = false

function isLandingPageDocument() {
  const navigationEntry = performance.getEntriesByType('navigation')[0]
  try {
    const initialPath = navigationEntry?.name ? new URL(navigationEntry.name).pathname : window.location.pathname
    return initialPath === '/' && window.location.pathname === '/'
  } catch {
    return window.location.pathname === '/'
  }
}

function HeroSection({ navigation }) {
  const { t } = useExperience()
  const heroRef = useRef(null)
  const splashDecisionMade = useRef(false)
  const [playSplash, setPlaySplash] = useState(true)

  useLayoutEffect(() => {
    if (splashDecisionMade.current) return
    splashDecisionMade.current = true
    const shouldPlay = !splashPlayedForCurrentDocument && isLandingPageDocument()
    if (shouldPlay) splashPlayedForCurrentDocument = true
    setPlaySplash(shouldPlay)
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

  const entranceDelay = playSplash ? 2.8 : .08

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

      <div className={styles.scene}>
        <MainNavbar navigation={navigation} immediate={!playSplash} />

        <div className={styles.cityBackground} aria-hidden="true">
          <div className={styles.skyLayer} />
          <div className={styles.starField} />
          <div className={styles.moonField}>
            <i className={styles.moonCraterOne} />
            <i className={styles.moonCraterTwo} />
            <i className={styles.moonCraterThree} />
          </div>
          <div className={styles.cloudField}>
            <i className={styles.cloudOne} />
            <i className={styles.cloudTwo} />
            <i className={styles.cloudThree} />
            <i className={styles.cloudFour} />
          </div>
          <Image className={styles.dayForeground} src={dayForeground} alt="" fill priority sizes="100vw" />
          <Image className={styles.nightForeground} src={nightForeground} alt="" fill priority sizes="100vw" />
        </div>
        <div className={styles.backgroundWash} aria-hidden="true" />

        <motion.div className={styles.waveArt} aria-hidden="true" initial={{ opacity: 0, x: '-9%' }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.15, delay: entranceDelay, ease: [.16, 1, .3, 1] }}>
          <Image src={blueWave} alt="" fill priority sizes="(max-width: 700px) 110vw, 68vw" />
        </motion.div>

        <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: entranceDelay + .18, ease: [.16, 1, .3, 1] }}>
          <p className={styles.eyebrow}>{t('Selamat datang di')}</p>
          <h1>{t('Surabaya')}</h1>
          <p className={styles.cityTitle}>{t('Kota Pahlawan')}</p>
          <p className={styles.slogan}>{t('Gotong royong menuju kota dunia yang maju,')}<br />{t('humanis, dan berkelanjutan')}</p>
        </motion.div>

        <motion.div className={styles.characterArt} aria-hidden="true" initial={{ opacity: 0, y: 60, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.15, delay: entranceDelay + .28, ease: [.16, 1, .3, 1] }}>
          <Image src={suraBaya} alt="" width={1122} height={1402} priority sizes="(max-width: 700px) 76vw, 48vw" />
        </motion.div>

        <motion.div className={styles.cityLineArt} aria-hidden="true" initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: entranceDelay + .55, ease: [.16, 1, .3, 1] }}>
          <Image src={cityLine} alt="" width={2172} height={724} priority sizes="100vw" />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
