'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useExperience } from '@/context/ExperienceContext'
import styles from './TourismExplorer.module.css'

const radians = (degree) => degree * Math.PI / 180
const distanceBetween = (a,b) => {
  if (!a || b.latitude === null || b.longitude === null) return null
  const dLat=radians(b.latitude-a.latitude), dLng=radians(b.longitude-a.longitude)
  const value=Math.sin(dLat/2)**2+Math.cos(radians(a.latitude))*Math.cos(radians(b.latitude))*Math.sin(dLng/2)**2
  return 6371000*2*Math.atan2(Math.sqrt(value),Math.sqrt(1-value))
}
const shortText = (value,max=118) => value.length > max ? `${value.slice(0,max).trim()}…` : value
const distanceLabel = (meters,language) => meters === null ? (language === 'en' ? 'Location needed' : 'Perlu lokasi') : meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`
const ingredientOf = (item) => {
  const text=`${item.nameId} ${item.descriptionId}`.toLowerCase()
  if (/sate|ayam|bebek|daging|rawon|cingur/.test(text)) return 'Daging'
  if (/ikan|udang|kepiting|kerang|seafood/.test(text)) return 'Seafood'
  if (/tahu|tempe|tauge|sayur|pecel|gado/.test(text)) return 'Sayuran'
  if (/nasi|lontong|ketupat/.test(text)) return 'Nasi & Lontong'
  if (/kue|roti|es |dessert|jajan|puding/.test(text)) return 'Jajanan'
  return 'Lainnya'
}
const ingredientLabels={Daging:'Meat',Seafood:'Seafood',Sayuran:'Vegetables','Nasi & Lontong':'Rice & Lontong',Jajanan:'Snacks',Lainnya:'Others'}

/** @param {{ destinations?: import('@/lib/tourism-api').TourismItem[], culinaries?: import('@/lib/tourism-api').TourismItem[], hotels?: import('@/lib/tourism-api').TourismItem[], initialView?: 'destination'|'culinary'|'hotel' }} props */
export default function TourismExplorer({ destinations=[],culinaries=[],hotels=[],initialView='destination' }) {
  const { language,t }=useExperience()
  const view=initialView
  const [query,setQuery]=useState(''),[stars,setStars]=useState(0),[radius,setRadius]=useState(0),[ingredient,setIngredient]=useState('Semua')
  const [location,setLocation]=useState(null),[locationStatus,setLocationStatus]=useState('idle')
  const locate=()=>{ setLocationStatus('loading'); navigator.geolocation?.getCurrentPosition(({coords})=>{setLocation({latitude:coords.latitude,longitude:coords.longitude});setLocationStatus('ready')},()=>setLocationStatus('error'),{enableHighAccuracy:false,timeout:8000,maximumAge:300000}) }
  const source=view==='destination'?destinations:view==='culinary'?culinaries:hotels
  const items=useMemo(()=>source.map(item=>({...item,distance:distanceBetween(location,item),ingredient:ingredientOf(item)})).filter(item=>`${item.nameId} ${item.nameEn} ${item.address}`.toLowerCase().includes(query.trim().toLowerCase())&&(view!=='hotel'||(!stars||item.stars===stars))&&(view!=='culinary'||ingredient==='Semua'||item.ingredient===ingredient)&&(!radius||item.distance===null||item.distance<=radius)).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)),[ingredient,location,query,radius,source,stars,view])
  const local=(item,field)=>language==='en'?item[`${field}En`]:item[`${field}Id`]

  return <section className={styles.explorer}>
    <header className={styles.hero}><Link href="/">← {t('Kembali ke beranda')}</Link><span>EXPLORE SURABAYA / 2026</span><h1>{t('Temukan arah,')}<br/><em>{t('rasakan kotanya.')}</em></h1><p>{t('Wisata, kuliner, dan hotel terdekat di Surabaya.')}</p></header>
    <section className={styles.locationPanel}>
      <div className={styles.mapArt} aria-hidden="true"><i className={styles.roadOne}/><i className={styles.roadTwo}/><span className={locationStatus==='ready'?styles.pinReady:''}><b>YOU<br/>ARE<br/>HERE</b></span></div>
      <div className={styles.locationCopy}><span>SMART LOCATION</span><h2>{locationStatus==='ready'?t('Lokasimu ditemukan.'):t('Temukan yang terdekat.')}</h2><p>{locationStatus==='ready'?t('Daftar otomatis diurutkan berdasarkan jarak dari lokasimu.'):t('Izinkan lokasi untuk melihat jarak destinasi, kuliner, dan hotel terdekat.')}</p><button type="button" onClick={locate} disabled={locationStatus==='loading'}>{locationStatus==='loading'?t('Mendeteksi lokasi…'):locationStatus==='ready'?t('Perbarui lokasi'):t('Gunakan lokasi saya')} <span>⌖</span></button>{locationStatus==='error'&&<small>{t('Lokasi tidak tersedia. Periksa izin lokasi browser.')}</small>}</div>
    </section>
    <div className={styles.toolbar}><div className={styles.tabs}><Link className={view==='destination'?styles.active:''} href="/wisata/destinations">{t('Destinasi')}</Link><Link className={view==='culinary'?styles.active:''} href="/wisata/culinaries">{t('Wisata Kuliner')}</Link><Link className={view==='hotel'?styles.active:''} href="/wisata/hotels">{t('Hotel Terdekat')}</Link></div><label><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t('Cari tempat atau kawasan...')}/><b>{items.length}</b></label></div>
    {view==='hotel'&&<div className={styles.hotelFilters}><div><span>{t('Bintang hotel')}</span>{[0,1,2,3,4,5].map(value=><button className={stars===value?styles.selectedFilter:''} onClick={()=>setStars(value)} key={value}>{value===0?t('Semua'):`${value} ★`}</button>)}</div><div><span>{t('Jarak maksimum')}</span>{[[0,t('Semua')],[1000,'1 km'],[3000,'3 km'],[5000,'5 km']].map(([value,label])=><button className={radius===value?styles.selectedFilter:''} onClick={()=>setRadius(value)} key={value}>{label}</button>)}</div><p>{t('Harga tidak tersedia di API resmi. Hubungi hotel untuk tarif terkini.')}</p></div>}
    {view==='culinary'?<CulinaryGuide items={items} language={language} local={local} t={t} ingredient={ingredient} setIngredient={setIngredient}/>:<><div className={styles.heading}><div><span>{view==='destination'?'WHERE TO GO':t('HOTEL TERDEKAT')}</span><h2>{view==='destination'?t('Jelajahi Surabaya.'):t('Menginap di Surabaya.')}</h2></div><p>{view==='hotel'?t('Urutkan hotel berdasarkan bintang dan jarak aktual dari lokasimu.'):t('Pilihan ringkas, hanya berada di wilayah Surabaya.')}</p></div><div className={styles.grid}>{items.map((item,index)=><TourismCard item={item} index={index} view={view} language={language} local={local} t={t} key={item.id}/>)}</div></>}
    {!items.length&&<p className={styles.empty}>{t('Tempat tidak ditemukan. Coba ubah filter atau kata kunci.')}</p>}
  </section>
}

function TourismCard({item,index,view,language,local,t}) { return <article className={styles.card}><a href={item.mapsUrl} target="_blank" rel="noreferrer" className={styles.visual} style={item.image?{backgroundImage:`linear-gradient(180deg,transparent,rgba(10,18,31,.68)),url("${item.image}")`}:undefined}><span>{String(index+1).padStart(2,'0')}</span><b>{view==='hotel'?`${item.stars||'–'} ★`:item.category}</b></a><div className={styles.copy}><div className={styles.meta}><span>{shortText(item.address,60)}</span><b>{distanceLabel(item.distance,language)}</b></div><h3>{local(item,'name')}</h3><p>{shortText(local(item,'description')||'',118)}</p><div className={styles.actions}><a href={item.mapsUrl} target="_blank" rel="noreferrer">{t('Buka di peta')} ↗</a>{view==='hotel'&&(item.website?<a href={item.website} target="_blank" rel="noreferrer">{t('Cek hotel')} ↗</a>:item.phone?<a href={`tel:${item.phone}`}>{t('Hubungi hotel')}</a>:<span>{t('Hubungi hotel')}</span>)}</div></div></article> }

function CulinaryGuide({items,language,local,t,ingredient,setIngredient}) {
  const featured=items[0], highlights=items.slice(0,5), restaurants=items.slice(1)
  const ingredients=['Semua','Daging','Seafood','Sayuran','Nasi & Lontong','Jajanan','Lainnya']
  return <div className={styles.culinaryGuide}>
    <section className={styles.foodHero} style={featured?.image?{backgroundImage:`linear-gradient(90deg,rgba(24,36,56,.1),rgba(24,36,56,.78)),url("${featured.image}")`}:undefined}><div><span>{t('RASA KHAS SURABAYA')}</span><h2>{t('Makan enak,')}<br/>{t('kenali kotanya.')}</h2><p>{t('Jelajahi makanan khas dan tempat makan pilihan di Surabaya.')}</p>{featured&&<a href={featured.mapsUrl} target="_blank" rel="noreferrer">{t('Lihat pilihan hari ini')} ↗</a>}</div></section>
    <section className={styles.ingredientSection}><div className={styles.foodTitle}><span>{t('FILTER BAHAN UTAMA')}</span><h2>{t('Pilih sesuai selera.')}</h2></div><div className={styles.ingredientFilters}>{ingredients.map((name,index)=><button type="button" className={ingredient===name?styles.activeIngredient:''} onClick={()=>setIngredient(name)} key={name}><i className={styles.ingredientIcon} style={{'--icon-index':index}} aria-hidden="true"/><span>{language==='en'?(name==='Semua'?'All':ingredientLabels[name]):name}</span></button>)}</div></section>
    {featured&&<section className={styles.featuredFood}><div className={styles.featuredPhoto} style={featured.image?{backgroundImage:`url("${featured.image}")`}:undefined}/><div><span>{t('SOROTAN KULINER')}</span><h2>{local(featured,'name')}</h2><p>{shortText(local(featured,'description')||'',150)}</p><small>{featured.address} · {distanceLabel(featured.distance,language)}</small><a href={featured.mapsUrl} target="_blank" rel="noreferrer">{t('Buka di peta')} ↗</a></div></section>}
    <section className={styles.signatureFoods}><div className={styles.foodTitle}><span>{t('MAKANAN KHAS')}</span><h2>{t('Ikon rasa Surabaya.')}</h2></div><div>{highlights.map(item=><a href={item.mapsUrl} target="_blank" rel="noreferrer" key={item.id}><i style={item.image?{backgroundImage:`url("${item.image}")`}:undefined}/><span><strong>{local(item,'name')}</strong><small>{item.ingredient}</small></span></a>)}</div></section>
    <section className={styles.restaurantSection}><div className={styles.foodTitle}><span>{t('TEMPAT MAKAN')}</span><h2>{t('Restoran & kuliner pilihan.')}</h2><p>{t('Diurutkan berdasarkan jarak jika lokasimu diaktifkan.')}</p></div><div className={styles.restaurantGrid}>{restaurants.map((item,index)=><TourismCard item={item} index={index} view="culinary" language={language} local={local} t={t} key={item.id}/>)}</div></section>
  </div>
}
