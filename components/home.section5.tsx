import React, { memo } from 'react'
import { Box } from '@mui/material'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { fontSize } from 'styles/theme'
import { ButtonStyled } from 'components/title'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {}

const paddingList = 4
const transition = 0.1
const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  backgroundImage: 'url(/images/bg-batik.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  '& .wrapper-svg-section3': {
    position: 'absolute',
    top: theme.spacing(-5),
    left: `calc(100% + ${theme.spacing(2)})`,
    '& svg': {
      width: 50,
      '& circle': {
        fill: theme.palette.common.white,
      },
    },
  },
}))

const HomeSection5: React.FunctionComponent<Props> = () => {
  const { data } = useQuery<schema['schemas']['Service'][]>(['home_services'])
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const loading = false

  // Icon mapping for services
  const iconMap: { [key: string]: string } = {
    'administrasi': '/images/Pelayanan/administrasi.svg',
    'broadbandlearning': '/images/Pelayanan/broadbandlearning.svg',
    'ehealth': '/images/Pelayanan/ehealth.svg',
    'infografis': '/images/Pelayanan/infografis.svg',
    'jaringandokumentasi': '/images/Pelayanan/jaringandokumentasi.svg',
    'kecamatan': '/images/Pelayanan/kecamatan.svg',
    'ketenagakerjaan': '/images/Pelayanan/ketenagakerjaan.svg',
    'layananpengadaan': '/images/Pelayanan/layananpengadaan.svg',
    'pelayanandinaspendidikan': '/images/Pelayanan/pelayanandinaspendidikan.svg',
    'pelayanandinassosial': '/images/Pelayanan/pelayanandinassosial.png',
    'pemberdayaan': '/images/Pelayanan/pemberdayaan.svg',
    'pengaduan': '/images/Pelayanan/pengaduan.svg',
    'ppid': '/images/Pelayanan/ppid.svg',
    'satudata': '/images/Pelayanan/satudata.svg',
    'ssw alfa': '/images/Pelayanan/sswalfa.svg',
  }

  // Mock data for services (fallback)
  const mockServices = [
    { id: 1, alias: 'administrasi', title: 'Administrasi', url: '#' },
    { id: 2, alias: 'broadbandlearning', title: 'Broadband Learning', url: '#' },
    { id: 3, alias: 'ehealth', title: 'E-Health', url: '#' },
    { id: 4, alias: 'infografis', title: 'Infografis', url: '#' },
    { id: 5, alias: 'jaringandokumentasi', title: 'Jaringan Dokumentasi', url: '#' },
    { id: 6, alias: 'kecamatan', title: 'Kecamatan', url: '#' },
    { id: 7, alias: 'ketenagakerjaan', title: 'Ketenagakerjaan', url: '#' },
    { id: 8, alias: 'layananpengadaan', title: 'Layanan Pengadaan', url: '#' },
    { id: 9, alias: 'pelayanandinaspendidikan', title: 'Pelayanan Dinas Pendidikan', url: '#' },
    { id: 10, alias: 'pelayanandinassosial', title: 'Pelayanan Dinas Sosial', url: '#' },
    { id: 11, alias: 'pemberdayaan', title: 'Pemberdayaan', url: '#' },
    { id: 12, alias: 'pengaduan', title: 'Pengaduan', url: '#' },
    { id: 13, alias: 'ppid', title: 'PPID', url: '#' },
    { id: 14, alias: 'satudata', title: 'Satu Data', url: '#' },
    { id: 15, alias: 'ssw alfa', title: 'SSW ALFA', url: '#' },
  ]

  const servicesData = (data && data.length > 0) ? data : mockServices
  return (
    <BoxStyled className={accessibility.css.negative ? 'negative' : ''}>
      {!loading && (
        <Box sx={(theme) => ({
             bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 29, 29, 0.7)' : '#fff',
             borderRadius: 6,
             px: downSm ? 2 : 30,
             py: downSm ? 2 : 10,
             boxShadow: 2,
             width: '97%',
             mx: 'auto',
             my: 0,
           })}>
          {/* Section Title */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            mb: 5,
            width: '100%',
          }}>
            <img src="/images/icon/icon_batik_coklat_kiri.svg" alt="icon_batik" style={{ width: 32, height: 32, marginRight: 10, display: 'block' }} />
           <Box component="span" sx={(theme) => ({ color: theme.palette.mode === 'light' ? '#006462' : '#ffffff', fontSize: 28 + accessibility.fontSize * 2, fontWeight: 600, letterSpacing: 1, lineHeight: 1 })}>
                                       PELAYANAN PEMERINTAH KOTA SURABAYA
                                     </Box>
          </Box>
          <Box
            sx={{
              borderRadius: 4,
              padding: { xs: 4, sm: 5, md: 6 },
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: { xs: 4, sm: 5, md: 2.4 },
              width: '100%',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            {servicesData?.length > 0 && servicesData.map((v, i) => (
              <Link key={i} href={v.url} style={{ textDecoration: 'none', width: '100%' }}>
                <Box
                  tabIndex={0}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    maxWidth: 216,
                    mx: 'auto',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    p: 2,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      bgcolor: '#f8f9fa',
                    },
                  }}
                  onMouseEnter={(e) => textToSpeech(e, true)}
                >
                  <Box
                    sx={{
                      width: { xs: 96, md: 108 },
                      height: { xs: 96, md: 108 },
                      borderRadius: '50%',
                      bgcolor: '#9C7B43',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: '0 4px 15px rgba(156, 123, 67, 0.3)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <img
                      src={iconMap[v.alias?.toLowerCase()]}
                      alt={v.title}
                      style={{ width: '60%', height: '60%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-icon.svg'
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      color: theme => theme.palette.mode === 'light' ? '#006462' : '#ffffff',
                      fontWeight: 600,
                      fontSize: { xs: 17 + accessibility.fontSize * 2, md: 18 + accessibility.fontSize * 2 },
                      textAlign: 'center',
                      minHeight: 44,
                      lineHeight: 1.3,
                      textTransform: 'none',
                      letterSpacing: 0,
                      wordBreak: 'break-word',
                      px: 0.5,
                    }}
                  >
                    {v.title}
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      )}
    </BoxStyled>
  )
}

HomeSection5.defaultProps = {}

export default memo(HomeSection5)
