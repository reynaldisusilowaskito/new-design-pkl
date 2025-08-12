import React from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import Title from 'components/title'
import MediaHeader from 'components/media.header'
import Pagination from 'components/pagination'
import NewsItem from 'components/news.item'
import { BoxStyled } from 'pages/id/videos/index'
import { fontSizeTitle } from 'components/news.list'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { AccessibilityContext } from 'contexts/accessibility'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

export interface PodcastType {
  image: string
  title: string
  length: string
}

interface Props {}

const Infografis: NextPage<Props> = () => {
  const router = useRouter()
  const accessibility = React.useContext(AccessibilityContext)
  const [infografis, setInfografis] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number) => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=${pageParams}&category=infografis`, {
      method: 'GET',
    })
    const results = await fetchData.json()
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length > 0) {
        setInfografis(results.data)
        const totalPage = results.count / 15
        setCount(Math.ceil(totalPage))
      } else {
        setInfografis(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(`/id/infografis?page=${page}`, `/id/infografis?page=${page}`, { shallow: true })
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
      <BoxStyled overflow="hidden" className={accessibility.css.negative ? 'negative' : ''}>
        <Layout paddingY={2}>
          <>
            <Box className="wrapper-svg-element1 infografis">
              <Element1 />
            </Box>
            <Box className="wrapper-svg-element4 infografis">
              <Element4 />
            </Box>
            <Title text="Infografis" />
            <Box position="relative">
              <Box className="wrapper-svg-element3a">
                <Element3 />
              </Box>
              <Box className="wrapper-svg-element3b">
                <Element3 />
              </Box>
              <MediaHeader
                text="Infografis mengenai Kota Surabaya"
                description="Pemerintah Kota Surabaya"
              />
              <Grid container spacing={4} marginTop={0}>
                {loading ? (
                  <>
                    {[...new Array(6)].map((_v, i) => (
                      <Grid key={i} item xs={12} sm={4}>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={300}
                          sx={{
                            borderRadius: 4,
                          }}
                        />
                      </Grid>
                    ))}
                  </>
                ) : (
                  <>
                    {infografis &&
                      infografis.length > 0 &&
                      infografis.map((v, i) => (
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
                  </>
                )}
              </Grid>
            </Box>
            <Box marginTop={5} marginBottom={3}>
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

export default Infografis
