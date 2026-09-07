'use client'

import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import styles from './HotelDetailMap.module.css'
import { addSurabayaVisualLayers, SURABAYA_BOUNDS, SURABAYA_MAP_STYLE } from './tourismMapStyle'

maplibregl.setWorkerUrl('/assets/vendor/maplibre/maplibre-gl-worker.mjs')

export default function DetailLocationMap({latitude,longitude,name,address,language='id'}){
  const containerRef=useRef(null)

  useEffect(()=>{
    if(!containerRef.current)return undefined
    const map=new maplibregl.Map({
      container:containerRef.current,
      style:SURABAYA_MAP_STYLE,
      center:[longitude,latitude],
      zoom:15.5,
      minZoom:10.2,
      maxZoom:18,
      maxBounds:SURABAYA_BOUNDS,
      pitch:48,
      bearing:-12,
      cooperativeGestures:true,
      attributionControl:false,
      canvasContextAttributes:{antialias:true},
      fadeDuration:0,
      renderWorldCopies:false,
    })
    map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right')
    map.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-right')
    map.once('load',()=>{try{addSurabayaVisualLayers(map)}catch(error){console.error('Gagal menyiapkan peta detail:',error)}})

    const marker=document.createElement('button')
    marker.type='button'
    marker.className=styles.mapMarker
    marker.setAttribute('aria-label',language==='en'?`Location of ${name}`:`Lokasi ${name}`)
    marker.title=language==='en'?'Open in Google Maps':'Buka di Google Maps'
    const popupContent=document.createElement('div')
    const popupName=document.createElement('strong')
    const popupAddress=document.createElement('span')
    popupName.textContent=name
    popupAddress.textContent=address
    popupContent.append(popupName,popupAddress)
    const popup=new maplibregl.Popup({offset:24,closeButton:false}).setDOMContent(popupContent)
    new maplibregl.Marker({element:marker,anchor:'bottom'}).setLngLat([longitude,latitude]).setPopup(popup).addTo(map)
    const openGoogleMaps=event=>{
      event.stopPropagation()
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,'_blank','noopener,noreferrer')
    }
    marker.addEventListener('click',openGoogleMaps)

    const resizeObserver=new ResizeObserver(()=>map.resize())
    resizeObserver.observe(containerRef.current)
    return ()=>{marker.removeEventListener('click',openGoogleMaps);resizeObserver.disconnect();map.remove()}
  },[address,language,latitude,longitude,name])

  return <div className={styles.map} ref={containerRef} aria-label={language==='en'?`Interactive map of ${name}`:`Peta interaktif ${name}`}/>
}
