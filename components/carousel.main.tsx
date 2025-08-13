import React, { memo } from 'react'
import { Box, Skeleton } from '@mui/material'
import Slider from 'react-slick'
import { styled } from '@mui/material/styles'
import CarouselItem from 'components/carousel.item'
import { SliderType } from 'components/home.hero.section'
import CarouselCircle from 'components/carousel.circle'
import _ from 'lodash'

interface Props {
  data: SliderType[]
  loading: boolean
}

export const mainCircle = 360
export const mainCircleXl = 500
export const mainCircleSm = 280
export const mainCircle500 = 220
const StyledBox = styled(Box)(({ theme }) => ({
  height: mainCircle,
  width: mainCircle,
  margin: mainCircle / 4,
  position: 'relative',
  '& .container-carousel': {
    height: mainCircle,
    width: mainCircle,
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[200],
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    '& .slick-slider': {
      position: 'relative',
      '& .slick-list': {
        overflow: 'hidden',
        '& .slick-track': {
          display: 'flex',
          overflow: 'hidden',
          '& .items': {
            position: 'relative',
            height: mainCircle,
            width: mainCircle,
            borderRadius: '50%',
            overflow: 'hidden',
            '& img': {
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            },
          },
        },
      },
    },
  },
  [theme.breakpoints.up('xl')]: {
    height: mainCircleXl,
    width: mainCircleXl,
    margin: mainCircleXl / 4,
    '& .container-carousel': {
      height: mainCircleXl,
      width: mainCircleXl,
      '& .slick-slider': {
        '& .slick-list': {
          '& .slick-track': {
            '& .items': {
              height: mainCircleXl,
              width: mainCircleXl,
            },
          },
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    height: mainCircleSm,
    width: mainCircleSm,
    margin: theme.spacing(4, 0, 5),
    '& .container-carousel': {
      height: mainCircleSm,
      width: mainCircleSm,
      '& .slick-slider': {
        '& .slick-list': {
          '& .slick-track': {
            '& .items': {
              height: mainCircleSm,
              width: mainCircleSm,
            },
          },
        },
      },
    },
  },
  [theme.breakpoints.down(theme.breakpoints.values.sm - 100)]: {
    // 500
    height: mainCircle500,
    width: mainCircle500,
    '& .container-carousel': {
      height: mainCircle500,
      width: mainCircle500,
      '& .slick-slider': {
        '& .slick-list': {
          '& .slick-track': {
            '& .items': {
              height: mainCircle500,
              width: mainCircle500,
            },
          },
        },
      },
    },
  },
}))

const CarouselMain: React.FunctionComponent<Props> = ({ data, loading }: Props) => {
  const slider = React.useRef<Slider>(null)
  const [activeSlide, setActiveSlide] = React.useState<number>(0)
  const [control, setControl] = React.useState<string>('right')
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    beforeChange: (_current: number, next: number) => {
      setActiveSlide(next)
    },
    onSwipe: (e: string) => {
      setControl(e)
    },
  }
  const dataCircle = React.useMemo(() => {
    const clone = _.cloneDeep(data)
    const newData = _.remove(clone, function (_n, i) {
      return activeSlide != i
    })
    return newData
  }, [activeSlide, loading])
  const handleGoToSlide = React.useCallback(
    (id: number) => {
      const index = _.findIndex(data, { id })
      slider.current.slickGoTo(index)
    },
    [data]
  )
  return (
    <StyledBox>
      <CarouselCircle
        data={dataCircle}
        control={control}
        current={activeSlide}
        loading={loading}
        goToSlide={handleGoToSlide}
      />
      <Box
        className="container-carousel"
        sx={{
          boxShadow: 7,
        }}
      >
        {loading ? (
          <Box width="100%" height="100%">
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        ) : (
          <Slider ref={slider} {...settings}>
            {data.map((v, i) => (
              <CarouselItem key={i} src={`${'https://surabaya.go.id/uploads/'}${v.feature_image}`} />
            ))}
          </Slider>
        )}
      </Box>
    </StyledBox>
  )
}

CarouselMain.defaultProps = {}

export default memo(CarouselMain)
