import React, { memo, useRef } from 'react'
import { Box, Typography, IconButton, Skeleton } from '@mui/material'
import whatDayId from 'what-day-id'
import TimeAgo from 'javascript-time-ago'
import id from 'javascript-time-ago/locale/id'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import Layout from 'components/layout'
import { truncateText } from 'utils/truncate'
import PopperShare from 'components/popper.share'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { imagePath } from 'components/news.item'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import schema from 'types/schemas'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props {
  news: schema['schemas']['Article']
  contents: string[]
  others: schema['schemas']['Article'][]
  pageTitle: string
  route: string
  loadingDetail: boolean
  loading: boolean
}

// ─── Styled Components ───────────────────────────────────────────────────────

const MainContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  backgroundImage: 'url(/images/bg-batik.webp)',
  backgroundRepeat: 'repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  overflowX: 'hidden',
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 1),
  },
}))

const BreadcrumbContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
  marginTop: '160px',
}))

const BackButton = styled('button')(() => ({
  padding: 0,
  margin: 0,
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': { opacity: 0.8 },
}))

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '20px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
  fontWeight: 800,
  textTransform: 'uppercase',
}))

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: '24px',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#474747',
  fontWeight: 800,
  lineHeight: 1.3,
  marginBottom: '12px',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: { fontSize: '20px', marginTop: '16px' },
  [theme.breakpoints.down('sm')]: { fontSize: '18px', marginTop: '12px' },
}))

const DateText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: '14px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
  marginBottom: '16px',
  [theme.breakpoints.down('md')]: { fontSize: '13px' },
  [theme.breakpoints.down('sm')]: { fontSize: '12px' },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '490px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '40px',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: { height: '360px', marginTop: '18px' },
  [theme.breakpoints.down('sm')]: { height: '240px', marginTop: '14px' },
}))

const CardStyled = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'rgba(0, 57, 55, 0.85)'
      : 'rgba(255,255,255,0.60)',
  borderRadius: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 4px 24px rgba(0,0,0,0.30)'
      : '0 4px 24px rgba(0,0,0,0.10)',
  padding: theme.spacing(4, 4),
  maxWidth: 1200,
  margin: '32px auto 48px auto',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 1),
    maxWidth: '100%',
    margin: '24px auto 32px auto',
  },
}))

export const BoxTextStyled = styled(Box)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '16px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
  textAlign: 'justify',
  lineHeight: '2rem',
  marginTop: '20px',
  marginBottom: '50px',
  ...(theme.palette.mode === 'dark' && {
    '&, & *': {
      color: '#fff !important',
      borderColor: '#fff',
      fontFamily: "'Lato', Arial, sans-serif !important",
    },
    '& a': { color: theme.palette.secondary.main + ' !important' },
  }),
  '& p': {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
    fontFamily: "'Lato', Arial, sans-serif",
    fontSize: '16px',
    lineHeight: '22px',
  },
  '& img': { maxWidth: '100%', marginBottom: theme.spacing(2) },
  'iframe, video': { width: '100%' },
  '& .pdf-viewer': { margin: theme.spacing(3, 0), width: '100%' },
  video: { height: 'auto' },
  '& a': {
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#006462',
    textDecoration: 'underline',
    wordWrap: 'break-word',
    '&:hover': { color: '#2c6f9e' },
  },
  '& ul': {
    listStyle: 'disc',
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(6),
    '& li': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
      marginBottom: theme.spacing(1),
    },
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    fontFamily: "'Roboto', Arial, sans-serif",
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? '#fff' : '#222',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  '& h3': { fontSize: '20px', lineHeight: '24px' },
  '& strong, & b': { fontWeight: 700 },
}))

export const BoxImgStyled = styled(Box)(() => ({
  '& img': { objectFit: 'cover', aspectRatio: '16/6', width: '100%' },
}))

// Others section
const OthersWrapper = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  paddingTop: '48px',
  paddingBottom: '80px',
  [theme.breakpoints.down('md')]: { padding: theme.spacing(0, 1), paddingTop: '40px', paddingBottom: '60px' },
  [theme.breakpoints.down('sm')]: { paddingTop: '32px', paddingBottom: '48px' },
}))

const OthersTitleText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 800,
  color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
  fontFamily: "'Roboto', Arial, sans-serif",
  textTransform: 'uppercase',
}))

const SliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
  width: '100%',
  marginBottom: '32px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  paddingBottom: '10px',
  paddingTop: '15px',
  paddingLeft: '8px',
  paddingRight: '8px',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  [theme.breakpoints.down('md')]: { gap: '16px' },
  [theme.breakpoints.down('sm')]: { gap: '12px' },
}))

const NewsCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 57, 55, 0.85)' : 'rgba(255, 255, 255, 0.95)',
  borderRadius: '30px',
  border: `1.5px solid ${theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#D2B690'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  width: '372px',
  height: '350px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 8px 0px #003937cc'
      : '0px 2px 8px 0px #00000022',
  flexShrink: 0,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#006462',
    '& .card-title': {
      color: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
    },
    '& .card-date': {
      color: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
    },
  },
  [theme.breakpoints.down('md')]: { width: '300px', height: '280px' },
  [theme.breakpoints.down('sm')]: { width: '240px', height: '210px' },
}))

const CardImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '220px',
  overflow: 'hidden',
  borderRadius: '30px',
  [theme.breakpoints.down('md')]: { height: '180px' },
  [theme.breakpoints.down('sm')]: { height: '150px' },
}))

const CardTextContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '130px',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '20px',
  paddingBottom: '20px',
  gap: '10px',
  [theme.breakpoints.down('md')]: { padding: '16px 14px', height: '140px' },
  [theme.breakpoints.down('sm')]: { padding: '14px 12px', height: '140px' },
}))

const CardTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontWeight: 800,
  fontSize: '18px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'color 0.3s ease-in-out',
  [theme.breakpoints.down('md')]: { fontSize: '16px' },
  [theme.breakpoints.down('sm')]: { fontSize: '14px' },
}))

const CardDateText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '13px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
  transition: 'color 0.3s ease-in-out',
  [theme.breakpoints.down('md')]: { fontSize: '12px' },
  [theme.breakpoints.down('sm')]: { fontSize: '11px' },
}))

// ─── Component ────────────────────────────────────────────────────────────────

const Detail: React.FunctionComponent<Props> = ({
  news,
  contents,
  others,
  pageTitle,
  route,
  loadingDetail,
  loading,
}: Props) => {
  const router = useRouter()
  const sliderRef = useRef<HTMLDivElement>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()

  const handleBack = React.useCallback(
    () => router.push(`/id/${route}`, `/id/${route}`),
    [route]
  )

  const scrollPrev = () => {
    sliderRef.current?.scrollBy({ left: -400, behavior: 'smooth' })
  }
  const scrollNext = () => {
    sliderRef.current?.scrollBy({ left: 400, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ]
    const now = new Date()
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${diffDays} hari yang lalu`
  }

  return (
    <MainContainer
      sx={{
        mt: { xs: '-90px', md: '-130px' },
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
      }}
    >
      {/* ── Detail Section ── */}
      <ContentWrapper>
        {/* Breadcrumb */}
        <BreadcrumbContainer>
          <BackButton onClick={handleBack} aria-label={`Kembali ke ${pageTitle}`}>
            <Box
              component="img"
              src="/images/icon/nav-prev yellow.svg"
              alt="Kembali"
              sx={{ width: 40, height: 40, display: 'block', mr: 1.5 }}
            />
          </BackButton>
          <BreadcrumbText>{pageTitle.toUpperCase()}</BreadcrumbText>
        </BreadcrumbContainer>

        {loadingDetail ? (
          <>
            {[...new Array(6)].map((_v, i) => (
              <Skeleton key={i} variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
            ))}
          </>
        ) : (
          news && (
            <>
              {/* Title */}
              <TitleText
                sx={{ fontSize: `${24 + accessibility.fontSize}px` }}
                onMouseEnter={(e) => textToSpeech(e, true)}
              >
                {news.title}
              </TitleText>

              {/* Date + Share */}
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DateText>{formatDate(news.publish_date || '')}</DateText>
                <PopperShare title={news.title} />
              </Box>

              {/* Feature image */}
              {news.feature_image_url && (
                <ImageContainer>
                  <img
                    src={imagePath(news.id || 0, news.feature_image_url, false)}
                    alt={news.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </ImageContainer>
              )}

              {/* Article content */}
              <CardStyled>
                <BoxTextStyled
                  onMouseEnter={() => textToSpeech(truncateText(news.content, 0), false)}
                  sx={{
                    columnCount: downSm || news.content.length < 5000 ? 1 : 2,
                    columnGap: downSm || news.content.length < 5000 ? 0 : 3,
                    fontSize: `1${accessibility.fontSize}0%`,
                  }}
                >
                  {contents.map((item, i) => {
                    const isPdf = item && item.substring(0, 5) === '<pdf>'
                    if (isPdf) {
                      const tagPdf = /<pdf>(.*?)<\/pdf>/g.exec(item)
                      if (tagPdf?.length) {
                        return (
                          <Box key={i} className="pdf-viewer">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                              <Viewer
                                fileUrl={tagPdf[0].replace('<pdf>', '').replace('</pdf>', '')}
                                plugins={[defaultLayoutPluginInstance]}
                              />
                            </Worker>
                          </Box>
                        )
                      }
                    }
                    return (
                      <div key={i} className="text" dangerouslySetInnerHTML={{ __html: item }} />
                    )
                  })}
                </BoxTextStyled>
              </CardStyled>
            </>
          )
        )}
      </ContentWrapper>

      {/* ── Others Section ── */}
      <OthersWrapper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <OthersTitleText>{pageTitle} Lainnya</OthersTitleText>
          <Box display="flex" gap={1}>
            <IconButton onClick={scrollPrev} size="small" sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#006462',
              color: '#fff',
              '&:hover': { bgcolor: '#004e4c' },
            })}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={scrollNext} size="small" sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#006462',
              color: '#fff',
              '&:hover': { bgcolor: '#004e4c' },
            })}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3 }} />
        ) : (
          <SliderContainer ref={sliderRef}>
            {others?.map((item, i) => (
              <NewsCard
                key={i}
                onClick={() => router.push(`/id/${route}/${item.id}/${item.title?.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <CardImageContainer>
                  <img
                    src={imagePath(item.id || 0, item.feature_image_url || '', false)}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </CardImageContainer>
                <CardTextContent>
                  <CardTitle className="card-title">{item.title}</CardTitle>
                  <CardDateText className="card-date">
                    {formatDate(item.publish_date || '')}
                  </CardDateText>
                </CardTextContent>
              </NewsCard>
            ))}
          </SliderContainer>
        )}
      </OthersWrapper>
    </MainContainer>
  )
}

Detail.defaultProps = {}

export default memo(Detail)
