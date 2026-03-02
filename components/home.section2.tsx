import React, { memo } from 'react'
import { Grid, Box, Typography, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { orderBy } from 'lodash'
import { useRouter } from 'next/router'
import CarouselSmall from 'components/carousel.small'
import _ from 'lodash'
import { Menu as MenuType } from 'components/header'
import { fontSize, borderRadius } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props { }

const BoxStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  backgroundImage: 'url(/images/bg-batik.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  '& . MuiTypography-root': {
    fontSize: fontSize + 8,
    textTransform: 'uppercase',
    fontWeight: 300,
    color: theme.palette.common.white,
    lineHeight: 1.2,
    '& span': {
      display: 'block',
      fontWeight: 800,
      fontSize: fontSize + 18,
    },
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(borderRadius),
    '& .MuiTypography-root': {
      fontSize: fontSize + 4,
      '& span': {
        fontSize: fontSize + 14,
      },
    },
  },
}))

const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #176B87',
  borderRadius: 16,
  padding: theme.spacing(1.8),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.8),
  minHeight: 120,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(23, 107, 135, 0.15)',
  },
}))

const StatContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}))

const StatValue = styled(Typography)({
  fontSize: 21,
  fontWeight: 700,
  color: '#000',
  lineHeight: 1,
})

const StatSubtext = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 500,
  color: '#4CAF50',
  marginTop: theme.spacing(0.5),
}))

const StatIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 45,
  height: 45,
  borderRadius: 12,
  flexShrink: 0,
}))

function findMenu(array: schema['schemas']['Menu'][], title: string) {
  let object = null
  array.some(function f(a: MenuType) {
    const isInclude = a.title.toLowerCase().includes(title.toLowerCase())
    if (isInclude) {
      object = a
      return true
    }
    if (Array.isArray(a.child)) {
      return a.child.some(f)
    }
  })
  return object
}


