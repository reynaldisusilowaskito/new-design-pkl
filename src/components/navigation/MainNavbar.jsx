'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useExperience } from '@/context/ExperienceContext'
import styles from './MainNavbar.module.css'

const mandatoryMarks = '/assets/redesign/hero/surabaya-mandatory-marks.webp'
const navbarWordmark = '/assets/redesign/hero/surabaya-wordmark-white-transparent.webp'
const sortMenu = (items = []) => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
/**
 * Keep legacy Surabaya URLs inside the redesign while leaving third-party
 * service links untouched. This lets the API remain the navigation source.
 */
const safeHref = (item) => {
  const href = item?.url?.trim() || '#'
  if (href.startsWith('/') || href.startsWith('#')) return href

  try {
    const url = new URL(href)
    if (['surabaya.go.id', 'www.surabaya.go.id'].includes(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    // Non-URL values intentionally retain the original navigation behavior.
  }

  return href
}

function InteractiveLabel({ children }) {
  return (
    <span className={styles.menuLabel} data-label={children}>
      <span>{children}</span>
    </span>
  )
}

function NavigationLink({ href, children, ...props }) {
  const internal = href.startsWith('/') || href.startsWith('#')
  if (internal) return <Link href={href} {...props}>{children}</Link>
  return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
}

/** @param {{ navigation?: import('@/lib/surabaya-api').NavigationItem[] }} props */
export default function MainNavbar({ navigation = [], immediate = false }) {
  const { language, setLanguage, theme, toggleTheme, t } = useExperience()
  const menu = useMemo(() => sortMenu(navigation), [navigation])
  const [isOpen, setIsOpen] = useState(false)
  const [activeTopIndex, setActiveTopIndex] = useState(0)
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)
  const activeTop = menu[activeTopIndex] || menu[0]
  const groups = useMemo(() => sortMenu(activeTop?.child || []), [activeTop])
  const activeGroup = groups[activeGroupIndex] || groups[0] || activeTop
  const panelLinks = useMemo(() => {
    const children = sortMenu(activeGroup?.child || [])
    return children.length ? children : activeGroup ? [activeGroup] : []
  }, [activeGroup])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const openGroup = (index) => {
    setActiveTopIndex(index)
    setActiveGroupIndex(0)
    setIsOpen(true)
  }

  return (
    <header className={`${styles.navbar} ${immediate ? styles.immediate : ''}`}>
      <Link className={styles.brand} href="/#beranda" aria-label={t('Surabaya, kembali ke beranda')}>
        <Image className={styles.brandMarks} src={mandatoryMarks} alt={t('Identitas resmi Kota Surabaya')} width={134} height={51} sizes="(max-width: 900px) 62px, 88px" />
        <i aria-hidden="true" />
        <Image className={styles.brandWordmark} src={navbarWordmark} alt="Surabaya" width={2155} height={730} sizes="(max-width: 900px) 126px, 160px" />
      </Link>
      <nav aria-label={t('Navigasi utama')}>
        {menu.map((item, index) => item.child?.length ? (
          <button className={styles.megaTrigger} type="button" key={item.title}
            aria-expanded={isOpen && activeTopIndex === index} aria-controls="surabaya-mega-menu"
            onClick={() => isOpen && activeTopIndex === index ? setIsOpen(false) : openGroup(index)}>
            <InteractiveLabel>{t(item.title)}</InteractiveLabel>
          </button>
        ) : <NavigationLink href={safeHref(item)} key={item.title}><InteractiveLabel>{t(item.title)}</InteractiveLabel></NavigationLink>)}
      </nav>
      <div className={styles.preferences}>
        <div className={`${styles.languageSwitch} ${language === 'en' ? styles.languageEnglish : ''}`} role="group" aria-label="Pilih bahasa / Choose language">
          <i aria-hidden="true" />
          <button className={language === 'id' ? styles.activeLanguage : ''} type="button" onClick={() => setLanguage('id')} aria-pressed={language === 'id'} aria-label="Gunakan Bahasa Indonesia">ID</button>
          <button className={language === 'en' ? styles.activeLanguage : ''} type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} aria-label="Use English">EN</button>
        </div>
        <button className={styles.quickPreference} type="button" onClick={toggleTheme} aria-label={theme === 'light' ? t('Aktifkan mode gelap') : t('Aktifkan mode terang')} title={theme === 'light' ? t('Aktifkan mode gelap') : t('Aktifkan mode terang')}>
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><strong>{theme === 'light' ? 'Dark' : 'Light'}</strong>
        </button>
      </div>
      <button className={styles.menuButton} type="button" aria-label={t(isOpen ? 'Tutup menu' : 'Buka menu')}
        aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}><span /><span /></button>
      <section id="surabaya-mega-menu" className={`${styles.megaMenu} ${isOpen ? styles.megaMenuOpen : ''}`}
        aria-label={t(activeTop?.title || 'Navigasi Surabaya')} aria-hidden={!isOpen}>
        <div className={styles.mobileLinks}>
          {menu.map((item, index) => item.child?.length
            ? <button type="button" onClick={() => openGroup(index)} key={item.title}>{t(item.title)}</button>
            : <NavigationLink href={safeHref(item)} onClick={() => setIsOpen(false)} key={item.title}>{t(item.title)}</NavigationLink>)}
        </div>
        <div className={styles.categoryRail} aria-label={`${t('Kategori')} ${t(activeTop?.title || '')}`}>
          <p>{t(activeTop?.title || 'Jelajahi kota')}</p>
          {groups.map((group, index) => (
            <button className={index === activeGroupIndex ? styles.activeCategory : ''} type="button"
              onClick={() => setActiveGroupIndex(index)} key={group.title}>
              <span aria-hidden="true" />{t(group.title)}<b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>
        <div className={styles.linkPanel} key={`${activeTopIndex}-${activeGroupIndex}`}>
          <span>{t('Portal resmi Kota Surabaya')}</span>
          <h2>{t(activeGroup?.title || activeTop?.title)}</h2>
          <p>{t('Pilih informasi atau layanan yang ingin dibuka.')}</p>
          <span className={styles.linkHint}>{t('TAUTAN TERSEDIA')}</span>
          <div className={`${styles.cityLinks} ${panelLinks.length > 9 ? styles.denseLinks : ''}`}>
<<<<<<< HEAD
            {panelLinks.map((link) => <NavigationLink href={safeHref(link)} onClick={() => setIsOpen(false)} key={link.title}>
              <small>{activeTop?.title}</small><strong>{link.title}</strong><i aria-hidden="true">Buka&nbsp; ↗</i>
            </NavigationLink>)}
=======
            {panelLinks.map((link) => <a href={safeHref(link)} onClick={() => setIsOpen(false)} key={link.title}>
              <small>{t(activeTop?.title)}</small><strong>{t(link.title)}</strong><i aria-hidden="true">{t('Buka')}&nbsp; ↗</i>
            </a>)}
>>>>>>> 59502f1 (menambahkan wisata)
          </div>
        </div>
      </section>
    </header>
  )
}
