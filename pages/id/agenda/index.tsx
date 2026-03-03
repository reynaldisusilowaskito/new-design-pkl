import React from 'react'
import { Box, Grid, Typography, Skeleton } from '@mui/material'
import type { NextPage } from 'next'
import whatDayId from 'what-day-id'
import TimeAgo from 'javascript-time-ago'
import _ from 'lodash'
import { useRouter } from 'next/router'
import id from 'javascript-time-ago/locale/id'
import { StatusCodes } from 'http-status-codes'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import Head from 'next/head'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import Layout from 'components/layout'
import CarouselContent2 from 'components/carousel.content2'
import NewsList from 'components/news.list'
import Pagination from 'components/pagination'
import { fontSize, borderRadius } from 'styles/theme'
import { fontSizeDateInit } from 'components/news.item'
import { truncateText } from 'utils/truncate'
import { boxShadow } from 'styles/theme'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props { }

export const BoxStyled = styled(Box)(({ theme }) => ({}))

const Agenda: NextPage<Props> = () => {
  const router = useRouter()
  const [agenda, setAgenda] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number) => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=${pageParams}&category=info`, {
      method: 'GET',
    })
    const results = await fetchData.json()
    if (fetchData.status == StatusCodes.OK) {
      if (results?.data?.length > 0) {
        setAgenda(results.data)
        const totalPage = results.count / 15
        setCount(Math.ceil(totalPage))
      } else {
        setAgenda(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(`/id/agenda?page=${page}`, `/id/agenda?page=${page}`, { shallow: true })
    },
    [count, router.query]
  )
  React.useEffect(() => {
    window.scrollTo(0, 0)
    getData(router.query.page ? parseInt(router.query.page as string) : 1)
  }, [router.query])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <BoxStyled
        sx={{
          position: 'relative',
          backgroundImage: 'url(/images/bg-batik.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          overflow: 'hidden',
          minHeight: '100vh',
          mt: '-130px',
          pb: { xs: 4, sm: 6, md: 8 },
          ...(current != 1 && {
            '& .news-item-container': {
              '& .news-item:first-of-type': {
                marginTop: `0 !important`,
              },
            },
          }),
        }}
      >
        <Layout paddingY={2}>
          <>
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: 'background.paper',
                color: 'common.white',
                borderRadius: 8,
                px: 2,
                py: 1,
                fontWeight: 650,
                fontSize: { xs: 22, sm: 18 },
                letterSpacing: 1,
                boxShadow: 1,
                mb: 4,
                mt: { xs: 6, sm: 8, md: 20 },
              }}
            >
              AGENDA KOTA
            </Box>
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
                {agenda && current == 1 && (
                  <Grid container spacing={4} alignItems="stretch">
                    <Grid item xs={12} sm={7}>
                      <CarouselContent2 data={agenda.slice(0, 4)} slidesToShow={1} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        {agenda.slice(0, 4).map((v, i) => (
                          <Box
                            key={i}
                            marginTop={2}
                            sx={{
                              '& a': {
                                color: 'text.secondary',
                                textDecoration: 'none',
                                display: 'block',
                                borderRadius,
                                paddingY: 1.5,
                                paddingX: 2,
                                transition: `all 0.2s ease-in-out`,
                                '&:hover': {
                                  boxShadow,
                                },
                              },
                              '&:first-of-type': {
                                marginTop: 0,
                              },
                            }}
                          >
                            <Link href={`/id/agenda/${v.id}/${_.kebabCase(v.title)}`}>
                              <Typography
                                fontSize={fontSize}
                                textTransform="uppercase"
                                fontWeight={700}
                              >
                                {truncateText(v.title, 60)}
                              </Typography>
                              <Typography fontSize={fontSizeDateInit}>
                                {`${whatDayId(new Date(v.publish_date))} | ${timeAgo.format(
                                  new Date(v.publish_date)
                                )}`}
                              </Typography>
                            </Link>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                )}
                <NewsList
                  data={current == 1 ? agenda.slice(4, agenda.length) : agenda}
                  route="agenda"
                />
                <Box marginTop={5} marginBottom={3}>
                  <Pagination
                    total={count}
                    current={current}
                    loading={loading}
                    clickNextPrev={handleNextPrev}
                  />
                </Box>
              </>
            )}
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

export default Agenda
