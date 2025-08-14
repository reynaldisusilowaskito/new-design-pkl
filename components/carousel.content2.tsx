import React, { memo } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Slider from 'react-slick'
import { fontSize } from 'styles/theme'
import { StyledBox } from 'styles/carousel'
import { BreakpointsContext } from 'contexts/breakpoints'
import CarouselNewsItem from 'components/carousel.news.item'
import { Arrow } from 'components/carousel.small'
import { fontSizeBigger } from 'components/news.list'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
  slidesToShow?: number
  route?: string
}

const BoxStyled = styled(Box)(({ theme }) => ({
  '& .main': {
    borderRadius: theme.spacing(2.5),
    overflow: 'hidden',
    position: 'relative',
    '& .slick-arrow': {
      top: '50%',
      zIndex: 10,
      '&.next': {
        right: 10,
        transform: 'translate(0, -50%)',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
      '&.prev': {
        left: 10,
        transform: 'translate(0, -50%) rotate(180deg)',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    },
    '& .slick-slider': {
      '& .slick-list': {
        '& .slick-track': {
          '& .slick-slide': {
            '& > div': {
              position: 'relative',
              borderRadius: theme.spacing(2.5),
              overflow: 'hidden',
              minHeight: 340,
              background: '#222',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              '& .news-image': {
                width: '100%',
                height: 340,
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              },
              '& .logo-overlay': {
                position: 'absolute',
                top: 24,
                left: 24,
                zIndex: 4,
                '& img': {
                  width: 100,
                  height: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                },
              },

              '& .content-overlay': {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 3,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: theme.spacing(6, 4, 4, 4),
                color: theme.palette.common.white,
                '& .title': {
                  fontSize: fontSizeBigger,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: theme.spacing(2),
                },
                '& .description': {
                  fontSize: fontSize + 2,
                  lineHeight: 1.4,
                  marginBottom: theme.spacing(3),
                  opacity: 0.9,
                },
                '& .date-chip': {
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: theme.spacing(2),
                  padding: theme.spacing(1, 2),
                  fontSize: fontSize - 2,
                  fontWeight: 500,
                },
              },
            },
          },
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .main': {
      '& .slick-slider': {
        '& .slick-list': {
          '& .slick-track': {
            '& .slick-slide': {
              '& > div': {
                minHeight: 280,
                '& .news-image': {
                  height: 280,
                },
                '& .content-overlay': {
                  padding: theme.spacing(4, 3, 3, 3),
                  '& .title': {
                    fontSize: fontSizeBigger - 6,
                  },
                  '& .description': {
                    fontSize: fontSize,
                  },
                  '& .date-chip': {
                    fontSize: fontSize - 3,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}))

const CarouselContent2: React.FunctionComponent<Props> = ({ data, slidesToShow, route }: Props) => {
  const slider = React.useRef<Slider>(null)
  const { downSm, downLg } = React.useContext(BreakpointsContext)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    draggable: downSm ? true : false,
  }
  const handleNextPrev = React.useCallback((isNext: boolean) => {
    if (isNext) {
      slider.current.slickNext()
    } else {
      slider.current.slickPrev()
    }
  }, [])
  return (
    <BoxStyled>
      <StyledBox className="main">
        {!downSm && (
          <Arrow
            size={(fontSize + (downLg ? 18 : 25)).toString()}
            className="slick-arrow prev"
            onClick={() => handleNextPrev(false)}
          />
        )}
        <Slider ref={slider} {...settings}>
          {data.map((v, i) => (
            <CarouselNewsItem
              key={i}
              data={v}
              gridSpacing={0}
              truncateTitle={downSm ? 30 : 50}
              gridImage={12}
              gridContent={12}
              withDescription={false}
              route={route}
            />
          ))}
        </Slider>
        {!downSm && (
          <Arrow
            size={(fontSize + (downLg ? 18 : 25)).toString()}
            className="slick-arrow next"
            onClick={() => handleNextPrev(true)}
          />
        )}
      </StyledBox>
    </BoxStyled>
  )
}

CarouselContent2.defaultProps = {
  slidesToShow: 1,
  route: 'agenda',
}

export default memo(CarouselContent2)
