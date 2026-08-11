'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useExperience } from '@/context/ExperienceContext'
import styles from './MainNavbar.module.css'

const mandatoryMarks = '/assets/redesign/hero/surabaya-mandatory-marks.png'
const navbarWordmark = '/assets/redesign/hero/surabaya-wordmark-white-transparent.png'
const sortMenu = (items = []) => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
const safeHref = (item) => item?.url?.trim() || '#'

function InteractiveLabel({ children }) {
  return (
    <span className={styles.menuLabel} data-label={children}>
      <span>{children}</span>
    </span>
  )
}

export default function MainNavbar({ navigation = [] }) {
  const { language, setLanguage, theme, toggleTheme, t } = useExperience()
  const menu = useMemo(() => sortMenu(navigation), [navigation])
  const [isOpen, setIsOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
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
        setPreferencesOpen(false)
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
    <header className={styles.navbar} onMouseLeave={() => setIsOpen(false)}>
      <a className={styles.brand} href="#beranda" aria-label={t('Surabaya, kembali ke beranda')}>
        <Image className={styles.brandMarks} src={mandatoryMarks} alt={t('Identitas resmi Kota Surabaya')} width={134} height={51} sizes="(max-width: 900px) 62px, 88px" />
        <i aria-hidden="true" />
        <Image className={styles.brandWordmark} src={navbarWordmark} alt="Surabaya" width={2155} height={730} sizes="(max-width: 900px) 126px, 160px" />
      </a>
      <nav aria-label={t('Navigasi utama')}>
        {menu.map((item, index) => item.child?.length ? (
          <button className={styles.megaTrigger} type="button" key={item.title}
            aria-expanded={isOpen && activeTopIndex === index} aria-controls="surabaya-mega-menu"
            onClick={() => isOpen && activeTopIndex === index ? setIsOpen(false) : openGroup(index)}
            onMouseEnter={() => openGroup(index)} onFocus={() => openGroup(index)}>
            <InteractiveLabel>{t(item.title)}</InteractiveLabel>
          </button>
        ) : <a href={safeHref(item)} key={item.title}><InteractiveLabel>{t(item.title)}</InteractiveLabel></a>)}
      </nav>
      <div className={styles.preferences}>
        <button className={styles.preferenceTrigger} type="button" onClick={() => setPreferencesOpen((value) => !value)} aria-label={t('Pengaturan tampilan')} aria-expanded={preferencesOpen} aria-controls="display-preferences">
          <span className={styles.preferenceIcon} aria-hidden="true"><i /><i /><i /></span>
        </button>
        <div id="display-preferences" className={`${styles.preferencePanel} ${preferencesOpen ? styles.preferencePanelOpen : ''}`} aria-hidden={!preferencesOpen}>
          <p>{t('Pengaturan tampilan')}</p>
          <button type="button" onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} aria-label={t('Ganti bahasa')}>
            <span className={styles.optionIcon} aria-hidden="true">文</span><span><b>{t('Ganti bahasa')}</b><small>{language === 'id' ? 'Indonesia' : 'English'}</small></span><strong>{language === 'id' ? 'ID' : 'EN'}</strong>
          </button>
          <button type="button" onClick={toggleTheme} aria-label={theme === 'light' ? t('Aktifkan mode gelap') : t('Aktifkan mode terang')}>
            <span className={styles.optionIcon} aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><span><b>{theme === 'light' ? t('Aktifkan mode gelap') : t('Aktifkan mode terang')}</b><small>{theme === 'light' ? 'Light' : 'Dark'}</small></span><strong className={styles.switchTrack}><i /></strong>
          </button>
        </div>
      </div>
      <button className={styles.menuButton} type="button" aria-label={t(isOpen ? 'Tutup menu' : 'Buka menu')}
        aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}><span /><span /></button>
      <section id="surabaya-mega-menu" className={`${styles.megaMenu} ${isOpen ? styles.megaMenuOpen : ''}`}
        aria-label={t(activeTop?.title || 'Navigasi Surabaya')} aria-hidden={!isOpen} onMouseEnter={() => setIsOpen(true)}>
        <div className={styles.mobileLinks}>
          {menu.map((item, index) => item.child?.length
            ? <button type="button" onClick={() => openGroup(index)} key={item.title}>{t(item.title)}</button>
            : <a href={safeHref(item)} onClick={() => setIsOpen(false)} key={item.title}>{t(item.title)}</a>)}
        </div>
        <div className={styles.categoryRail} aria-label={`Kategori ${activeTop?.title || ''}`}>
          <p>{t(activeTop?.title || 'Jelajahi kota')}</p>
          {groups.map((group, index) => (
            <button className={index === activeGroupIndex ? styles.activeCategory : ''} type="button"
              onClick={() => setActiveGroupIndex(index)} onMouseEnter={() => setActiveGroupIndex(index)} key={group.title}>
              <span aria-hidden="true" />{group.title}<b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>
        <div className={styles.linkPanel} key={`${activeTopIndex}-${activeGroupIndex}`}>
          <span>{t('Portal resmi Kota Surabaya')}</span>
          <h2>{t(activeGroup?.title || activeTop?.title)}</h2>
          <p>{t('Pilih informasi atau layanan yang ingin dibuka.')}</p>
          <span className={styles.linkHint}>{t('TAUTAN TERSEDIA')}</span>
          <div className={`${styles.cityLinks} ${panelLinks.length > 9 ? styles.denseLinks : ''}`}>
            {panelLinks.map((link) => <a href={safeHref(link)} onClick={() => setIsOpen(false)} key={link.title}>
              <small>{activeTop?.title}</small><strong>{link.title}</strong><i aria-hidden="true">Buka&nbsp; ↗</i>
            </a>)}
          </div>
        </div>
      </section>
    </header>
  )
}
