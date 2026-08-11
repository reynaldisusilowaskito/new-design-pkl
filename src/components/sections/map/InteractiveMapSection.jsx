'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './InteractiveMapSection.module.css'

const SurabayaMapCanvas = dynamic(() => import('./SurabayaMapCanvas'), { ssr: false })

export default function InteractiveMapSection({ districts }) {
  const sectionRef = useRef(null)
  const initialDistrict = districts.find((district) => district.key === 'MULYOREJO') || districts[0]
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict)
  const [shouldLoadMap, setShouldLoadMap] = useState(false)
  const [mapStatus, setMapStatus] = useState('loading')
  const selectDistrict = useCallback((district) => setSelectedDistrict(district), [])
  const handleMapReady = useCallback(() => setMapStatus('ready'), [])
  const handleMapError = useCallback(() => setMapStatus('error'), [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || shouldLoadMap) return undefined
    if (!('IntersectionObserver' in window)) {
      const fallbackTimer = window.setTimeout(() => setShouldLoadMap(true), 0)
      return () => window.clearTimeout(fallbackTimer)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldLoadMap(true)
      observer.disconnect()
    }, { rootMargin: '700px 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [shouldLoadMap])

  useEffect(() => {
    if (!shouldLoadMap || mapStatus !== 'loading') return undefined
    const timeout = window.setTimeout(() => setMapStatus('error'), 30000)
    return () => window.clearTimeout(timeout)
  }, [mapStatus, shouldLoadMap])
  const data = selectedDistrict.data
  const districtStats = [
    { label: 'Kepadatan penduduk', value: data.kepadatan.value, unit: 'jiwa/km²' },
    { label: 'Rasio gender', value: `${data.gender.female}%`, unit: `P · ${data.gender.male}% L` },
    { label: 'Usia produktif', value: data.usiaProduktif.value, unit: data.usiaProduktif.subtext },
    { label: 'Pertumbuhan', value: data.pertumbuhan.value, unit: data.pertumbuhan.subtext },
  ]

  return (
    <section className={styles.section} id="peta-surabaya" aria-labelledby="map-title" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionTop}>
          <p><span>03</span> Peta kota</p><p><i /> 31 kecamatan dapat dipilih</p>
        </div>
        <header className={styles.heading}>
          <div><h2 id="map-title"><span>Peta Interaktif,</span><em>jelajahi Surabaya.</em></h2></div>
          <div className={styles.intro} />
        </header>
        <div className={styles.mapShell}>
          <div className={styles.mapViewport}>
            {mapStatus === 'loading' && <div className={styles.mapLoading}>Menyiapkan peta Surabaya…</div>}
            {mapStatus === 'error' && <div className={styles.mapLoading}>Peta gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.</div>}
            {shouldLoadMap && <SurabayaMapCanvas districts={districts} onSelectDistrict={selectDistrict} onReady={handleMapReady} onError={handleMapError} />}
            <div className={styles.mapBadge}><span>PILIH WILAYAH</span><strong>Geser · zoom · klik</strong></div>
          </div>
          <aside className={styles.sidebar} aria-live="polite">
            <div className={styles.selectedPlace}>
              <span>Kecamatan terpilih</span><strong>{selectedDistrict.name}</strong><p>Data berubah saat wilayah dipilih</p>
            </div>
            <div className={styles.stats}>
              {districtStats.map((stat, index) => <article key={stat.label}>
                <span className={styles.statIndex}>0{index + 1}</span><p>{stat.label}</p>
                <div><strong>{stat.value}</strong><small>{stat.unit}</small></div>
              </article>)}
            </div>
            <div className={styles.dataNote}><span aria-hidden="true">◎</span><p><strong>Data demografi Surabaya</strong><br />Disiapkan melalui Server Component</p></div>
          </aside>
        </div>
      </div>
    </section>
  )
}
