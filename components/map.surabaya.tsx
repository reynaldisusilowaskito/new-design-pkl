import React, { memo, useState } from 'react'
import { Box, Paper, Typography, Tooltip, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BreakpointsContext } from 'contexts/breakpoints'

interface District {
  name: string
  image: string
  region: 'utara' | 'selatan' | 'timur' | 'barat' | 'pusat'
  position?: { row: number; col: number }
}

interface Props { }

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: '16px',
}))

const MapTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 700,
  color: '#1a1a1a',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}))

const DistrictGridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: theme.spacing(1),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: theme.spacing(0.75),
    padding: theme.spacing(1),
  },
}))

const DistrictCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{ isHovered?: boolean }>(({ theme, isHovered }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  border: '2px solid transparent',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  minHeight: '140px',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    borderColor: '#1a7a7a',
    backgroundColor: '#f0f9f9',
  },
  ...(isHovered && {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    borderColor: '#1a7a7a',
    backgroundColor: '#f0f9f9',
  }),
  [theme.breakpoints.down('sm')]: {
    minHeight: '110px',
    padding: theme.spacing(1),
  },
}))

const DistrictImage = styled('img')(({ theme }) => ({
  width: '70%',
  height: '70px',
  objectFit: 'contain',
  marginBottom: theme.spacing(0.5),
  transition: 'transform 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    height: '50px',
  },
}))

const DistrictName = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 600,
  color: '#333',
  textAlign: 'center',
  wordBreak: 'break-word',
  lineHeight: 1.3,
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px',
  },
}))

const RegionSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}))

const RegionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  color: '#ffffff',
  padding: theme.spacing(1.5, 2),
  borderRadius: '8px',
  marginBottom: theme.spacing(1.5),
  textTransform: 'capitalize',
}))

const regionColors: Record<string, string> = {
  utara: '#64969680',
  selatan: '#d4a5a580',
  timur: '#5eb3b380',
  barat: '#c4a47e80',
  pusat: '#a4c4a480',
}

const regionColorsDark: Record<string, string> = {
  utara: '#649696',
  selatan: '#d4a5a5',
  timur: '#5eb3b3',
  barat: '#c4a47e',
  pusat: '#a4c4a4',
}

