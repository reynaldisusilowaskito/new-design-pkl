'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AccessibilityTools.module.css'

const STORAGE_KEY = 'surabaya-accessibility'
const defaults = { fontScale: 0, grayscale: false, negative: false, underline: false, speech: false }

const icons = {
  increase: <><path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/><path d="M11 8v6M8 11h6M16 16l4 4"/></>,
  decrease: <><path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/><path d="M8 11h6M16 16l4 4"/></>,
  grayscale: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M12 6 7 17M12 11l6 7"/></>,
  contrast: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  underline: <><path d="m10 13-1.5 1.5a4 4 0 0 1-5.5-5.5L5 7a4 4 0 0 1 5.5 0M14 11l1.5-1.5a4 4 0 0 1 5.5 5.5L19 17a4 4 0 0 1-5.5 0M8 12h8"/></>,
  speech: <><path d="M4 14h4l5 4V6l-5 4H4v4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></>,
  reset: <><path d="M4 10a8 8 0 1 1 2 7M4 10V4M4 10h6"/></>,
}

function ToolIcon({ name }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
}

export default function AccessibilityTools() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(defaults)
  const [ready, setReady] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
        if (stored && typeof stored === 'object') setSettings({ ...defaults, ...stored, speech: false })
      } catch { /* Ignore invalid browser storage. */ }
      setReady(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!settings.speech || !('speechSynthesis' in window)) return undefined

    const speakClickedText = (event) => {
      if (event.target.closest('[data-accessibility-widget]')) return
      const element = event.target.closest('p,h1,h2,h3,h4,h5,h6,li,a,button,label,figcaption,blockquote,td,th,dt,dd,span,strong,small,time')
      if (!element || element.closest('[aria-hidden="true"]')) return
      const text = element.innerText?.replace(/\s+/g, ' ').trim()
      if (!text) return
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 1500))
      utterance.lang = document.documentElement.lang === 'en' ? 'en-US' : 'id-ID'
      utterance.rate = .95
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }

    document.addEventListener('click', speakClickedText)
    return () => {
      document.removeEventListener('click', speakClickedText)
      window.speechSynthesis.cancel()
    }
  }, [settings.speech])

  useEffect(() => {
    if (!ready) return
    const root = document.documentElement
    root.style.fontSize = `${100 + settings.fontScale * 10}%`
    root.dataset.a11yGrayscale = String(settings.grayscale)
    root.dataset.a11yNegative = String(settings.negative)
    root.dataset.a11yUnderline = String(settings.underline)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, speech: false }))
  }, [ready, settings])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }))
  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return
    if (settings.speech) {
      window.speechSynthesis.cancel()
      update('speech', false)
      return
    }
    update('speech', true)
  }

  const reset = () => {
    window.speechSynthesis?.cancel()
    setSettings(defaults)
  }

  const tools = [
    { label: 'Perbesar teks', icon: 'increase', action: () => update('fontScale', Math.min(3, settings.fontScale + 1)), disabled: settings.fontScale >= 3 },
    { label: 'Perkecil teks', icon: 'decrease', action: () => update('fontScale', Math.max(-1, settings.fontScale - 1)), disabled: settings.fontScale <= -1 },
    { label: 'Skala abu-abu', icon: 'grayscale', action: () => toggle('grayscale'), active: settings.grayscale },
    { label: 'Kontras negatif', icon: 'contrast', action: () => toggle('negative'), active: settings.negative },
    { label: 'Garis bawahi tautan', icon: 'underline', action: () => toggle('underline'), active: settings.underline },
    { label: settings.speech ? 'Matikan pembaca klik' : 'Aktifkan pembaca klik', icon: 'speech', action: toggleSpeech, active: settings.speech },
    { label: 'Atur ulang', icon: 'reset', action: reset },
  ]

  return (
    <div className={styles.widget} ref={panelRef} data-accessibility-widget>
      <section className={`${styles.panel} ${open ? styles.panelOpen : ''}`} aria-hidden={!open} aria-label="Alat aksesibilitas">
        <div className={styles.panelHead}>
          <span>AKSESIBILITAS</span>
          <strong>Sesuaikan tampilan</strong>
        </div>
        <div className={styles.toolList}>
          {tools.map((tool) => (
            <button type="button" className={tool.active ? styles.active : ''} onClick={tool.action} disabled={tool.disabled} aria-pressed={tool.active ?? undefined} key={tool.label}>
              <ToolIcon name={tool.icon} />
              <span>{tool.label}</span>
              {tool.active && <i aria-hidden="true" />}
            </button>
          ))}
        </div>
        <p>Aktifkan pembaca klik, lalu tekan teks mana pun yang ingin didengar.</p>
      </section>

      <button className={styles.trigger} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Tutup alat aksesibilitas' : 'Buka alat aksesibilitas'}>
        <span aria-hidden="true" className={styles.person}><i /><b /><em /></span>
        <small>{open ? 'Tutup' : 'Akses'}</small>
      </button>
    </div>
  )
}
