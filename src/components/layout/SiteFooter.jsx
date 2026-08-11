import Image from 'next/image'
import styles from './SiteFooter.module.css'

const navigation = [
  {
    title: 'Jelajahi',
    links: [
      ['Tentang Surabaya', '#tentang'],
      ['Layanan warga', '#layanan'],
      ['Kabar kota', '#kabar'],
      ['Video kota', '#video'],
      ['Agenda kota', '#agenda-kota'],
    ],
  },
  {
    title: 'Layanan publik',
    links: [
      ['WargaKu', 'https://wargaku.surabaya.go.id/'],
      ['PPID Kota Surabaya', 'https://ppid.surabaya.go.id/'],
      ['Satu Data Surabaya', 'https://satudata.surabaya.go.id/'],
      ['JDIH Surabaya', 'https://jdih.surabaya.go.id/'],
      ['LPSE Surabaya', 'https://lpse.surabaya.go.id/'],
    ],
  },
]

function ExternalLink({ href, children }) {
  const external = href.startsWith('http')
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}{external && <span aria-hidden="true">↗</span>}</a>
}

const validUrl = (value, fallback) => value?.startsWith('http') ? value : fallback

/** @param {{ organization: import('@/lib/surabaya-api').Organization }} props */
export default function SiteFooter({ organization }) {
  const phone = organization.phone_number || '(031) 531 2144'
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`
  const socials = [
    ['Instagram', validUrl(organization.instagram, 'https://www.instagram.com/surabaya/')],
    ['Facebook', validUrl(organization.facebook, 'https://www.facebook.com/sapawargakotasurabaya/')],
    ['YouTube', validUrl(organization.youtube, 'https://www.youtube.com/@BanggaSurabaya')],
    ['TikTok', validUrl(organization.tiktok, 'https://www.tiktok.com/@pidibaya')],
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <section className={styles.callout} aria-labelledby="footer-title">
          <div>
            <p className={styles.eyebrow}>PORTAL WARGA SURABAYA</p>
            <h2 id="footer-title">Masih mencari layanan atau informasi kota?</h2>
            <p className={styles.calloutCopy}>Kami bantu menghubungkan kebutuhanmu dengan kanal resmi Pemerintah Kota Surabaya.</p>
          </div>
          <div className={styles.actions}>
            <a className={styles.primaryAction} href="#layanan">Jelajahi layanan <span>→</span></a>
            <a className={styles.secondaryAction} href="https://wargaku.surabaya.go.id/" target="_blank" rel="noreferrer">Sampaikan pengaduan <span>↗</span></a>
          </div>
        </section>

        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.brandImages}>
              <Image className={styles.wordmark} src="/assets/redesign/hero/surabaya-wordmark-white-transparent.png" alt="Surabaya" width={2155} height={730} sizes="(max-width: 680px) 170px, 200px" />
              <Image className={styles.marks} src="/assets/redesign/hero/surabaya-mandatory-marks.png" alt="Identitas resmi Pemerintah Kota Surabaya" width={134} height={51} sizes="(max-width: 680px) 88px, 94px" />
            </div>
            <p>Portal informasi dan pelayanan publik resmi untuk warga Kota Surabaya.</p>
            <a className={styles.officialSite} href="https://surabaya.go.id/" target="_blank" rel="noreferrer">surabaya.go.id <span>↗</span></a>
          </div>

          {navigation.map((group) => (
            <nav className={styles.linkGroup} aria-label={group.title} key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.links.map(([label, href]) => <li key={label}><ExternalLink href={href}>{label}</ExternalLink></li>)}</ul>
            </nav>
          ))}

          <section className={styles.contact} aria-labelledby="contact-title">
            <p className={styles.contactLabel}>KONTAK PEMERINTAH KOTA</p>
            <h3 id="contact-title">Kami siap membantu.</h3>
            <address>{organization.address || 'Jl. Jimerto No. 25–27, Surabaya, Jawa Timur 60272'}</address>
            <a href={phoneHref}>{phone}</a>
            <a href="mailto:dinkominfo@surabaya.go.id">dinkominfo@surabaya.go.id</a>
            <p className={styles.hours}>Senin–Kamis 07.30–16.00<br />Jumat 07.30–15.00 WIB</p>
          </section>
        </div>

        <div className={styles.socialRow}>
          <p>Ikuti kabar Surabaya</p>
          <div>{socials.map(([label, href]) => <a href={href} target="_blank" rel="noreferrer" key={label}>{label} <span>↗</span></a>)}</div>
          <a className={styles.backToTop} href="#beranda" aria-label="Kembali ke bagian atas">Kembali ke atas <span>↑</span></a>
        </div>

        <div className={styles.cityName} aria-hidden="true">SURABAYA</div>
        <div className={styles.bottomBar}><p>© 2026 Pemerintah Kota Surabaya</p><p>Dikelola oleh Dinas Komunikasi dan Informatika Kota Surabaya</p></div>
      </div>
    </footer>
  )
}