const MapSurabaya: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  const districtsData: District[] = [
    // Utara
    { name: 'Asemrowo', image: '/images/Kecamatan/Asemrowo.svg', region: 'utara' },
    { name: 'Benowo', image: '/images/Kecamatan/Benowo.svg', region: 'utara' },
    { name: 'Bulak', image: '/images/Kecamatan/Bulak.svg', region: 'utara' },
    { name: 'Krembangan', image: '/images/Kecamatan/Krembangan.svg', region: 'utara' },
    { name: 'Kenjeran', image: '/images/Kecamatan/Kenjeran.svg', region: 'utara' },
    { name: 'Semampir', image: '/images/Kecamatan/Semampir.svg', region: 'utara' },
    { name: 'Pabean Cantian', image: '/images/Kecamatan/Pabean Cantian.svg', region: 'utara' },
    { name: 'Simokerto', image: '/images/Kecamatan/Simokerto.svg', region: 'utara' },

    // Pusat
    { name: 'Genteng', image: '/images/Kecamatan/Genteng.svg', region: 'pusat' },
    { name: 'Bubutan', image: '/images/Kecamatan/Bubutan.svg', region: 'pusat' },
    { name: 'Sawahan', image: '/images/Kecamatan/Sawahan.svg', region: 'pusat' },
    { name: 'Tegalsari', image: '/images/Kecamatan/Tegalsari.svg', region: 'pusat' },

    // Selatan
    { name: 'Wiyung', image: '/images/Kecamatan/Wiyung.svg', region: 'selatan' },
    { name: 'Gayungan', image: '/images/Kecamatan/Gayungan.svg', region: 'selatan' },
    { name: 'Wonocolo', image: '/images/Kecamatan/Wonocolo.svg', region: 'selatan' },
    { name: 'Wonokromo', image: '/images/Kecamatan/Wonokromo.svg', region: 'selatan' },
    { name: 'Lakarsantri', image: '/images/Kecamatan/Lakarsantri.svg', region: 'selatan' },
    { name: 'Jambangan', image: '/images/Kecamatan/Jambangan.svg', region: 'selatan' },

    // Timur
    { name: 'Mulyorejo', image: '/images/Kecamatan/Mulyorejo.svg', region: 'timur' },
    { name: 'Sukolilo', image: '/images/Kecamatan/Sukolilo.svg', region: 'timur' },
    { name: 'Gunung Anyar', image: '/images/Kecamatan/Gunung Anyar.svg', region: 'timur' },
    { name: 'Rungkut', image: '/images/Kecamatan/Rungkut.svg', region: 'timur' },
    { name: 'Tenggilis Mejoyo', image: '/images/Kecamatan/Tenggilis Mejoyo.svg', region: 'timur' },

    // Barat
    { name: 'Tandes', image: '/images/Kecamatan/Tandes.svg', region: 'barat' },
    { name: 'Sambikerep', image: '/images/Kecamatan/Sambikerep.svg', region: 'barat' },
    { name: 'Dukuh Pakis', image: '/images/Kecamatan/Dukuh Pakis.svg', region: 'barat' },
    { name: 'Gubeng', image: '/images/Kecamatan/Gubeng.svg', region: 'barat' },
    { name: 'Tambaksari', image: '/images/Kecamatan/Tambaksari.svg', region: 'barat' },
    { name: 'Sukomanunggal', image: '/images/Kecamatan/sukomanunggal.svg', region: 'barat' },
    { name: 'Karangpilang', image: '/images/Kecamatan/Karangpilang.svg', region: 'barat' },
  ]

  const regionLabels: Record<string, string> = {
    utara: 'Wilayah Utara',
    pusat: 'Wilayah Pusat',
    selatan: 'Wilayah Selatan',
    timur: 'Wilayah Timur',
    barat: 'Wilayah Barat',
  }

  const regions = ['utara', 'pusat', 'selatan', 'timur', 'barat'] as const

  const getDistrictsByRegion = (region: string) => {
    return districtsData.filter((d) => d.region === region)
  }

  const handleDistrictHover = (name: string) => {
    setHoveredDistrict(name)
  }

  const handleDistrictLeave = () => {
    setHoveredDistrict(null)
  }

  return (
    <MapContainer>
      <MapTitle>Peta Interaktif Kecamatan Kota Surabaya</MapTitle>

      {regions.map((region) => (
        <RegionSection key={region}>
          <RegionTitle
            sx={{
              backgroundColor: regionColorsDark[region],
            }}
          >
            {regionLabels[region]}
          </RegionTitle>
          <DistrictGridContainer>
            {getDistrictsByRegion(region).map((district) => (
              <Tooltip
                key={district.name}
                title={district.name}
                placement="top"
                arrow
              >
                <DistrictCard
                  isHovered={hoveredDistrict === district.name}
                  onMouseEnter={() => handleDistrictHover(district.name)}
                  onMouseLeave={handleDistrictLeave}
                  onClick={() => {
                    // Tambahkan interaksi ketika district diklik
                    console.log(`Clicked on ${district.name}`)
                  }}
                >
                  <DistrictImage
                    src={district.image}
                    alt={district.name}
                    onError={(e) => {
                      // Fallback jika gambar tidak ditemukan
                      const img = e.target as HTMLImageElement
                      img.style.display = 'none'
                    }}
                  />
                  <DistrictName>{district.name}</DistrictName>
                </DistrictCard>
              </Tooltip>
            ))}
          </DistrictGridContainer>
        </RegionSection>
      ))}
    </MapContainer>
  )
}

MapSurabaya.defaultProps = {}

export default memo(MapSurabaya)
