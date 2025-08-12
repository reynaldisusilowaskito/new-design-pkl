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
          width: '100%',
          px: { xs: 1, md: 4 },
          py: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Section Title */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mb: 4,
            width: '100%',
          }}>
            <img src="/images/icon/icon_batik_coklat_kiri.svg" alt="icon_batik" style={{ width: 28, height: 28, marginRight: 8, display: 'block' }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
              PELAYANAN PEMERINTAH KOTA SURABAYA
            </span>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                sm: 'repeat(4, 1fr)',
                md: 'repeat(5, 1fr)',
              },
              gap: { xs: 2, sm: 3, md: 4 },
              width: '100%',
              maxWidth: 950,
              mx: 'auto',
              justifyItems: 'center',
              alignItems: 'start',
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
                    maxWidth: 150,
                    mx: 'auto',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'transform 0.15s',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.04)',
                    },
                  }}
                  onMouseEnter={(e) => textToSpeech(e, true)}
                >
                  <Box
                    sx={{
                      width: 76,
                      height: 76,
                      borderRadius: '50%',
                      bgcolor: '#9C7B43',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    {v.icon && (
                      <img
                        src={v.icon}
                        alt={v.title}
                        style={{ width: 44, height: 44, objectFit: 'contain', display: 'block' }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      color: '#176B87',
                      fontWeight: 600,
                      fontSize: 15,
                      textAlign: 'center',
                      minHeight: 38,
                      lineHeight: 1.2,
                      textTransform: 'none',
                      letterSpacing: 0,
                      wordBreak: 'break-word',
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
