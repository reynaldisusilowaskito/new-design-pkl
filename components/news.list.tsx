import React, { memo } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { fontSize, borderRadius } from 'styles/theme'
import NewsItem from 'components/news.item'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
  route?: string
}

export const fontSizeTitle = fontSize + 8 // fontsize for list news
export const fontSizeBigger = fontSize + 14 // fontsize for slider title

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .news-item': {
    '& a': {
      display: 'block',
      padding: theme.spacing(5),
      borderRadius: theme.spacing(borderRadius),
      overflow: 'hidden',
      transition: `all 0.2s ease-in-out`,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
      '& .inner .MuiBox-root': {
        display: 'flex',
        flexDirection: 'column',
        '& p': {
          '&.title': {
            margin: theme.spacing(0),
          },
          '&.description': {
            order: 2,
          },
          '&.date': {
            order: 1,
            margin: theme.spacing(0, 0, 2),
          },
        },
      },
    },
  },
  '& .wrapper-svg-section1': {
    position: 'absolute',
    bottom: 0,
    right: `100%`,
    transform: 'translateX(30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(100),
      '& circle': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-section3': {
    position: 'absolute',
    top: '20%',
    left: `calc(100% + ${theme.spacing(4)})`,
    '& svg': {
      width: 50,
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .news-item': {
      '& a': {
        padding: theme.spacing(3),
      },
    },
    '& .wrapper-svg-section1, & .wrapper-svg-section3': {
      display: 'none',
    },
  },
}))

const NewsList: React.FunctionComponent<Props> = ({ data, route }: Props) => {
  const { downSm } = React.useContext(BreakpointsContext)
  return (
    <BoxStyled>
      <Box className="wrapper-svg-section1">
        <Element1 />
      </Box>
      <Box className="wrapper-svg-section3">
        <Element3 />
      </Box>
      <Box className="news-item-container">
        {data.map((v, i) => (
          <Box marginTop={downSm ? 2 : 5} key={i} className="news-item">
            <NewsItem
              key={i}
              data={v}
              gridImage={4}
              gridContent={8}
              gridSpacing={4}
              fontSizeTitle={downSm ? fontSizeTitle - 5 : fontSizeTitle}
              truncateTitle={80}
              truncateDescription={350}
              withDescription={true}
              route={route}
            />
          </Box>
        ))}
      </Box>
    </BoxStyled>
  )
}

NewsList.defaultProps = {
  route: 'berita',
}

export default memo(NewsList)
  