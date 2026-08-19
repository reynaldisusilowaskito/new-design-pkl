'use client'

import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import styles from './TourismLocationMap.module.css'
import { addSurabayaVisualLayers, SURABAYA_BOUNDS, SURABAYA_CENTER, SURABAYA_MAP_STYLE } from './tourismMapStyle'

maplibregl.setWorkerUrl('/assets/vendor/maplibre/maplibre-gl-worker.mjs')

const DEFAULT_LOCATION={latitude:SURABAYA_CENTER[1],longitude:SURABAYA_CENTER[0]}

export default function TourismLocationMap({ location, items = [], language = 'id' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const initialLocationRef = useRef(location || DEFAULT_LOCATION)
  const [ready,setReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined
    const map = new maplibregl.Map({
      container:containerRef.current,style:SURABAYA_MAP_STYLE,
      center:[initialLocationRef.current.longitude,initialLocationRef.current.latitude],zoom:12.35,pitch:48,bearing:-12,
      minZoom:10.2,maxZoom:17,maxBounds:SURABAYA_BOUNDS,
      cooperativeGestures:true,attributionControl:false,canvasContextAttributes:{antialias:true},
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass:false }), 'top-right')
    map.addControl(new maplibregl.AttributionControl({ compact:true }), 'bottom-right')
    map.once('load',()=>{try{
      addSurabayaVisualLayers(map)
      map.addSource('tourism-places',{type:'geojson',data:{type:'FeatureCollection',features:[]},cluster:true,clusterMaxZoom:14,clusterRadius:42})
      map.addLayer({id:'tourism-place-clusters',type:'circle',source:'tourism-places',filter:['has','point_count'],paint:{'circle-color':['step',['get','point_count'],'#c5b3d2',20,'#efc0a1',60,'#e58e80'],'circle-radius':['step',['get','point_count'],18,20,23,60,29],'circle-stroke-width':3,'circle-stroke-color':'#fff'}})
      map.addLayer({id:'tourism-place-cluster-count',type:'symbol',source:'tourism-places',filter:['has','point_count'],layout:{'text-field':['get','point_count_abbreviated'],'text-font':['noto_sans_regular'],'text-size':11},paint:{'text-color':'#182438'}})
      map.addLayer({id:'tourism-place-points',type:'circle',source:'tourism-places',filter:['!',['has','point_count']],paint:{'circle-color':'#182438','circle-radius':8,'circle-stroke-width':3,'circle-stroke-color':'#fff'}})
      map.on('click','tourism-place-clusters',async event=>{
        const feature=event.features?.[0]
        const clusterId=feature?.properties?.cluster_id
        const source=map.getSource('tourism-places')
        if(clusterId===undefined||!source?.getClusterExpansionZoom)return
        const zoom=await source.getClusterExpansionZoom(clusterId)
        map.easeTo({center:feature.geometry.coordinates,zoom,duration:500})
      })
      map.on('click','tourism-place-points',event=>{
        const feature=event.features?.[0]
        if(!feature)return
        const content=document.createElement('div')
        const title=document.createElement('strong')
        const address=document.createElement('span')
        title.textContent=feature.properties?.name || ''
        address.textContent=feature.properties?.address || ''
        content.append(title,address)
        new maplibregl.Popup({offset:14,closeButton:false}).setLngLat(feature.geometry.coordinates).setDOMContent(content).addTo(map)
      })
      ;['tourism-place-clusters','tourism-place-points'].forEach(layer=>{
        map.on('mouseenter',layer,()=>{map.getCanvas().style.cursor='pointer'})
        map.on('mouseleave',layer,()=>{map.getCanvas().style.cursor=''})
      })
      setReady(true)
    }catch(error){console.error('Gagal menyiapkan peta wisata:',error)}})
    const resizeObserver = new ResizeObserver(()=>map.resize())
    resizeObserver.observe(containerRef.current)
    mapRef.current=map
    return ()=>{resizeObserver.disconnect();markersRef.current.forEach(marker=>marker.remove());map.remove();mapRef.current=null}
  }, [])

  useEffect(() => {
    const map=mapRef.current
    if(!map||!ready)return
    markersRef.current.forEach(marker=>marker.remove())
    markersRef.current=[]

    const bounds=new maplibregl.LngLatBounds()
    if(location){
      const userElement=document.createElement('div')
      const userLabel=document.createElement('span')
      userElement.className=styles.userMarker
      userLabel.textContent=language==='en'?'YOU ARE HERE':'KAMU DI SINI'
      userElement.append(userLabel)
      markersRef.current.push(new maplibregl.Marker({element:userElement,anchor:'bottom'}).setLngLat([location.longitude,location.latitude]).addTo(map))
      bounds.extend([location.longitude,location.latitude])
    }
    const validItems=items.filter(item=>Number.isFinite(item.latitude)&&Number.isFinite(item.longitude))
    const placeSource=map.getSource('tourism-places')
    placeSource?.setData({type:'FeatureCollection',features:validItems.map(item=>({type:'Feature',geometry:{type:'Point',coordinates:[item.longitude,item.latitude]},properties:{name:language==='en'?item.nameEn:item.nameId,address:item.address||''}}))})
    validItems.forEach(item=>bounds.extend([item.longitude,item.latitude]))
    if(!bounds.isEmpty())map.fitBounds(bounds,{padding:70,maxZoom:14.5,duration:700})
    else map.jumpTo({center:SURABAYA_CENTER,zoom:12.35,pitch:48,bearing:-12})
  },[items,language,location,ready])

  return <div className={styles.map} ref={containerRef} aria-label={language==='en'?'Map of places in Surabaya':'Peta tempat di Surabaya'} />
}
