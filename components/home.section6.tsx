import React, { memo } from 'react'
import {
  Box,
  Skeleton,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import CarouselContent from 'components/carousel.content'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import schema from 'types/schemas'

interface Props {}

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  // backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  padding: theme.spacing(6, 0, 0, 0),
  margin: 0,
  minHeight: 420,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& .MuiGrid-container': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('sm')]: {
    margin: 0,
    padding: theme.spacing(3, 0, 0, 0),
    '& .slick-arrow': {
      display: 'none',
    },
  },
}))

const HomeSection6: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const loading = false
  const { data } = useQuery<{ data: schema['schemas']['Article'][] }>(['home_videos'])
  
  return (
    <BoxStyled
      sx={{
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: { xs: 1, md: 0 }, pb: 0, width: '100%', maxWidth: 1100 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/icon/icon_batik_coklat_kiri.svg"
            alt="icon_batik"
            style={{ width: 32, height: 32, marginRight: 12, display: 'block' }}
          />
          <span style={{ fontSize: 28, fontWeight: 600, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
            VIDEO
          </span>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#C7A97A',
              border: 'none',
              borderRadius: 999,
              padding: '6px 18px',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 15,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#C7A97A'
              e.currentTarget.style.color = '#fff'
              const svg = e.currentTarget.querySelector('svg path')
              if (svg) svg.setAttribute('fill', '#fff')
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#C7A97A'
              const svg = e.currentTarget.querySelector('svg path')
              if (svg) svg.setAttribute('fill', '#C7A97A')
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7A2.5 2.5 0 1 0 12 16a2.5 2.5 0 0 0 0-5z" fill="#C7A97A"/>
            </svg>
            Lihat Semua
          </button>
        </Box>
      </Box>
      <Box sx={{ px: { xs: 3, md: 2 }, pt: 4, width: '100%', maxWidth: 1100, mx: 'auto', position: 'relative' }}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(0, 0, 0, 0.1)',
            }}
          />
        ) : (
          <>
            {!!data?.data?.length &&
              <CarouselContent
                data={data.data}
                gridContent={6}
                gridImage={6}
                slidesToShow={downSm ? 1 : 3}
                gridSpacing={2}
                route="videos"
                withDescription={false}
                truncateTitle={60}
              />
            }
          </>
        )}
      </Box>
    </BoxStyled>
  )
}

HomeSection6.defaultProps = {}

export default memo(HomeSection6)
