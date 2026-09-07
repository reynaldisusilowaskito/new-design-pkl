'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import styles from './HotelDetailMap.module.css'

const DetailLocationMap=dynamic(()=>import('./DetailLocationMap'),{ssr:false})

export default function DetailMapLoader(props){
  const hostRef=useRef(null)
  const [visible,setVisible]=useState(false)

  useEffect(()=>{
    if(visible||!hostRef.current)return undefined
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return
      setVisible(true)
      observer.disconnect()
    },{rootMargin:'320px 0px'})
    observer.observe(hostRef.current)
    return ()=>observer.disconnect()
  },[visible])

  return <div className={styles.mapFrame} ref={hostRef}>
    {visible?<DetailLocationMap {...props}/>:<div className={styles.mapPlaceholder} aria-hidden="true"/>}
  </div>
}
