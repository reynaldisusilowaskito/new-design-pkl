'use client'

import { useMemo, useState } from 'react'
import ServiceIcon from './ServiceIcon'
import styles from './GovernmentServicesSection.module.css'

const categories = ['Semua', 'Warga', 'Informasi', 'Usaha', 'Pendidikan']

/** @param {{ services?: import('@/lib/surabaya-api').ServiceItem[] }} props */
export default function GovernmentServicesSection({ services = [] }) {
  const [category, setCategory] = useState('Semua')
  const [query, setQuery] = useState('')
  const visibleServices = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('id-ID')
    return services.filter((service) => (category === 'Semua' || service.category === category)
      && (!keyword || `${service.title} ${service.description}`.toLocaleLowerCase('id-ID').includes(keyword)))
  }, [category, query, services])
  const popularServices = services.filter((service) => service.popular)

  return (
    <section className={styles.services} id="layanan" aria-labelledby="services-title">
      <div className={styles.sectionHead}>
        <div><span>05 / PELAYANAN PUBLIK</span><h2 id="services-title">Pelayanan Pemerintah<br /><em>Kota Surabaya</em></h2></div>
        <div className={styles.searchBox}>
          <span aria-hidden="true" />
          <label className={styles.srOnly} htmlFor="service-search">Cari layanan pemerintah</label>
          <input id="service-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari layanan..." type="search" />
          <b>{visibleServices.length}</b>
        </div>
      </div>

      <div className={styles.catalog}>
        <div className={styles.mainCatalog}>
          <div className={styles.catalogLabel}><span>Layanan untuk warga</span><small>{visibleServices.length} layanan ditemukan</small></div>
          {visibleServices.length ? (
            <div className={styles.serviceGrid}>
              {visibleServices.map((service, index) => (
                <a href={service.url} target="_blank" rel="noreferrer" key={service.id}>
                  <span className={`${styles.serviceIcon} ${styles[`tone${index % 5}`]}`}><ServiceIcon code={service.iconCode} /></span>
                  <div><strong>{service.title}</strong><small>{service.description}</small></div>
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </div>
          ) : <div className={styles.emptyState}><strong>Layanan belum ditemukan.</strong><span>Coba kata kunci atau kategori lainnya.</span></div>}

          <div className={styles.categoryArea}>
            <span>Jelajahi berdasarkan kebutuhan</span>
            <div className={styles.filters}>
              {categories.map((item, index) => (
                <button className={`${category === item ? styles.activeFilter : ''} ${styles[`filter${index}`]}`} key={item} type="button" onClick={() => setCategory(item)}>
                  <b>{item === 'Semua' ? services.length : services.filter((service) => service.category === item).length}</b><span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className={styles.popularPanel}>
          <div className={styles.popularHead}><span>Akses cepat</span><p>Layanan yang paling sering dibutuhkan warga.</p></div>
          <div className={styles.popularList}>
            {popularServices.map((service) => (
              <a href={service.url} target="_blank" rel="noreferrer" key={service.id}>
                <span className={styles.popularIcon}><ServiceIcon code={service.iconCode} /></span>
                <div><strong>{service.title}</strong><small>{service.description}</small></div>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
          <a className={styles.allServices} href="#layanan" onClick={() => { setCategory('Semua'); setQuery('') }}>Lihat semua layanan <span>→</span></a>
        </aside>
      </div>
    </section>
  )
}
