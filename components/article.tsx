import React, { memo } from 'react'
import { Box } from '@mui/material'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { styled } from '@mui/material/styles'
import { fontSize } from 'styles/theme'
import { AccessibilityContext } from 'contexts/accessibility'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface Props {
  text?: string
  contents?: string[]
  className?: string
  paddingY?: number
}

const BoxStyled = styled(Box)(({ theme }) => ({
  '& .description': {
    '& h1, & h2, & h3, & h4, & h5, & h6, & p': {
      marginTop: 0,
      marginBottom: 0,
      '& b, & strong': {
        fontWeight: 900,
      },
    },
  },
  '&.webdisplay': {
    '& .description': {
      '& h1, & h2, & h3, & h4, & h5, & h6, & p': {
        marginBottom: theme.spacing(2),
      },
    },
  },
}))

const Article: React.FunctionComponent<Props> = ({
  text,
  contents,
  className,
  paddingY,
}: Props) => {
  const accessibility = React.useContext(AccessibilityContext)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  return (
    <BoxStyled
      className={className}
      sx={{
        paddingY,
        fontSize: fontSize + 2 + accessibility.fontSize,
      }}
    >
      {contents && contents.length ? (
        contents.map((item, i) => {
          const isPdf = item ? item.substring(0, 5) === '<pdf>' : ''
          if (isPdf) {
            const tagPdf = /<pdf>(.*?)<\/pdf>/g.exec(item)
            if (tagPdf.length) {
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
          return <div key={i} className="text" dangerouslySetInnerHTML={{ __html: item }} />
        })
      ) : (
        <div className="description" dangerouslySetInnerHTML={{ __html: text }} />
      )}
    </BoxStyled>
  )
}

Article.defaultProps = {
  paddingY: 0,
  className: '',
}

export default memo(Article)
