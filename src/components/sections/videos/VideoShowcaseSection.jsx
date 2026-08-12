'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useExperience } from '@/context/ExperienceContext'
import styles from './VideoShowcaseSection.module.css'

const CHANNEL_URL = 'https://www.youtube.com/@BanggaSurabaya'
const localizedDate = (value, language) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return language === 'en' ? 'Latest' : 'Terbaru'
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'id-ID', { day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Jakarta' }).format(date)
}
/** @param {{ videos?: import('@/lib/youtube-api').CityVideo[] }} props */
export default function VideoShowcaseSection({ videos = [] }) {
  const { t, language } = useExperience()
  const trackRef = useRef(null)
  const [selected, setSelected] = useState(videos[1] || videos[0])
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const move = (direction) => trackRef.current?.scrollBy({ left: direction * 650, behavior: 'smooth' })

  useEffect(() => {
    const close = (event) => event.key === 'Escape' && setIsPlayerOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  if (!selected) return null

  return (
    <section className={styles.videoSection} id="video" aria-labelledby="video-title">
      <div className={styles.collectionPanel}>
        <div className={styles.panelHead}>
          <div><span>BANGGA SURABAYA</span><h2 id="video-title">Video <strong>Pilihan</strong> <em>({videos.length})</em></h2><p><b>{String(videos.length).padStart(2, '0')}</b> tayangan terbaru dari kanal resmi kota</p></div>
          <div className={styles.progress} aria-hidden="true">{videos.map((video) => <i className={video.id === selected.id ? styles.activeProgress : ''} key={video.id} />)}</div>
          <div className={styles.headerActions}><a href={CHANNEL_URL} target="_blank" rel="noreferrer">Lihat semua</a><button onClick={() => move(-1)} type="button" aria-label="Geser ke kiri">←</button><button onClick={() => move(1)} type="button" aria-label="Geser ke kanan">→</button></div>
        </div>

        <div className={styles.track} ref={trackRef}>
          {videos.map((video, index) => (
            <article className={video.id === selected.id ? styles.selectedCard : ''} key={video.id} onMouseEnter={() => setSelected(video)}>
              <button className={styles.videoCard} type="button" onClick={() => { setSelected(video); setIsPlayerOpen(true) }} aria-label={`Putar ${video.title}`}>
                <Image src={video.image} alt="" width={480} height={360} sizes="(max-width: 780px) 78vw, 322px" unoptimized />
                <span className={styles.cardShade} />
                <div className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</div>
                <div className={styles.cardCopy}><small>{t(video.category)}</small><h3>{t(video.title)}</h3><p>Bangga Surabaya · {localizedDate(video.publishedAt, language)}</p></div>
                <span className={styles.miniPlay} aria-hidden="true">▶</span>
              </button>
              <div className={styles.cardStatus}>{video.id === selected.id ? 'SIAP DITONTON' : 'PILIH VIDEO'} <span>→</span></div>
            </article>
          ))}
        </div>
      </div>

      {isPlayerOpen && (
        <div className={styles.playerOverlay} role="dialog" aria-modal="true" aria-labelledby="player-title" onMouseDown={(event) => event.target === event.currentTarget && setIsPlayerOpen(false)}>
          <div className={styles.playerWindow}>
            <button className={styles.closeButton} type="button" onClick={() => setIsPlayerOpen(false)} aria-label="Tutup pemutar">×</button>
            <main className={styles.playerMain}>
              <div className={styles.playerNav}><span>← &nbsp; Video Kota</span><strong>Video {String(videos.findIndex((video) => video.id === selected.id) + 1).padStart(2, '0')}</strong><span>Video berikutnya &nbsp; →</span></div>
              <div className={styles.playerFrame}><iframe src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1&rel=0`} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
              <div className={styles.tabs}><b>Ringkasan</b><span>Informasi</span><span>Bagikan</span></div>
              <div className={styles.overview}><h3 id="player-title">{selected.title}</h3><p>Video informasi resmi mengenai program, pelayanan, dan perkembangan terbaru Kota Surabaya.</p></div>
            </main>
            <aside className={styles.playerAside}>
              <div className={styles.channelCard}><span>BS</span><div><small>Kanal resmi</small><strong>Bangga Surabaya</strong></div><a href={CHANNEL_URL} target="_blank" rel="noreferrer">Buka kanal</a><p>Kegiatan, program, dan cerita terbaru dari Kota Surabaya.</p></div>
              <div className={styles.suggestions}><div><h3>Video lainnya</h3><span>{videos.length - 1} pilihan</span></div>{videos.filter((video) => video.id !== selected.id).slice(0, 3).map((video) => <button type="button" key={video.id} onClick={() => setSelected(video)}><Image src={video.image} alt="" width={164} height={116} unoptimized /><span><strong>{video.title}</strong><small>{video.category}</small></span></button>)}</div>
            </aside>
          </div>
        </div>
      )}
    </section>
  )
}
