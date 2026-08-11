'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import styles from './SurabayaMapCanvas.module.css'

const CENTER = [112.7521, -7.2575]
const BOUNDS = [[112.58, -7.37], [112.90, -7.12]]
const SOURCE = 'surabaya-districts-v2'
const FILL = 'surabaya-district-fill-v2'
const LINE = 'surabaya-district-line-v2'
const LABEL = 'surabaya-district-label-v2'
const BASE_SOURCE = 'versatiles-shortbread'
const MAP_STYLE = {
  version: 8,
  glyphs: 'https://tiles.versatiles.org/assets/glyphs/{fontstack}/{range}.pbf',
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#101b2b' } }],
}
const normalize = (name) => name.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim()

maplibregl.setWorkerUrl('/assets/vendor/maplibre/maplibre-gl-worker.mjs')

export default function SurabayaMapCanvas({ districts, onSelectDistrict, onReady, onError }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const districtByName = useMemo(() => {
    const index = Object.fromEntries(districts.map((district) => [normalize(district.key), district]))
    index['ASEM ROWO'] = index.ASEMROWO
    index['PABEAN CANTIAN'] = index['PABEAN CANTIKAN']
    return index
  }, [districts])

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return undefined
    let map
    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: CENTER, zoom: 12.35, pitch: 48, bearing: -12,
        minZoom: 10.2, maxZoom: 17, maxBounds: BOUNDS,
        cooperativeGestures: true,
        canvasContextAttributes: { antialias: true },
        attributionControl: false,
      })
    } catch (error) {
      console.error('Gagal membuka MapLibre:', error)
      onError?.()
      return undefined
    }
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true }, fitBoundsOptions: { maxZoom: 15 },
      trackUserLocation: true, showAccuracyCircle: true, showUserLocation: true,
    }), 'top-right')
    map.addControl(new maplibregl.FullscreenControl(), 'top-right')
    map.on('error', (event) => {
      console.error('MapLibre:', event.error?.message || event.error)
    })

    let hoveredId = null
    let selectedId = null
    map.once('load', () => {
      try {
      map.addSource(BASE_SOURCE, {
        type: 'vector',
        tiles: ['https://tiles.versatiles.org/tiles/osm/{z}/{x}/{y}'],
        minzoom: 0,
        maxzoom: 14,
        attribution: '© OpenStreetMap contributors',
      })
      map.addLayer({
        id: 'base-ocean', type: 'fill', source: BASE_SOURCE, 'source-layer': 'ocean',
        paint: { 'fill-color': '#172b3d' },
      })
      map.addLayer({
        id: 'base-water', type: 'fill', source: BASE_SOURCE, 'source-layer': 'water_polygons',
        paint: { 'fill-color': '#1c4053', 'fill-opacity': 0.92 },
      })
      map.addLayer({
        id: 'base-streets', type: 'line', source: BASE_SOURCE, 'source-layer': 'streets', minzoom: 10,
        paint: {
          'line-color': ['interpolate', ['linear'], ['zoom'], 10, '#425464', 15, '#82909a'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.35, 15, 1.5],
          'line-opacity': 0.58,
        },
      })
      map.addSource(SOURCE, { type: 'geojson', data: '/data/surabaya-kecamatan-2026.geojson', promoteId: 'code' })
      map.addLayer({ id: FILL, type: 'fill', source: SOURCE, paint: {
        'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#f2bdc7', ['boolean', ['feature-state', 'hover'], false], '#c5b3d2', '#7ba9b5'],
        'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], .66, ['boolean', ['feature-state', 'hover'], false], .5, .2],
      }})
      map.addLayer({
        id: 'surabaya-buildings-3d-v2', type: 'fill-extrusion', source: BASE_SOURCE, 'source-layer': 'buildings', minzoom: 12.5,
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], ['zoom'], 12.5, '#536b78', 15, '#e2c4c9'],
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 12.5, 2, 15, 18, 17, 28],
          'fill-extrusion-base': 0, 'fill-extrusion-opacity': .86,
        },
      })
      map.addLayer({ id: LINE, type: 'line', source: SOURCE, paint: {
        'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#fff7f6', 'rgba(255,255,255,.72)'],
        'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, ['boolean', ['feature-state', 'hover'], false], 2, 1],
      }})
      map.addLayer({ id: LABEL, type: 'symbol', source: SOURCE, minzoom: 11.4, layout: {
        'text-field': ['get', 'name'], 'text-font': ['noto_sans_regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 11.4, 9, 14, 12], 'text-letter-spacing': .05,
      }, paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(19,31,48,.9)', 'text-halo-width': 1.5 }})
      onReady?.()
      map.on('mousemove', FILL, (event) => {
        const id = event.features?.[0]?.id; map.getCanvas().style.cursor = 'pointer'
        if (hoveredId != null && hoveredId !== id) map.setFeatureState({ source: SOURCE, id: hoveredId }, { hover: false })
        if (id != null) { hoveredId = id; map.setFeatureState({ source: SOURCE, id }, { hover: true }) }
      })
      map.on('mouseleave', FILL, () => {
        map.getCanvas().style.cursor = ''
        if (hoveredId != null) map.setFeatureState({ source: SOURCE, id: hoveredId }, { hover: false })
        hoveredId = null
      })
      map.on('click', FILL, (event) => {
        const name = event.features?.[0]?.properties?.name
        const district = name ? districtByName[normalize(name)] : null
        const id = event.features?.[0]?.id
        if (!district || id == null) return
        if (selectedId != null) map.setFeatureState({ source: SOURCE, id: selectedId }, { selected: false })
        selectedId = id; map.setFeatureState({ source: SOURCE, id: selectedId }, { selected: true }); onSelectDistrict(district)
      })
      map.easeTo({ center: CENTER, zoom: 12.35, pitch: 48, bearing: -12, duration: 900 })
      } catch (error) {
        console.error('Gagal menyiapkan layer peta Surabaya:', error)
        onError?.()
      }
    })
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(mapContainer.current)
    mapInstance.current = map
    return () => { resizeObserver.disconnect(); map.remove(); mapInstance.current = null }
  }, [districtByName, onError, onReady, onSelectDistrict])

  return <div className={styles.map} ref={mapContainer} aria-label="Peta interaktif tiga dimensi 31 kecamatan Kota Surabaya" />
}
