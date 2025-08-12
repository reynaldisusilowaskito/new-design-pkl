import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import TimeAgo from 'javascript-time-ago'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import id from 'javascript-time-ago/locale/id'
import replaceAllInserter from 'string.prototype.replaceall'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import Title from 'components/title'
import MediaDate from 'components/media.date'
import { boxShadow, boxShadow2, borderRadius } from 'styles/theme'
import { fontSizeTitle } from 'components/news.list'
import NewsItem from 'components/news.item'
import { BoxStyled as BoxNewsStyled } from 'pages/id/videos/index'
// import Link from 'next/link';
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { ColorModeContext } from 'contexts/colorMode'
import { AccessibilityContext } from 'contexts/accessibility'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props {
  detail: schema['schemas']['Article']
}

// const dataDownload = [
//   'https://surabaya.go.id/uploads/attachments/2021/12/63029/SEKDA.pdf?1640746495',
//   'https://surabaya.go.id/uploads/attachments/2021/12/63029/SEKDA.pdf?1640746495',
//   'https://surabaya.go.id/uploads/attachments/2021/12/63029/SEKDA.pdf?1640746495',
// ];

// const BoxButtonStyled = styled(Box)(({ theme }) => ({
//   '& a': {
//     textDecoration: 'none',
//     borderRadius: theme.spacing(1),
//     padding: theme.spacing(1.5),
//     marginBottom: theme.spacing(1),
//     overflow: 'hidden',
//     display: 'block',
//     whiteSpace: 'nowrap',
//     textOverflow: 'ellipsis',
//     color: theme.palette.text.primary,
//     fontWeight: 700,
//     '&:hover': {
//       boxShadow,
//     },
//   },
// }));

// const DownloadButton = React.memo(({ link }: any) => {
//   return (
//     <BoxButtonStyled>
//       <Link href={link}>
//         <a target="_blank">{link}</a>
//       </Link>
//     </BoxButtonStyled>
//   );
// });

const BoxStyled = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(5),
  '& .container-text': {
    boxShadow,
    borderRadius: theme.spacing(borderRadius),
    padding: theme.spacing(5),
    overflow: 'hidden',
    backgroundColor:
      theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
    '& .content': {
      '& img': {
        maxWidth: '100%',
      },
    },
  },
  '& .wrapper-svg-element1': {
    position: 'absolute',
    top: 0,
    left: '100%',
    transform: 'translate(-40%, -30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(70),
    },
  },
  '& .wrapper-svg-element3': {
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translate(20px, 0)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(6),
      '& circle': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-element4': {
    position: 'absolute',
    bottom: 0,
    right: '100%',
    transform: 'translate(40%, -20%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(50),
    },
  },
  '&.negative': {
    '& .wrapper-svg-element4, & .wrapper-svg-element1': {
      '& svg': {
        '& path': {
          stroke: `${theme.palette.common.white} !important`,
        },
        '& circle': {
          stroke: `${theme.palette.common.white} !important`,
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-element1, & .wrapper-svg-element3, & .wrapper-svg-element4': {
      display: 'none',
    },
  },
}))

const BoxStyledOthers = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
}))

