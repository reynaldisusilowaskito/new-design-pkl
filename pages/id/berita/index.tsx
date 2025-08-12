import React from 'react'
import { Box, Skeleton } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import CarouselContent from 'components/carousel.content'
import Title from 'components/title'
import NewsList, { fontSizeBigger, fontSizeTitle } from 'components/news.list'
import Pagination from 'components/pagination'
import { BreakpointsContext } from 'contexts/breakpoints'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {}

const BoxStyled = styled(Box)(({ theme }) => ({
  '& .main-slider': {
    '& .main': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.spacing(2.5),
      marginBottom: theme.spacing(5),
      overflow: 'hidden',
      '& .slick-arrow': {
        top: '50%',
        '&.next': {
          right: 10,
          transform: 'translate(0, -50%)',
        },
        '&.prev': {
          left: 10,
          transform: 'translate(0, -50%) rotate(180deg)',
        },
      },
      '& .slick-slider': {
        '& .slick-list': {
          '& .slick-track': {
            '& .slick-slide': {
              '& a': {
                '& .MuiGrid-container': {
                  '& .MuiGrid-item': {
                    '& img': {
                      borderRadius: 0,
                    },
                    '&:first-of-type': {
                      order: 2,
                    },
                    '&:last-of-type': {
                      order: 1,
                    },
                    '& .inner': {
                      padding: theme.spacing(4, 8),
                      color: theme.palette.common.white,
                      '& .title': {
                        fontSize: fontSizeBigger,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '& .thumb': {
      position: 'relative',
      backgroundColor:
        theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.background.paper,
      borderRadius: theme.spacing(2.5),
      padding: theme.spacing(7, 5),
      '& .slick-slider': {
        maxWidth: 920,
        margin: '0 auto',
      },
      '& .wrapper-svg-section3': {
        position: 'absolute',
        top: theme.spacing(3),
        right: `calc(100% + ${theme.spacing(4)})`,
        '& svg': {
          width: 50,
          '& circle': {
            fill: theme.palette.secondary.main,
          },
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .main-slider': {
      '& .main': {
        '& .slick-slider': {
          '& .slick-list': {
            '& .slick-track': {
              '& .slick-slide': {
                '& a': {
                  '& .MuiGrid-container': {
                    '& .MuiGrid-item': {
                      '&:first-of-type': {
                        order: 1,
                      },
                      '&:last-of-type': {
                        order: 2,
                      },
                      '& .inner': {
                        padding: theme.spacing(2),
                        '& .title': {
                          fontSize: fontSizeTitle - 5,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '& .thumb': {
        '& .wrapper-svg-section3': {
          display: 'none',
        },
      },
    },
  },
}))

const News: NextPage<Props> = () => {
  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const [news, setNews] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number, searchParams?: string) => {
    setLoading(true)
    console.log('getData search', searchParams)
    const fetchData = await fetch(
      `/api/data/news?page=${pageParams}&category=berita${
        searchParams ? `&search=${searchParams}` : ''
      }`,
      { method: 'GET' }
    )
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length > 0) {
        setNews(results.data)
        const totalPage = results.count / 15
        setCount(Math.ceil(totalPage))
      } else {
        setNews(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const q = router.query.q
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(
        `/id/berita?page=${page}${q ? `&q=${q}` : ''}`,
        `/id/berita?page=${page}${q ? `&q=${q}` : ''}`,
        { shallow: true }
      )
    },
    [count, router.query]
  )
  React.useEffect(() => {
    window.scrollTo(0, 0)
    getData(router.query.page ? parseInt(router.query.page as string) : 1, router.query.q as string)
  }, [router.query])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <BoxStyled
        sx={
          current != 1 && {
            '& .news-item-container': {
              '& .news-item:first-of-type': {
                marginTop: `0 !important`,
              },
            },
          }
        }
      >
        <Layout paddingY={2}>
          <>
            <Title text="Berita" />
            {loading ? (
              <>
                {[...new Array(6)].map((_v, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{
                      borderRadius: 4,
                      marginBottom: 4,
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                <Box className="main-slider">
                  {news && news.length > 0 && current == 1 && (
                    <CarouselContent
                      data={news.slice(0, 7)}
                      gridContent={6}
                      gridImage={6}
                      slidesToShow={1}
                      gridSpacing={0}
                      truncateDescription={260}
                      withThumbnail={downSm ? false : true}
                      route="berita"
                    />
                  )}
                </Box>
                {news && news.length > 0 && (
                  <NewsList data={current == 1 ? news.slice(7, news.length) : news} />
                )}
              </>
            )}
            <Box marginTop={5}>
              <Pagination
                total={count}
                current={current}
                loading={loading}
                clickNextPrev={handleNextPrev}
              />
            </Box>
          </>
        </Layout>
      </BoxStyled>
    </React.Fragment>
  )
}

export const getServerSideProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default News
