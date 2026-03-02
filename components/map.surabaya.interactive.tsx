// REIMPLEMENTED: GeoJSON-based SVG map — fetches from remote URL
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const GEO_URL = '/kecamatan.geojson'

// ── GeoJSON minimal types ──────────────────────────────────────────────
interface GeoFeatureProps {
  nm_kecamatan: string
  kd_kecamatan: string
  kd_propinsi: string
  kd_dati2: string
}
interface GeoFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: any
  }
  properties: GeoFeatureProps
}
interface GeoFeatureCollection {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

interface Props {
  onSelect?: (district: string | null) => void
}

// ── Styled components ──────────────────────────────────────────────────
const MapWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
}))

const TooltipBox = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'rgba(255,255,255,0.97)',
  padding: theme.spacing(1, 1.5),
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
  pointerEvents: 'none',
  zIndex: 1000,
  border: '2px solid #1a7a7a',
  maxWidth: '200px',
}))

// ── Constants ──────────────────────────────────────────────────────────
const SVG_W     = 820
const SVG_H     = 480
const PAD       = 12
const C_DEFAULT  = '#ffffff'
const C_HOVERED  = '#ffd54f'
const C_SELECTED = '#ffeb3b'

// ── Path computation (runs once via useMemo) ───────────────────────────
function buildPaths(features: GeoFeature[]): Record<string, string[]> {
  let minLon = Infinity, maxLon = -Infinity
  let minLat = Infinity, maxLat = -Infinity

  const visit = (c: number[]) => {
    if (c[0] < minLon) minLon = c[0]
    if (c[0] > maxLon) maxLon = c[0]
    if (c[1] < minLat) minLat = c[1]
    if (c[1] > maxLat) maxLat = c[1]
  }

  features.forEach(f => {
    if (f.geometry.type === 'Polygon') {
      (f.geometry.coordinates as number[][][]).forEach(ring => ring.forEach(visit))
    } else {
      (f.geometry.coordinates as number[][][][]).forEach(poly =>
        poly.forEach(ring => ring.forEach(visit)))
    }
  })

  const lonSpan = maxLon - minLon
  const latSpan = maxLat - minLat
  const iW = SVG_W - PAD * 2
  const iH = SVG_H - PAD * 2

  const project = (lon: number, lat: number) =>
    `${(PAD + ((lon - minLon) / lonSpan) * iW).toFixed(1)},` +
    `${(PAD + ((maxLat - lat) / latSpan) * iH).toFixed(1)}`

  const ring2path = (ring: number[][]) =>
    ring.map((c, i) => (i === 0 ? 'M' : 'L') + project(c[0], c[1])).join('') + 'Z'

  const groups: Record<string, string[]> = {}

  features.forEach(f => {
    const kec = f.properties.nm_kecamatan.toUpperCase()
    if (!groups[kec]) groups[kec] = []
    if (f.geometry.type === 'Polygon') {
      groups[kec].push(
        (f.geometry.coordinates as number[][][]).map(ring2path).join(' ')
      )
    } else {
      ;(f.geometry.coordinates as number[][][][]).forEach(poly =>
        groups[kec].push(poly.map(ring2path).join(' '))
      )
    }
  })

  return groups
}

// ── Component ──────────────────────────────────────────────────────────
const InteractiveMapSurabaya: React.FunctionComponent<Props> = ({ onSelect }) => {
  const containerRef                    = useRef<HTMLDivElement>(null)
  const [hovered,  setHovered]          = useState<string | null>(null)
  const [selected, setSelected]         = useState<string | null>(null)
  const [tooltip,  setTooltip]          = useState<{ x: number; y: number } | null>(null)
  const [features, setFeatures]         = useState<GeoFeature[]>([])
  const [loading,  setLoading]          = useState(true)
  const [error,    setError]            = useState<string | null>(null)

  useEffect(() => {
    fetch(GEO_URL)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() })
      .then((data: GeoFeatureCollection) => setFeatures(data.features))
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  const kecamatanPaths = useMemo(
    () => features.length ? buildPaths(features) : {},
    [features]
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setTooltip({ x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 8 })
  }

  const handleClick = (kec: string) => {
    const next = selected === kec ? null : kec
    setSelected(next)
    onSelect?.(next)
  }

  const getColor = (kec: string) => {
    if (kec === selected) return C_SELECTED
    if (kec === hovered)  return C_HOVERED
    return C_DEFAULT
  }

  const toTitle = (k: string) => k.charAt(0) + k.slice(1).toLowerCase()

  if (loading) return (
    <MapWrapper><CircularProgress sx={{ color: '#1a7a7a' }} /></MapWrapper>
  )
  if (error) return (
    <MapWrapper>
      <Typography sx={{ color: '#c62828', fontSize: '14px' }}>Gagal memuat peta: {error}</Typography>
    </MapWrapper>
  )

  return (
    <MapWrapper ref={containerRef} onMouseMove={handleMouseMove}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        aria-label="Peta Interaktif Kecamatan Surabaya"
      >
        {Object.entries(kecamatanPaths).map(([kec, paths]) => (
          <g
            key={kec}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(kec)}
            onMouseLeave={() => { setHovered(null); setTooltip(null) }}
            onClick={() => handleClick(kec)}
          >
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={getColor(kec)}
                stroke="#000000"
                strokeWidth="1.5"
                style={{
                  transition: 'fill 0.2s ease',
                  filter: kec === selected
                    ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))'
                    : undefined,
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          mt: 1,
          color: 'rgba(255,255,255,0.75)',
          fontStyle: 'italic',
          fontSize: '12px',
        }}
      >
        Peta Interaktif 31 Kecamatan Kota Surabaya
      </Typography>

      {hovered && tooltip && (
        <TooltipBox sx={{ left: tooltip.x, top: tooltip.y, transform: 'translateY(-100%)' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1a7a7a' }}>
            Kec. {toTitle(hovered)}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#888' }}>
            {selected === hovered ? 'Dipilih • klik untuk batalkan' : 'Klik untuk lihat detail'}
          </Typography>
        </TooltipBox>
      )}
    </MapWrapper>
  )
}

export default memo(InteractiveMapSurabaya)
