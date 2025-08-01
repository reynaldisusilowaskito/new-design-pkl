import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { parse } from 'node-html-parser'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import replaceAllInserter from 'string.prototype.replaceall'
import Layout from 'components/layout'
import PagesTitle from 'components/pages.title'
import Article from 'components/article'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {
  detail: schema['schemas']['Article']
}

const Pages: NextPage<Props> = ({ detail }: Props) => {
  // const content = React.useMemo(() => detail.content.replace(new RegExp('\\src="../../', 'gm'), `src="https://surabaya.go.id/`), [detail]);
  const content = React.useMemo(() => {
    const replaceData = replaceAllInserter(
      detail.content,
      `src="../../`,
      `src="https://surabaya.go.id/`
    )
    return replaceAllInserter(replaceData, `href="../../`, `href="/../../`)
  }, [detail])
  const contents = React.useMemo(() => {
    const dataContents = []
    const virtualDoc = parse(content)
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
  }, [content])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <Layout paddingY={0}>
        <PagesTitle text={detail.title} />
      </Layout>
      <Layout paddingY={0} maxWidth="md">
        <Article contents={contents} paddingY={8} />
      </Layout>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { slug } = query
  const detail = await getDetail(slug, 'halaman')
  let content = ''
  console.log('ddd', detail)
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

export default Pages
