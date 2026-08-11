'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ExperienceContext = createContext(null)

const english = {
  'Mengenal Surabaya': 'Discover Surabaya',
  'Layanan Publik': 'Public Services',
  'Informasi Publik': 'Public Information',
  Transparansi: 'Transparency',
  'Sosial Media': 'Social Media',
  'Navigasi utama': 'Main navigation',
  'Pengaturan tampilan': 'Display settings',
  'Ganti bahasa': 'Change language',
  'Aktifkan mode gelap': 'Enable dark mode',
  'Aktifkan mode terang': 'Enable light mode',
  'Tutup menu': 'Close menu',
  'Buka menu': 'Open menu',
  'Surabaya, kembali ke beranda': 'Surabaya, back to home',
  'Identitas resmi Kota Surabaya': 'Official Surabaya identity',
  'Portal resmi Kota Surabaya': 'Official Surabaya city portal',
  'Pilih informasi atau layanan yang ingin dibuka.': 'Choose the information or service you want to open.',
  'TAUTAN TERSEDIA': 'AVAILABLE LINKS',
  Buka: 'Open',
  'KOTA YANG': 'A CITY THAT IS',
  BERGERAK: 'MOVING',
  BERTUMBUH: 'GROWING',
  TERHUBUNG: 'CONNECTED',
  MELAYANI: 'SERVING',
  'GOTONG ROYONG MENUJU KOTA DUNIA YANG MAJU,': 'WORKING TOGETHER TOWARDS AN ADVANCED, HUMANE,',
  'HUMANIS, DAN BERKELANJUTAN': 'AND SUSTAINABLE GLOBAL CITY',
  'PORTAL RESMI PEMERINTAH KOTA SURABAYA': 'OFFICIAL SURABAYA CITY GOVERNMENT PORTAL',
  'KOTA PAHLAWAN': 'CITY OF HEROES',
  'AKSES CEPAT WARGA': 'QUICK CITIZEN ACCESS',
  'Mulai dari sini.': 'Start here.',
  'Cari layanan Pemerintah Kota Surabaya': 'Search Surabaya City Government services',
  'Cari layanan warga...': 'Search citizen services...',
  'Masih mencari layanan atau informasi kota?': 'Still looking for city services or information?',
  'Kami bantu menghubungkan kebutuhanmu dengan kanal resmi Pemerintah Kota Surabaya.': 'We help connect your needs with official Surabaya City Government channels.',
  'Jelajahi layanan': 'Explore services',
  'Sampaikan pengaduan': 'Submit a complaint',
  'PORTAL RESMI KOTA': 'OFFICIAL CITY PORTAL',
  Jelajahi: 'Explore',
  'Tentang Surabaya': 'About Surabaya',
  'Layanan warga': 'Citizen services',
  'Kabar kota': 'City news',
  'Video kota': 'City videos',
  'Kalender Surabaya': 'Surabaya Calendar',
  'PEMERINTAH KOTA': 'CITY GOVERNMENT',
  'Kembali ke atas': 'Back to top',
  'Kembali ke bagian atas': 'Back to the top',
  'Pemerintah Kota Surabaya': 'Surabaya City Government',
}

const translateToEnglish = (text) => english[text] || text

export function ExperienceProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [language, setLanguageState] = useState('id')
  const [preferencesReady, setPreferencesReady] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme = window.localStorage.getItem('surabaya-theme')
      const preferredTheme = storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const storedLanguage = window.localStorage.getItem('surabaya-language') === 'en' ? 'en' : 'id'
      setTheme(preferredTheme)
      setLanguageState(storedLanguage)
      setPreferencesReady(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!preferencesReady) return
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('surabaya-theme', theme)
  }, [preferencesReady, theme])

  useEffect(() => {
    if (!preferencesReady) return
    document.documentElement.lang = language
    window.localStorage.setItem('surabaya-language', language)
  }, [language, preferencesReady])

  const setLanguage = useCallback((value) => setLanguageState(value === 'en' ? 'en' : 'id'), [])
  const toggleTheme = useCallback(() => setTheme((current) => current === 'light' ? 'dark' : 'light'), [])
  const t = useCallback((text) => language === 'en' ? translateToEnglish(text) : text, [language])
  const value = useMemo(() => ({ language, setLanguage, theme, toggleTheme, t }), [language, setLanguage, theme, toggleTheme, t])

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience() {
  const context = useContext(ExperienceContext)
  if (!context) throw new Error('useExperience must be used inside ExperienceProvider')
  return context
}
