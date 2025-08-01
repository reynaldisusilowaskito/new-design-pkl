import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { heightHeader } from 'styles/theme'
import CarouselMain from 'components/carousel.main'
import Layout from 'components/layout'
import Search from 'components/search'
import { fontSize } from 'styles/theme'
import Element1 from 'public/images/icon/element_1.svg'
import Element2 from 'public/images/icon/element_2.svg'
import Element3 from 'public/images/icon/element_3.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import schema from 'types/schemas'

export interface SliderType {
  content?: string
  content_type?: string
  created_at?: string
  feature_image: string
  id: number
  id_lama?: number
  locale?: string
  name?: string
  parent_id?: number
  post_type?: string
  status?: string
  title?: string
  updated_at?: string
  user_id?: number
  viewed_count?: number
}

interface Props {}

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: `calc(100vh - ${heightHeader}px)`,
  backgroundColor:
    theme.palette.mode == 'dark' ? theme.palette.background.paper : theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '& .wrapper-svg1, & .wrapper-svg1 div, & .wrapper-svg3, & .wrapper-svg3 div': {
    position: 'absolute',
    height: '92%',
    width: '100%',
    zIndex: 0,
    '& svg': {
      height: '100%',
    },
  },
  '& .wrapper-svg1, & .wrapper-svg1 div': {
    left: 0,
    bottom: 10,
    '& svg': {
      transform: 'translateX(-50%)',
      '& circle': {
        fill: `${theme.palette.primary.main} !important`,
      },
    },
  },
  '& .wrapper-svg3, & .wrapper-svg3 div': {
    left: 0,
    top: 0,
    textAlign: 'right',
    '& svg': {
      transform: 'translate(20%, -68%)',
      '& circle': {
        stroke: `${theme.palette.primary.main} !important`,
      },
    },
    [theme.breakpoints.down('xl')]: {
      height: '75%',
    },
  },
  '& .typo1': {
    fontSize: fontSize + 70,
    textTransform: 'uppercase',
    fontWeight: 900,
    textAlign: 'right',
    lineHeight: 1,
    color:
      theme.palette.mode == 'dark' ? theme.palette.background.paper : theme.palette.primary.main,
    WebkitTextStroke: `2px ${theme.palette.primary.main}`,
    WebkitTextFillColor:
      theme.palette.mode == 'dark' ? theme.palette.background.paper : theme.palette.grey[200],
    '&.negative': {
      WebkitTextStroke: `2px ${theme.palette.common.white}`,
    },
  },
  '& .wrapper-svg2': {
    textAlign: 'right',
    '& svg': {
      height: 86,
      transform: 'scale(2) translateY(38%) rotate(90deg)',
      transformOrigin: 'right top',
      '& circle': {
        fill: `${theme.palette.primary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: `calc(100vh - ${70}px)`,
    '& .wrapper-svg1, & .wrapper-svg3': {
      display: 'none',
    },
    '& .wrapper-svg2': {
      '& svg': {
        height: 65,
      },
    },
    '& .typo1': {
      fontSize: fontSize + 34,
    },
  },
}))

const HomeSection1: React.FunctionComponent<Props> = () => {
  const { downSm, downXl } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const data = React.useMemo(() => contents?.sliders || [], [contents])

  return (
    <StyledBox>
      <Box className="wrapper-svg1">
        <Element2 />
      </Box>
      <Box className="wrapper-svg3">
        <Element1 />
      </Box>
      <Layout maxWidth={downXl ? 'lg' : 'xl'}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={downSm ? 'center' : 'space-between'}
          flexWrap="wrap"
        >
          {!!data && <CarouselMain data={data} loading={false} />}
          <Box flexGrow="1" paddingLeft={downSm ? 0 : 3} paddingTop={downSm ? 5 : 0}>
            <Typography className={`typo1 ${accessibility.css.negative ? 'negative' : ''}`}>
              {`Surabaya`}
            </Typography>
            <Box className="wrapper-svg2">
              <Element3 />
            </Box>
            <Typography
              textTransform="uppercase"
              textAlign="right"
              fontSize={downSm ? fontSize - 1 : fontSize}
              fontWeight={900}
              letterSpacing={downSm ? 1 : 4}
              lineHeight={1.2}
            >
              {`Transformasi Surabaya Menuju Kota Dunia`}
              <br />
              {`Yang Maju, Humanis dan Berkelanjutan`}
            </Typography>
            <Box display="flex" justifyContent={downSm ? 'center' : 'flex-end'} marginTop={3}>
              <Search />
            </Box>
          </Box>
        </Box>
      </Layout>
    </StyledBox>
  )
}

HomeSection1.defaultProps = {}

export default memo(HomeSection1)
