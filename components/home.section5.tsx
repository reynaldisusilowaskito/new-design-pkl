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
  return (
    <BoxStyled className={accessibility.css.negative ? 'negative' : ''}>
      {!loading && (
        <Box sx={{
          width: '95%',
          px: { xs: 2, md: 20 },
          py: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
          bgcolor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mx: 'auto',
          // maxWidth: 1200,
        }}>
          {/* Section Title */}
          <Box sx={{
            display: 'flex',
            gap: 1.5,
            mb: 5,
            width: '100%',
          }}>
            <img src="/images/icon/icon_batik_coklat_kiri.svg" alt="icon_batik" style={{ width: 32, height: 32, marginRight: 8, display: 'block' }} />
            <span style={{ fontSize: 24, fontWeight: 700, color: '#2E8B8B', letterSpacing: 0.5, lineHeight: 1.2, textAlign: 'center' }}>
              PELAYANAN PEMERINTAH KOTA SURABAYA
            </span>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: { xs: 3, sm: 4, md: 2 },
              width: '100%',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            {data?.length > 0 && data.map((v, i) => (
              <Link key={i} href={v.url} style={{ textDecoration: 'none', width: '100%' }}>
                <Box
                  tabIndex={0}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    maxWidth: 180,
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
                      width: { xs: 80, md: 90 },
                      height: { xs: 80, md: 90 },
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
                    {v.feature_image_url && (
                      <img
                        src={v.feature_image_url}
                        alt={v.title}
                        style={{ width: 48, height: 48, objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      color: '#2E8B8B',
                      fontWeight: 600,
                      fontSize: { xs: 13, md: 14 },
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
