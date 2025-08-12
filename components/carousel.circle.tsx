import React, { memo } from 'react'
import { Box, Skeleton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { mainCircle, mainCircleXl, mainCircleSm, mainCircle500 } from 'components/carousel.main'
import { SliderType } from 'components/home.section1'

interface Props {
  data: SliderType[]
  control: string
  current: number
  loading: boolean
  goToSlide: (id: number) => any
}

const StyledBox = styled(Box)(({ theme }) => ({
  '& .carousel': {
    position: 'relative',
    width: mainCircle,
    height: mainCircle,
    borderRadius: '50%',
    transition: '0.5s',
    transformOrigin: 'center center',
  },
  '& .item-carousel': {
    position: 'absolute',
    borderRadius: '50%',
    width: mainCircle / 2,
    height: mainCircle / 2,
    bottom: 0,
    transition: '0.5s',
    overflow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    },
    '&:nth-of-type(1)': {
      left: '50%',
      top: 0,
    },
    '&:nth-of-type(2)': {
      left: '100%',
      top: '50%',
    },
    '&:nth-of-type(3)': {
      left: '50%',
      top: '100%',
    },
    '&:nth-of-type(4)': {
      left: '0',
      top: '50%',
    },
  },
  [theme.breakpoints.up('xl')]: {
    '& .carousel': {
      width: mainCircleXl,
      height: mainCircleXl,
    },
    '& .item-carousel': {
      width: mainCircleXl / 2,
      height: mainCircleXl / 2,
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .carousel': {
      width: mainCircleSm,
      height: mainCircleSm,
    },
    '& .item-carousel': {
      width: mainCircleSm / 2,
      height: mainCircleSm / 2,
    },
  },
  [theme.breakpoints.down(theme.breakpoints.values.sm - 100)]: {
    // 500
    '& .carousel': {
      width: mainCircle500,
      height: mainCircle500,
    },
    '& .item-carousel': {
      width: mainCircle500 / 2,
      height: mainCircle500 / 2,
    },
  },
}))

const CarouselCircle: React.FunctionComponent<Props> = ({
  data,
  control,
  current,
  loading,
  goToSlide,
}: Props) => {
  const [carouselDeg, setCarouselDeg] = React.useState(0)
  const [itemDeg, setItemDeg] = React.useState(0)
  const next = React.useCallback(() => {
    setCarouselDeg(carouselDeg - 90)
    setItemDeg(itemDeg + 90)
  }, [carouselDeg, itemDeg])
  const prev = React.useCallback(() => {
    setCarouselDeg(carouselDeg + 90)
    setItemDeg(itemDeg - 90)
  }, [carouselDeg, itemDeg])
  React.useEffect(() => {
    if (control == 'right') {
      prev()
    } else {
      next()
    }
  }, [control, current])
  return (
    <StyledBox>
      <Box
        className="carousel"
        sx={{
          transform: `rotate(${carouselDeg}deg)`,
        }}
      >
        {[...new Array(4)].map((_v, i) => (
          <Box
            key={i}
            className={`item-carousel`}
            sx={{
              transform: `translate(-50%, -50%) rotate(${itemDeg}deg)`,
            }}
            onClick={() => (loading ? null : goToSlide(data[i].id))}
          >
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            ) : (
              <img src={`https://surabaya.go.id/uploads/${data[i]?.feature_image}`} />
            )}
          </Box>
        ))}
      </Box>
    </StyledBox>
  )
}

CarouselCircle.defaultProps = {}

export default memo(CarouselCircle)
