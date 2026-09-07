'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useExperience } from '@/context/ExperienceContext'
import styles from './TourismExplorer.module.css'
import heroStyles from './TourismLanding.module.css'

const TourismLocationMap=dynamic(()=>import('./TourismLocationMap'),{ssr:false})
const PAGE_SIZE=9

const radians = (degree) => degree * Math.PI / 180
const distanceBetween = (a,b) => {
  if (!a || b.latitude === null || b.longitude === null) return null
  const dLat=radians(b.latitude-a.latitude), dLng=radians(b.longitude-a.longitude)
  const value=Math.sin(dLat/2)**2+Math.cos(radians(a.latitude))*Math.cos(radians(b.latitude))*Math.sin(dLng/2)**2
  return 6371000*2*Math.atan2(Math.sqrt(value),Math.sqrt(1-value))
}
const shortText = (value,max=118) => value.length > max ? `${value.slice(0,max).trim()}…` : value
const distanceLabel = (meters,language) => meters === null ? (language === 'en' ? 'Location needed' : 'Perlu lokasi') : meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`
/** @param {{ destinations?: import('@/lib/tourism-api').TourismItem[], culinaries?: import('@/lib/tourism-api').TourismItem[], hotels?: import('@/lib/tourism-api').TourismItem[], initialView?: 'destination'|'culinary'|'hotel' }} props */
export default function TourismExplorer({ destinations=[],culinaries=[],hotels=[],initialView='destination' }) {
  const { language,t }=useExperience()
  const view=initialView
  const heroRef=useRef(null)
  const locationWatcherRef=useRef(null)
  const [query,setQuery]=useState(''),[stars,setStars]=useState(0),[radius,setRadius]=useState(0)
  const [page,setPage]=useState(1)
  const [location,setLocation]=useState(null),[locationStatus,setLocationStatus]=useState('idle')
  const [locationPermission,setLocationPermission]=useState('prompt')
  const locationOptions={enableHighAccuracy:true,timeout:15000,maximumAge:10000}
  const acceptLocation=({coords})=>{setLocation({latitude:coords.latitude,longitude:coords.longitude,accuracy:coords.accuracy});setLocationStatus('ready')}
  const rejectLocation=error=>{setLocationStatus(error?.code===1?'blocked':error?.code===3?'timeout':'unavailable')}
  const startLocationWatcher=()=>{
    if(locationWatcherRef.current!==null)navigator.geolocation.clearWatch(locationWatcherRef.current)
    locationWatcherRef.current=navigator.geolocation.watchPosition(acceptLocation,rejectLocation,locationOptions)
  }
  const locate=()=>{
    if(!navigator.geolocation){setLocationStatus('unavailable');return}
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(position=>{acceptLocation(position);startLocationWatcher()},rejectLocation,locationOptions)
  }
  useEffect(()=>{
    let permission
    const handlePermissionChange=()=>{setLocationPermission(permission.state);if(permission.state==='denied')setLocationStatus('blocked')}
    navigator.permissions?.query({name:'geolocation'}).then(result=>{permission=result;handlePermissionChange();permission.addEventListener?.('change',handlePermissionChange)}).catch(()=>{})
    return ()=>{permission?.removeEventListener?.('change',handlePermissionChange);if(locationWatcherRef.current!==null)navigator.geolocation?.clearWatch(locationWatcherRef.current)}
  },[])
  const source=view==='destination'?destinations:view==='culinary'?culinaries:hotels
  const items=useMemo(()=>source.map(item=>({...item,distance:distanceBetween(location,item)})).filter(item=>`${item.nameId} ${item.nameEn} ${item.address}`.toLowerCase().includes(query.trim().toLowerCase())&&(view!=='hotel'||(!stars||item.stars===stars))&&(!radius||(item.distance!==null&&item.distance<=radius))).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)),[location,query,radius,source,stars,view])
  const pageCount=Math.max(1,Math.ceil(items.length/PAGE_SIZE))
  const activePage=Math.min(page,pageCount)
  const pageItems=items.slice((activePage-1)*PAGE_SIZE,activePage*PAGE_SIZE)
  const changePage=nextPage=>{
    const targetPage=Math.min(pageCount,Math.max(1,nextPage))
    if(targetPage===activePage)return
    setPage(targetPage)
  }
  const local=(item,field)=>language==='en'?item[`${field}En`]:item[`${field}Id`]
  const heroContent=view==='culinary'
    ? ['Wisata Kuliner','Makan enak,','kenali kotanya.','Jelajahi makanan khas dan tempat makan pilihan di Surabaya.']
    : view==='hotel'
      ? ['Hotel Terdekat','Temukan tempat,','untuk beristirahat.','Pilihan hotel untuk singgah dan melanjutkan perjalananmu di Surabaya.']
      : ['Destinasi','Temukan arah,','rasakan kotanya.','Dari ikon sejarah hingga ruang publik baru yang hidup.']
  const handlePointerMove=event=>{const hero=heroRef.current;if(!hero)return;const bounds=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',`${((event.clientX-bounds.left)/bounds.width-.5)*2}`);hero.style.setProperty('--pointer-y',`${((event.clientY-bounds.top)/bounds.height-.5)*2}`)}
  const resetPointer=()=>{heroRef.current?.style.setProperty('--pointer-x','0');heroRef.current?.style.setProperty('--pointer-y','0')}

  return <section className={styles.explorer}>
    <header className={`${heroStyles.intro} ${view==='hotel'?heroStyles.hotelIntro:view==='destination'?heroStyles.destinationIntro:''}`} ref={heroRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <div className={heroStyles.heroGlow} aria-hidden="true" />
      <div className={heroStyles.introMeta}><span>08 / JELAJAHI KOTA</span><span>{t(heroContent[0]).toUpperCase()}</span></div>
      <div className={heroStyles.introCopy}>
        <p>EXPLORE SURABAYA</p>
        <h1>{t(heroContent[1])}<br/><em>{t(heroContent[2])}</em></h1>
        <span>{t(heroContent[3])}</span>
        <div className={heroStyles.heroActions}><Link href="/wisata">← {t('Kembali ke wisata')}</Link><Link href="#jelajahi-wisata">{t('Lihat pilihan')}</Link></div>
      </div>
      <div className={heroStyles.heroVisual} aria-hidden="true">
        <span className={`${heroStyles.decoration} ${heroStyles.decorationOne}`}>✦</span><span className={`${heroStyles.decoration} ${heroStyles.decorationTwo}`}>✿</span><span className={`${heroStyles.decoration} ${heroStyles.decorationThree}`}>✦</span>
        <span className={heroStyles.glassOrb}/><span className={heroStyles.glassRing}/><span className={heroStyles.glassBlock}/>
      </div>
      <div className={heroStyles.heroBottom}><span>{t('MENJELAJAHI CERITA, RASA, DAN RUANG DI SURABAYA.')}</span><Link href="#jelajahi-wisata">{t('Explore more')}</Link></div>
    </header>
    <section className={styles.locationPanel} id="jelajahi-wisata">
      <div className={styles.mapArt}>
        <TourismLocationMap location={location} items={items} language={language}/>
      </div>
      <div className={styles.locationCopy}>
        <span>SMART LOCATION</span>
        <h2>{locationStatus==='ready'?t('Lokasimu ditemukan.'):locationStatus==='blocked'?t('Izin lokasi diblokir.'):t('Temukan yang terdekat.')}</h2>
        <p>{locationStatus==='ready'?t('Daftar otomatis diurutkan berdasarkan jarak dari lokasimu.'):locationStatus==='blocked'?t('Izinkan lokasi melalui ikon di samping alamat browser, lalu muat ulang halaman.'):t('Izinkan lokasi untuk melihat jarak destinasi, kuliner, dan hotel terdekat.')}</p>
        <button type="button" onClick={locate} disabled={locationStatus==='loading'} data-permission={locationPermission}>{locationStatus==='loading'?t('Mendeteksi lokasi…'):locationStatus==='ready'?t('Perbarui lokasi'):locationStatus==='blocked'?t('Coba minta izin lagi'):t('Gunakan lokasi saya')} <span>⌖</span></button>
        {locationStatus==='timeout'&&<small>{t('Permintaan lokasi habis waktu. Pastikan GPS perangkat aktif lalu coba lagi.')}</small>}
        {locationStatus==='unavailable'&&<small>{t('Lokasi tidak tersedia. Aktifkan layanan lokasi perangkat dan periksa izin browser.')}</small>}
        {locationStatus==='blocked'&&<small>{t('Browser tidak dapat menampilkan permintaan izin selama status lokasi masih diblokir.')}</small>}
      </div>
    </section>
    <div className={styles.toolbar}><div className={styles.tabs}><Link className={view==='destination'?styles.active:''} href="/wisata/destinations">{t('Destinasi')}</Link><Link className={view==='culinary'?styles.active:''} href="/wisata/culinaries">{t('Wisata Kuliner')}</Link><Link className={view==='hotel'?styles.active:''} href="/wisata/hotels">{t('Hotel Terdekat')}</Link></div><label><span>⌕</span><input value={query} onChange={event=>{setQuery(event.target.value);setPage(1)}} placeholder={t('Cari tempat atau kawasan...')}/><b>{items.length}</b></label></div>
    {view==='hotel'&&<div className={styles.hotelFilters}>
      <label><span>{t('Bintang hotel')}</span><select value={stars} onChange={event=>{setStars(Number(event.target.value));setPage(1)}} aria-label={t('Bintang hotel')}><option value="0">{t('Semua bintang')}</option>{[1,2,3,4,5].map(value=><option value={value} key={value}>{value} ★</option>)}</select></label>
      <label><span>{t('Jarak hotel')}</span><select value={radius} onChange={event=>{const nextRadius=Number(event.target.value);setRadius(nextRadius);setPage(1);if(nextRadius&&!location&&locationStatus!=='loading')locate()}} aria-label={t('Jarak hotel')}><option value="0">{t('Semua jarak')}</option><option value="1000">≤ 1 km</option><option value="3000">≤ 3 km</option><option value="5000">≤ 5 km</option><option value="10000">≤ 10 km</option></select></label>
      <p>{t('Harga tidak tersedia di API resmi. Hubungi hotel untuk tarif terkini.')}</p>
    </div>}
    <><div className={styles.heading}><div><span>{view==='destination'?'WHERE TO GO':view==='culinary'?t('WISATA KULINER'):t('HOTEL TERDEKAT')}</span><h2>{view==='destination'?t('Jelajahi Surabaya.'):view==='culinary'?t('Cicipi Surabaya.'):t('Menginap di Surabaya.')}</h2></div><p>{view==='hotel'?t('Urutkan hotel berdasarkan bintang dan jarak aktual dari lokasimu.'):view==='culinary'?t('Dari resep legendaris hingga tempat makan favorit warga.'):t('Pilihan ringkas, hanya berada di wilayah Surabaya.')}</p></div><div key={activePage} className={`${styles.grid} ${styles.gridPage}`}>{pageItems.map((item,index)=><TourismCard item={item} index={(activePage-1)*PAGE_SIZE+index} view={view} language={language} local={local} t={t} key={item.id}/>)}</div>{pageCount>1&&<nav className={styles.pagination} aria-label={t('Navigasi halaman')}><button className={styles.pageDirection} type="button" aria-label={t('Sebelumnya')} title={t('Sebelumnya')} onClick={()=>changePage(activePage-1)} disabled={activePage===1}><span aria-hidden="true">←</span></button><div>{Array.from({length:pageCount},(_,index)=>index+1).map(value=><button type="button" className={value===activePage?styles.currentPage:''} aria-label={`${t('Halaman')} ${value}`} aria-current={value===activePage?'page':undefined} onClick={()=>changePage(value)} key={value}>{value}</button>)}</div><button className={`${styles.pageDirection} ${styles.nextPage}`} type="button" aria-label={t('Selanjutnya')} title={t('Selanjutnya')} onClick={()=>changePage(activePage+1)} disabled={activePage===pageCount}><span aria-hidden="true">→</span></button></nav>}</>
    {!items.length&&<p className={styles.empty}>{t('Tempat tidak ditemukan. Coba ubah filter atau kata kunci.')}</p>}
  </section>
}

function TourismCard({item,index,view,language,local,t}) {
  const detailHref=`/wisata/${view==='hotel'?'hotels':view==='culinary'?'culinaries':'destinations'}/${encodeURIComponent(item.id)}`
  return <article className={styles.card}>
    <Link href={detailHref} className={styles.cardLink} aria-label={`${t('Lihat detail')} ${local(item,'name')}`} />
    <div className={styles.visual} style={item.image?{backgroundImage:`linear-gradient(180deg,transparent,rgba(10,18,31,.68)),url("${item.image}")`}:undefined}><span>{String(index+1).padStart(2,'0')}</span><b>{view==='hotel'?`${item.stars||'–'} ★`:t(item.category)}</b></div>
    <div className={styles.copy}><div className={styles.meta}><span>{shortText(item.address,60)}</span><b>{distanceLabel(item.distance,language)}</b></div><h3>{local(item,'name')}</h3><p>{shortText(local(item,'description')||'',118)}</p><div className={styles.actions}><a href={item.mapsUrl} target="_blank" rel="noreferrer">{t('Buka di peta')} ↗</a>{view==='hotel'&&(item.website?<a href={item.website} target="_blank" rel="noreferrer">{t('Cek hotel')} ↗</a>:item.phone?<a href={`tel:${item.phone}`}>{t('Hubungi hotel')}</a>:<span>{t('Hubungi hotel')}</span>)}</div></div>
  </article>
}
