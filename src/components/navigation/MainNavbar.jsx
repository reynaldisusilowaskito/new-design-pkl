'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
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
    const closeOnEscape = (event) => event.key === 'Escape' && setIsOpen(false)
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
      <a className={styles.brand} href="#beranda" aria-label="Surabaya, kembali ke beranda">
        <Image className={styles.brandMarks} src={mandatoryMarks} alt="Identitas resmi Kota Surabaya" width={134} height={51} sizes="(max-width: 900px) 62px, 88px" />
        <i aria-hidden="true" />
        <Image className={styles.brandWordmark} src={navbarWordmark} alt="Surabaya" width={2155} height={730} sizes="(max-width: 900px) 126px, 160px" />
      </a>
      <nav aria-label="Navigasi utama">
        {menu.map((item, index) => item.child?.length ? (
          <button className={styles.megaTrigger} type="button" key={item.title}
            aria-expanded={isOpen && activeTopIndex === index} aria-controls="surabaya-mega-menu"
            onClick={() => isOpen && activeTopIndex === index ? setIsOpen(false) : openGroup(index)}
            onMouseEnter={() => openGroup(index)} onFocus={() => openGroup(index)}>
            <InteractiveLabel>{item.title}</InteractiveLabel>
          </button>
        ) : <a href={safeHref(item)} key={item.title}><InteractiveLabel>{item.title}</InteractiveLabel></a>)}
      </nav>
      <button className={styles.menuButton} type="button" aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}><span /><span /></button>
      <section id="surabaya-mega-menu" className={`${styles.megaMenu} ${isOpen ? styles.megaMenuOpen : ''}`}
        aria-label={activeTop?.title || 'Navigasi Surabaya'} aria-hidden={!isOpen} onMouseEnter={() => setIsOpen(true)}>
        <div className={styles.mobileLinks}>
          {menu.map((item, index) => item.child?.length
            ? <button type="button" onClick={() => openGroup(index)} key={item.title}>{item.title}</button>
            : <a href={safeHref(item)} onClick={() => setIsOpen(false)} key={item.title}>{item.title}</a>)}
        </div>
        <div className={styles.categoryRail} aria-label={`Kategori ${activeTop?.title || ''}`}>
          <p>{activeTop?.title || 'Jelajahi kota'}</p>
          {groups.map((group, index) => (
            <button className={index === activeGroupIndex ? styles.activeCategory : ''} type="button"
              onClick={() => setActiveGroupIndex(index)} onMouseEnter={() => setActiveGroupIndex(index)} key={group.title}>
              <span aria-hidden="true" />{group.title}<b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>
        <div className={styles.linkPanel} key={`${activeTopIndex}-${activeGroupIndex}`}>
          <span>Portal resmi Kota Surabaya</span>
          <h2>{activeGroup?.title || activeTop?.title}</h2>
          <p>Pilih informasi atau layanan yang ingin dibuka.</p>
          <span className={styles.linkHint}>TAUTAN TERSEDIA</span>
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
