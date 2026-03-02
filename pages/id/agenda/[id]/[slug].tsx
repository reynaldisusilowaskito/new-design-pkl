import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { parse } from 'node-html-parser'
import { StatusCodes } from 'http-status-codes'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import replaceAllInserter from 'string.prototype.replaceall'
import BeritaDetail from 'components/news.detail.redesign'
import BeritaLainnya from 'components/news.others.redesign'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'
import pers from 'pages/api/data/agenda'
import Detail from 'components/detail'

interface Props {
  detail: schema['schemas']['Article']
}

const AgendaDetail: NextPage<Props> = ({ detail }: Props) => {
  const router = useRouter()
  const [agenda, setAgenda] = React.useState<schema['schemas']['Article'][]>([])
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
  const contents = React.useMemo(() => {
    const dataContents = []
    const virtualDoc = parse(data.content)
    if (virtualDoc?.childNodes?.length) {
      virtualDoc?.childNodes.forEach((node: any) => {
        if (node?.getAttribute && node?.getAttribute('class') === 'pdf-viewer') {
          const urlPdf = `https://surabaya.go.id/uploads/${node?.getAttribute('data-url')}`
          dataContents.push(`<pdf>${urlPdf}</pdf>`)
        } else {
          dataContents.push(node.outerHTML)
        }
      })
    }

    return dataContents
  }, [data])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=1&category=info`, { method: 'GET' })
    const results = await fetchData.json()
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length > 0) {
        setAgenda(results.data)
      } else {
        setAgenda(null)
      }
    }
    setLoading(false)
  }

  React.useEffect(() => {
    getData()
  }, [])

  const handleLihatSemua = () => {
    router.push('/id/agenda')
  }

  return (
    <React.Fragment>
      <Head>
        <title>{data.title || 'Detail Agenda'} - Pemerintah Kota Surabaya</title>
        <meta name="description" content={data.title || 'Pemerintah Kota Surabaya'} />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
          backgroundImage: 'url("/images/bg-batik.webp")',
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <Detail
          news={data}
          contents={contents}
          pageTitle="Agenda Kota"
          route="agenda"
          loadingDetail={false}
          loading={loading} 
          others={[]}        
        />
      </Box>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  try {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
    const { slug } = query

    if (!slug || typeof slug !== 'string') {
      return {
        redirect: {
          destination: '/id/agenda',
          permanent: false,
        },
      }
    }

    const detail = await getDetail(slug, 'info')
    let content = ''

    if (!detail) {
      return {
        redirect: {
          destination: '/id/agenda',
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
  } catch (error) {
    console.error('Error in getServerSideProps:', error)
    return {
      redirect: {
        destination: '/id/agenda',
        permanent: false,
      },
    }
  }
}

export default AgendaDetail