const InfografisDetail: NextPage<Props> = ({ detail }: Props) => {
  const router = useRouter()
  const { mode } = React.useContext(ColorModeContext)
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const [news, setNews] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const data = React.useMemo(() => {
    const dataDetail = detail
    dataDetail.content = replaceAllInserter(
      dataDetail.content,
      `src="../../`,
      `src="https://surabaya.go.id/`
    )
    dataDetail.content = replaceAllInserter(dataDetail.content, `href="../../`, `href="/../../`)
    return dataDetail
  }, [detail])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=1&category=info`, { method: 'GET' })
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length) {
        setNews(results.data)
      } else {
        setNews(null)
      }
    }
    setLoading(false)
  }
  React.useEffect(() => {
    getData()
  }, [])
  const handleOnClick = React.useCallback(() => router.push(`/id/infografis`, `/id/infografis`), [])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <BoxStyled overflow="hidden" className={accessibility.css.negative ? 'negative' : ''}>
        <Layout paddingY={2}>
          <>
            <Box className="wrapper-svg-element1">
              <Element1 />
            </Box>
            <Box className="wrapper-svg-element3">
              <Element3 />
            </Box>
            <Box className="wrapper-svg-element4">
              <Element4 />
            </Box>
            <Title text="Infografis" paddingY={3} onBack={() => router.push(`/id/infografis`)} />
            <Box className="container-text">
              <Typography
                fontSize={(downSm ? fontSizeTitle - 2 : fontSizeTitle) + accessibility.fontSize}
                fontWeight={900}
                lineHeight={1.3}
                textTransform="uppercase"
                marginBottom={1}
              >
                {detail.title}
              </Typography>
              <MediaDate
                date={detail.publish_date}
                others={timeAgo.format(new Date(detail.publish_date)) as string}
                justifyContent="flex-start"
              />
              <Box
                className="content"
                marginTop={3}
                sx={{
                  fontSize: `1${accessibility.fontSize}0%`,
                }}
              >
                <div className="text" dangerouslySetInnerHTML={{ __html: data.content }} />
              </Box>
              {/* <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                  <Box className="content">
                    <div className="text" dangerouslySetInnerHTML={{__html: data.content}} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box marginBottom={2}>
                    <Typography
                      fontSize={downSm ? fontSizeTitle - 2 : fontSizeTitle}
                      fontWeight={900}
                      lineHeight={1.3}
                      textTransform="uppercase"
                      marginBottom={1}
                    >
                      {detail.title}
                    </Typography>
                    <MediaDate date={detail.created_at} others={timeAgo.format(new Date(detail.created_at)) as string} justifyContent="flex-start" />
                  </Box>
                  {dataDownload.map((v, i) => (
                    <DownloadButton link={v} key={i} />
                  ))}
                </Grid>
              </Grid> */}
            </Box>
          </>
        </Layout>
      </BoxStyled>
      <BoxStyledOthers marginTop={2} paddingBottom={8}>
        <Layout>
          <>
            <Title
              text={`Infografis Lainnya`}
              buttonText={downSm ? 'lainnya' : 'lihat semua'}
              onClick={handleOnClick}
            />
            {!loading && news && news.length > 2 && (
              <BoxNewsStyled
                className="container-inner"
                sx={{
                  '& a': {
                    backgroundColor: mode == 'dark' ? 'background.paper' : 'common.white',
                    '&:hover': {
                      boxShadow: `${mode == 'dark' ? boxShadow : boxShadow2} !important`,
                    },
                  },
                }}
              >
                <Grid container spacing={4} alignItems="stretch">
                  {[news[0], news[1], news[2]].map((v, i) => (
                    <Grid
                      key={i}
                      item
                      sm={4}
                      className={`grid-content`}
                      sx={{
                        '& .MuiGrid-container': {
                          '& .MuiGrid-item': {
                            '& .inner': {
                              '& .title': {
                                fontSize: fontSizeTitle - 5 + accessibility.fontSize,
                              },
                            },
                          },
                        },
                      }}
                    >
                      <NewsItem
                        data={v}
                        gridSpacing={2}
                        withDescription={false}
                        gridImage={12}
                        gridContent={12}
                        truncateTitle={30}
                        withIconSurabaya={true}
                        withPlay={false}
                        route="infografis"
                      />
                    </Grid>
                  ))}
                </Grid>
              </BoxNewsStyled>
            )}
          </>
        </Layout>
      </BoxStyledOthers>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { slug } = query
  const detail = await getDetail(slug, 'infografis')
  let content = ''

  if (!detail) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  detail.details?.map((item) => {
    content += item.content
  })
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      detail: {
        ...detail,
        content,
      },
    },
  }
}

export default InfografisDetail