const HomeSection2: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const menu = React.useMemo(() => contents?.menu || [], [contents])
  const { textToSpeech } = useTextToSpeech()
  const router = useRouter()

  const whatsInSurabaya: MenuType[] = React.useMemo(() => {
    const result = findMenu(menu, 'Ada Apa di Surabaya')
    return menu.length > 0 ? (result ? orderBy(result['child'], ['order', 'asc']) : []) : []
  }, [menu])

  const VISIBLE_COUNT = 3
  const [carouselIndex, setCarouselIndex] = React.useState(0)
  const maxIndex = Math.max(0, whatsInSurabaya.length - VISIBLE_COUNT)
  const visibleItems = whatsInSurabaya.slice(carouselIndex, carouselIndex + VISIBLE_COUNT)

  const handlePrev = () => setCarouselIndex((i) => Math.max(0, i - 1))
  const handleNext = () => setCarouselIndex((i) => Math.min(maxIndex, i + 1))

  console.log('Menu Ada Apa di Surabaya:', whatsInSurabaya)
  // Handler untuk navigasi
  const handleWisataClick = () => {
    router.push('/wisata/')
  }

  const handleBisnisInvestasiClick = () => {
    router.push('https://dpm-ptsp.surabaya.go.id/petapotensiinvestasi/html/interaktif/kecamatan.php')
  }

  const handleTransportasiClick = () => {
    router.push('https://play.google.com/store/apps/details?id=com.dishub.gobissurabaya&hl=in&gl=US')
  }

  // Placeholder data untuk deskripsi dan icon
  const tentangSurabaya = {
    title: 'TENTANG SURABAYA',
    desc: 'Surabaya adalah ibu kota Provinsi Jawa Timur yang menjadi pusat pemerintahan dan perekonomian dari Provinsi Jawa Timur. Kota ini terbagi menjadi 31 kecamatan dan 154 kelurahan. Kota ini, yang dikenal dengan nilai kepahlawanan, memiliki sejarah panjang yang terkait dengan peristiwa heroik seperti peristiwa pertempuran 10 November 1945. Sebagai pelabuhan penting sejak zaman Majapahit hingga masa kolonial Belanda, Surabaya terus memainkan peran vital dalam perdagangan dan sejarah Indonesia.',
    icon: (
      <Box sx={{ display: 'flex', gap: 0.2, mb: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/icon/icon_batik_coklat.svg" alt="Batik Icon" style={{ width: 24, height: 24 }} />
        </Box>
        <Box sx={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/icon/icon_batik_hijau.svg" alt="Batik Icon" style={{ width: 24, height: 24 }} />
        </Box>
      </Box>
    ),
  }

  const apaDiSurabaya = [
    {
      icon: (
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/icon/Logo-Bisnis_Investasi.svg" alt="Bisnis dan Investasi" style={{ width: 50, height: 50 }} />
        </Box>
      ),
      label: 'Bisnis dan Investasi',
      onClick: handleBisnisInvestasiClick
    },
    {
      icon: (
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/icon/Logo-Transportasi.svg" alt="Transportasi" style={{ width: 50, height: 50 }} />
        </Box>
      ),
      label: 'Transportasi',
      onClick: handleTransportasiClick
    },
    {
      icon: (
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/icon/Logo-Wisata.svg" alt="Wisata" style={{ width: 50, height: 50 }} />
        </Box>
      ),
      label: 'Wisata',
      onClick: handleWisataClick
    },
  ]

  const statisticsData = [
    {
      label: 'Total Penduduk',
      value: '2.87M',
      subtext: '+12.1% tahun ini',
      bgColor: '#E8D5F2',
      icon: '/images/stat surabaya/totalpenduduk.png',
      isImage: true,
    },
    {
      label: 'Luas Wilayah',
      value: '333',
      unit: 'km²',
      bgColor: '#FFE8CC',
      icon: '/images/stat surabaya/Luaswilayah.png',
      isImage: true,
    },
    {
      label: 'Total Kecamatan',
      value: '31',
      subtext: '+1 langkah',
      bgColor: '#D4E8F7',
      icon: '/images/stat surabaya/totalkecamatan.png',
      isImage: true,
    },
    {
      label: 'Total Kelurahan',
      value: '154',
      subtext: 'Asd semua',
      bgColor: '#D4F1E6',
      icon: '/images/stat surabaya/totalkeluraha.png',
      isImage: true,
    },
  ]

  return (
    <Box sx={(theme) => ({
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 29, 29, 0. 7)' : '#fff',
      borderRadius: 6,
      px: downSm ? 2 : 15,
      py: downSm ? 2 : 10,
      boxShadow: 2,
      width: '100%',
      mx: 'auto',
      my: 0,
    })}>
      <Grid container spacing={downSm ? 2 : 4} alignItems="stretch">
        {/* Kiri: Kartu Gambar */}
        <Grid item xs={12} md={3.2}>
          <Box sx={{
            // bgcolor: (theme) => theme.palette.background.paper,
            borderRadius: 5,
            overflow: 'hidden',
            height: downSm ? 260 : 520,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            p: 0,
          }}>
            {/* Gambar utama */}
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img src="/images/photos/img_alun-alun.svg" alt="Alun Alun Surabaya" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
            </Box>
          </Box>
        </Grid>

        {/* Tengah: Tentang dan Ada Apa */}
        <Grid item xs={12} md={6.28}>
          <Grid container direction="column" spacing={downSm ? 2 : 2.7}>
            {/* Atas: Tentang Surabaya */}
            <Grid item>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 2, }}>
                {/* Teks Vertikal */}
                <Box sx={{
                  // bgcolor: (theme) => theme.palette. background.paper,
                  backgroundColor: '#006462',
                  borderRadius: 5,
                  px: 2,
                  minWidth: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: 1,
                  textAlign: 'center',
                }}>
                  {tentangSurabaya.title}
                </Box>
                {/* Box Deskripsi */}
                <Box sx={{
                  flex: 1,
                  border: (theme) => `2px solid ${theme.palette.background.paper}`,
                  borderRadius: 5,
                  px: 2.7,
                  py: 1.8,
                  // bgcolor: (theme) => `${theme.palette.text.primary}`,
                  backgroundColor: '#fff',
                  minHeight: 108,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  {tentangSurabaya.icon}
                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary, fontSize: 15, lineHeight: 1.6 })}>
                    {tentangSurabaya.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Bawah: Ada Apa di Surabaya */}
            <Grid item>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 2 }}>
                {/* Box utama 3 kolom */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#006462',
                  borderRadius: 5,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  px: 0.5,
                  py: downSm ? 2 : 2.7,
                  minHeight: 108,
                  overflow: 'hidden',
                }}>
                  {/* Prev button */}
                  <IconButton
                    onClick={handlePrev}
                    disabled={carouselIndex === 0}
                    size="small"
                    sx={{ color: '#fff', opacity: carouselIndex === 0 ? 0.3 : 1, flexShrink: 0 }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>

                  {/* Visible items */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', overflow: 'hidden' }}>
                    {visibleItems.map((item, idx) => (
                      <Box
                        key={carouselIndex + idx}
                        onClick={() => window.open(item.url, '_blank')}
                        sx={(theme) => ({
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.palette.text.primary,
                          borderRight: idx < VISIBLE_COUNT - 1 ? '1px solid #fff3' : 'none',
                          px: 1,
                          cursor: item.url ? 'pointer' : 'default',
                          transition: 'transform 0.2s, opacity 0.2s',
                          '&:hover': item.url ? {
                            transform: 'scale(1.05)',
                            opacity: 0.8,
                          } : {}
                        })}
                      >
                        <img
                          src={`https://surabaya.go.id/uploads/images/icons/menu/${_.snakeCase(item.title)}.svg`}
                          alt={item.title}
                          style={{ width: 40, height: 40, marginBottom: 8 }} />
                        <Typography variant="subtitle1" sx={(theme) => ({ fontWeight: 400, fontSize: 16, textAlign: 'center', color: theme.palette.text.primary })}>{item.title}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Next button */}
                  <IconButton
                    onClick={handleNext}
                    disabled={carouselIndex >= maxIndex}
                    size="small"
                    sx={{ color: '#fff', opacity: carouselIndex >= maxIndex ? 0.3 : 1, flexShrink: 0 }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
                {/* Teks Vertikal */}
                <Box sx={{
                  bgcolor: '#fff',
                  border: '2px solid #176B87',
                  borderRadius: 5,
                  px: 2,
                  py: 4,
                  minWidth: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  color: (theme) => theme.palette.text.secondary,
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: 1,
                  textAlign: 'center',
                }}>
                  ADA APA DI SURABAYA
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Kanan: Statistik */}
        <Grid item xs={12} md={2.52}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            {statisticsData.map((stat, idx) => (
              <StatCard key={idx}>
                <StatContent>
                  <StatLabel>{stat.label}</StatLabel>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <StatValue>{stat.value}</StatValue>
                    {stat.unit && <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#666' }}>{stat.unit}</Typography>}
                  </Box>
                  {stat.subtext && <StatSubtext>{stat.subtext}</StatSubtext>}
                </StatContent>
                <StatIconBox sx={{ backgroundColor: stat.bgColor }}>
                  {stat.isImage ? (
                    <img src={stat.icon} alt={stat.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  ) : (
                    <Typography sx={{ fontSize: 21 }}>{stat.icon}</Typography>
                  )}
                </StatIconBox>
              </StatCard>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

HomeSection2.defaultProps = {}

export default memo(HomeSection2)