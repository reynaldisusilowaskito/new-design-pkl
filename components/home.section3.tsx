import React, { memo } from 'react'
import { Grid, Box, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
// import Title from 'components/title'
import NewsContainer from 'components/news.container'
import CarouselContent from 'components/carousel.content'
// import NewsContainer2 from 'components/news.container2'
import { BreakpointsContext } from 'contexts/breakpoints'
import schema from 'types/schemas'

interface Category {
  alias: string
  created_at: string
  description?: string
  id: number
  locale: string
  name: string
  parent_id?: string
  updated_at: string
}

export interface NewsType {
  category?: Category[]
  content?: string
  content_type?: string
  created_at: string
  feature_image: string
  id?: number
  id_lama?: number
  locale?: string
  name?: string
  parent_id?: number
  post_type?: string
  status?: string
  tag?: Category[]
  title: string
  updated_at?: string
  user_id?: number
  viewed_count?: number
}

interface Props { }

const BoxStyled = styled(Box)(({ theme }) => ({
  '& .MuiGrid-container': {
    position: 'relative',
    zIndex: 1,
  },
  '& .wrapper-svg-section3': {
    position: 'absolute',
    top: theme.spacing(3),
    right: `calc(100% + ${theme.spacing(2)})`,
    '& svg': {
      width: 50,
      '& circle': {
        fill: `${theme.palette.primary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-section3': {
      display: 'none',
    },
    '& .slick-arrow': {
      display: 'none',
    },
  },
}))

const HomeSection3: React.FunctionComponent<Props> = () => {
  const router = useRouter()
  const loading = false
  const { downSm } = React.useContext(BreakpointsContext)
  const { data } = useQuery<{ data: schema['schemas']['Article'][] }>(['home_news'])
  const handleLihatSemua = React.useCallback(() => {
    router.push('/id/berita')
  }, [router])



  // Static data for right card (PEMILU SERENTAK 2024)
  const pemiluArticles = [
    {
      date: '27-02-2024 20:12',
      title: 'Pendekatan Multi-Stakeholder Perlu bagi Pemajuan Diplomasi Digital',
    },
    {
      date: '22-02-2024 13:00',
      title: 'Baru 2 Hari, 44,7% Anak Sudah Imunisasi SUB PIN Polio Putaran Dua',
    },
    {
      date: '22-02-2024 04:44',
      title: 'Ayo Lakukan Pemadanan NIK-NPWP!',
    },
    {
      date: '22-02-2024 09:51',
      title: 'Forum Tematik Bakohumas: Komitmen Seluruh Humas Sukseskan Pelaporan SPT dan Pemadanan NIK-NPWP',
    },
    {
      date: '22-02-2024 15:07',
      title: 'KY Buka Pendaftaran 10 Calon Hakim Agung & 3 Calon Hakim ad hoc HAM',
    },
  ]

  return (
    <>
      {data?.data && (
        <BoxStyled sx={{ position: 'relative', borderRadius: 0, p: downSm ? 2 : 4, overflow: 'hidden' }}>
          {/* Top Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src="/images/icon/icon_batik_coklat_kiri.svg"
                alt="icon_batik"
                style={{ width: 32, height: 32, marginRight: 12, display: 'block' }}
              />
              <span style={{ fontSize: 28, fontWeight: 600, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
                BERITA TERBARU
              </span>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <button
                onClick={handleLihatSemua}
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
                  e.currentTarget.style.background = '#C7A97A';
                  e.currentTarget.style.color = '#fff';
                  const svg = e.currentTarget.querySelector('svg path');
                  if (svg) svg.setAttribute('fill', '#fff');
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#C7A97A';
                  const svg = e.currentTarget.querySelector('svg path');
                  if (svg) svg.setAttribute('fill', '#C7A97A');
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7A2.5 2.5 0 1 0 12 16a2.5 2.5 0 0 0 0-5z" fill="#C7A97A"/>
                </svg>
                Lihat Semua
              </button>
            </Box>
          </Box>
          <Grid container spacing={downSm ? 0 : 4} alignItems="stretch">
            <Grid item xs={12} sm={8}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={340}
                  sx={{
                    borderRadius: 3,
                  }}
                />
              ) : (
                <>
                  {!!data?.data?.length && (
                    <CarouselContent
                      data={data?.data?.slice(0, 7) || []}
                      slidesToShow={1}
                      gridSpacing={0}
                      truncateTitle={60}
                      fontSizeProps={18}
                      withDescription={false}
                      gridImage={12}
                      gridContent={12}
                      truncateDescription={90}
                      withThumbnail={false}
                      route="berita"
                    />
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                background: '#E6D2B5',
                borderRadius: 5,
                p: 2.5,
                minHeight: 200,
                maxHeight: 480,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#066666', marginBottom: 12 }}>PEMILU SERENTAK 2024</div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
                  {pemiluArticles.map((item, idx) => (
                    <div key={idx} style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', marginBottom: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{item.date}</div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#066666', lineHeight: 1.3 }}>Artikel</div>
                      <div style={{ fontSize: 13, color: '#222', marginTop: 2 }}>{item.title}</div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 10 }}>infopemilu.go.id</div>
              </Box>
            </Grid>
          </Grid>
        </BoxStyled>
      )}
    </>
  )
}

HomeSection3.defaultProps = {}

export default memo(HomeSection3)
