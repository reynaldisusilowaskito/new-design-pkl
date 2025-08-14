import React, { memo } from 'react'
import {
  Box,
  Skeleton,
  Grid,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {}

const BoxStyled = styled(Box)(({ theme }) => ({
  width: '95%',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 20,
//   boxShadow: '0 4px 20px rgba(21, 3, 3, 1)',
  marginLeft: 'auto',
  marginRight: 'auto',
  // maxWidth: 1200,
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(20),
    paddingRight: theme.spacing(20),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}))

const PhotoCard = styled(Box)(() => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  aspectRatio: '16/9',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}))

const PhotoOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    opacity: 1,
  },
}))

const HomeSection7: React.FunctionComponent<Props> = () => {
  const accessibility = React.useContext(AccessibilityContext)
  const loading = false

  // Sample photos data - replace with actual data from API
  const photos = [
    {
      id: '1',
      title: 'Kegiatan Penanaman Pohon',
      image: '/images/photos/photo1.jpg',
      alt: 'Foto kegiatan penanaman pohon bersama masyarakat'
    },
    {
      id: '2',
      title: 'Gotong Royong Lingkungan',
      image: '/images/photos/photo2.jpg',
      alt: 'Foto kegiatan gotong royong membersihkan lingkungan'
    },
    {
      id: '3',
      title: 'Acara Budaya Surabaya',
      image: '/images/photos/photo3.jpg',
      alt: 'Foto acara budaya khas Surabaya'
    },
    {
      id: '4',
      title: 'Program Pembangunan',
      image: '/images/photos/photo4.jpg',
      alt: 'Foto program pembangunan infrastruktur'
    },
  ]

  const handlePhotoClick = (photo: any) => {
    // Handle photo click - navigate to photo detail or open modal
    console.log('Opening photo:', photo.title)
  }

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
            FOTO
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
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{
                    borderRadius: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {photos.map((photo) => (
              <Grid item xs={12} sm={6} key={photo.id}>
                <PhotoCard onClick={() => handlePhotoClick(photo)}>
                  <img
                    src={photo.image}
                    alt={photo.alt}
                    onError={(e) => {
                      // Fallback image if photo fails to load
                      e.currentTarget.src = '/images/placeholder-photo.jpg'
                    }}
                  />
                  <PhotoOverlay>
                    <Box
                      sx={{
                        color: 'white',
                        textAlign: 'center',
                        padding: 2,
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: 1,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {photo.title}
                    </Box>
                  </PhotoOverlay>
                </PhotoCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </BoxStyled>
  )
}

HomeSection7.defaultProps = {}

export default memo(HomeSection7)
