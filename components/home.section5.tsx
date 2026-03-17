import React, { memo } from 'react'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { fontSize } from 'styles/theme'
import { ButtonStyled } from 'components/title'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props { }

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
    'administrasikependudukan': '/images/Pelayanan/administrasi.svg',
    'blc': '/images/Pelayanan/broadbandlearning.svg',
    'e-health': '/images/Pelayanan/ehealth.svg',
    'infografis': '/images/Pelayanan/infografis.svg',
    'jaringandokumentasi': '/images/Pelayanan/jaringandokumentasi.svg',
    'kecamatan': '/images/Pelayanan/kecamatan.svg',
    'ketenagakerjaan': '/images/Pelayanan/ketenagakerjaan.svg',
    'layananpengadaan': '/images/Pelayanan/layananpengadaan.svg',
    'pelayanandinaspendik': '/images/Pelayanan/pelayanandinaspendidikan.svg',
    'pelayanandinassosial': '/images/Pelayanan/pelayanandinassosial.png',
    'pemberdayaanekonomi': '/images/Pelayanan/pemberdayaan.svg',
    'pengaduanmasyarakat': '/images/Pelayanan/pengaduan.svg',
    'pelayananinformasi(ppidkotasurabaya)': '/images/Pelayanan/ppid.svg',
    'jdih': '/images/Pelayanan/ppid.svg',
    'rup': '/images/Pelayanan/ppid.svg',
    'lpse': '/images/Pelayanan/ppid.svg',
    'satudata': '/images/Pelayanan/satudata.svg',
    'sswalfa': '/images/Pelayanan/sswalfa.svg',
  }

  const servicesData = (data && data.length > 0) ? data : []

  return (
    <BoxStyled className={accessibility.css.negative ? 'negative' : ''}>
      {!loading && (
        <Box sx={(theme) => ({
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 29, 29, 0.7)' : '#fff',
          borderRadius: 6,
          px: downSm ? 2 : 20,
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
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: { xs: 4, sm: 5, md: 2.4 },
              width: '100%',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            {servicesData?.length > 0 && servicesData.map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                <Box
                  tabIndex={0}
                  sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    maxWidth: 360,
                    mx: 'auto',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    p: 2,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : '#f8f9fa',
                    },
                    '&:hover .service-title': {
                      color: theme.palette.mode === 'dark' ? '#ffffff' : '#006462',
                    },
                  })}
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
                      src={iconMap[v.title?.replaceAll(' ', '').toLowerCase()] || '/images/placeholder-icon.svg'}
                      alt={v.title}
                      style={{ width: '60%', height: '60%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-icon.svg'
                      }}
                    />
                  </Box>
                  <Box
                    className="service-title"
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
              </a>
            ))}
          </Box>
        </Box>
      )}
    </BoxStyled>
  )
}


HomeSection5.defaultProps = {}

export default memo(HomeSection5)
