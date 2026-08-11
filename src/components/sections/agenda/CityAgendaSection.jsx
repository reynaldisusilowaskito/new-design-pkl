import Image from 'next/image'
import styles from './CityAgendaSection.module.css'

const AGENDA_URL = 'https://surabaya.go.id/id/agenda'
const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' })
const fullDateFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })

function getDateParts(value) {
  const parsed = new Date(value)
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed
  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: monthFormatter.format(date).replace('.', '').toUpperCase(),
    year: String(date.getUTCFullYear()),
    full: fullDateFormatter.format(date),
  }
}

function AgendaImage({ item, sizes }) {
  if (!item.image) return null
  return <Image src={item.image} alt="" width={900} height={675} sizes={sizes} />
}

const Arrow = () => <span aria-hidden="true">↗</span>

/** @param {{ events?: import('@/lib/surabaya-api').CityAgendaItem[] }} props */
export default function CityAgendaSection({ events = [] }) {
  if (!events.length) return null
  const [featured, training = featured, independence = featured, finalists = featured, finalEvent = featured] = events
  const featuredDate = getDateParts(featured.publishedAt)
  const trainingDate = getDateParts(training.publishedAt)
  const finalDate = getDateParts(finalEvent.publishedAt)
  const listEvents = [independence, finalists, finalEvent]

  return (
    <section className={styles.calendar} id="agenda-kota" aria-labelledby="calendar-title">
      <div className={styles.topLine}>
        <p><span>07</span> Kalender Surabaya</p>
        <p><i /> Sumber resmi Pemerintah Kota Surabaya</p>
      </div>

      <div className={styles.collage}>
        <article className={`${styles.tile} ${styles.introTile}`}>
          <p className={styles.kicker}>Temukan informasinya</p>
          <h2 id="calendar-title">KOTA INI<br /><em>SELALU PUNYA</em><br />CERITA.</h2>
          <p>Agenda, pengumuman resmi, ruang kreatif, dan kegiatan warga dalam satu kalender kota.</p>
          <a href="#agenda-list">Lihat agenda <Arrow /></a>
        </article>

        <a className={`${styles.tile} ${styles.heroTile}`} href={featured.url} target="_blank" rel="noreferrer">
          <div className={styles.fan} aria-hidden="true">{Array.from({ length: 12 }).map((_, index) => <i style={{ '--ray': index }} key={index} />)}</div>
          <AgendaImage item={featured} sizes="(max-width: 980px) 90vw, 55vw" />
          <div className={styles.heroCopy}><span>{featured.status}</span><h3>{featured.title}</h3><p>{featuredDate.full} · {featured.location}</p></div>
        </a>

        <article className={`${styles.tile} ${styles.monthTile}`}>
          <span>Terbaru</span><strong>{featuredDate.day}</strong><p>{featuredDate.month}<br />{featuredDate.year}</p>
        </article>

        <a className={`${styles.tile} ${styles.photoTile}`} href={training.url} target="_blank" rel="noreferrer">
          <AgendaImage item={training} sizes="(max-width: 980px) 65vw, 38vw" />
          <div><span>{training.category}</span><h3>{training.title}</h3><p>{trainingDate.full} · {training.location}</p></div>
        </a>

        <article className={`${styles.tile} ${styles.listTile}`} id="agenda-list">
          <div className={styles.listHead}><span>Informasi berikutnya</span><small>{featuredDate.year}</small></div>
          {listEvents.map((event, index) => {
            const date = getDateParts(event.publishedAt)
            return <a href={event.url} target="_blank" rel="noreferrer" key={event.id}><span>0{index + 1}</span><time><strong>{date.day}</strong><small>{date.month}</small></time><div><h3>{event.title}</h3><p>{event.location}</p></div><Arrow /></a>
          })}
        </article>

        <article className={`${styles.tile} ${styles.promptTile}`}>
          <div className={styles.promptMark} aria-hidden="true">{Array.from({ length: 14 }).map((_, index) => <i style={{ '--mark': index }} key={index} />)}</div>
          <h3>APA YANG TERJADI<br />DI SURABAYA?</h3><p>Temukan informasi kota yang penting untuk aktivitasmu.</p>
        </article>

        <a className={`${styles.tile} ${styles.finalTile}`} href={finalEvent.url} target="_blank" rel="noreferrer">
          <div className={styles.dateBlock}><span>{finalDate.month}</span><strong>{finalDate.day}</strong></div>
          <div><p>Agenda pilihan</p><h3>{finalEvent.title}</h3><small>{finalEvent.location}</small></div><Arrow />
        </a>

        <article className={`${styles.tile} ${styles.sourceTile}`}>
          <span>SUMBER RESMI</span><p>Informasi ditampilkan dari API Pemerintah Kota Surabaya dan dapat diperbarui tanpa mengubah desain section.</p>
          <a href={AGENDA_URL} target="_blank" rel="noreferrer">surabaya.go.id <Arrow /></a>
        </article>
      </div>
    </section>
  )
}
