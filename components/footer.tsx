import React, { memo } from 'react'
import { Box, Grid, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { fontSize } from 'styles/theme'
import { Logo } from 'components/header'
import Search from 'components/search'
import LogoCc from 'public/images/logo_cc.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {
  load: boolean
}

const heightCopy = fontSize + 16
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(7, 0),
  overflow: 'hidden',
  '& .contact': {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    '& .MuiGrid-container': {
      '& .MuiGrid-item': {
        '& svg': {
          '& path': {
            fill: theme.palette.primary.main,
          },
        },
        '&:nth-of-type(2)': {
          '& svg': {
            '& path': {
              '&:nth-of-type(2)': {
                stroke: theme.palette.primary.main,
              },
            },
          },
        },
      },
    },
  },
  '& .social-media': {
    '& a': {
      display: 'block',
      margin: theme.spacing(0, 2.5),
      '&:first-of-type': {
        marginLeft: 0,
      },
      '& svg': {
        '& path': {
          fill: theme.palette.primary.main,
        },
      },
    },
  },
  '& .copy': {
    '& .wrapper-svg': {
      height: heightCopy,
      overflow: 'hidden',
      marginRight: theme.spacing(1),
      '& svg': {
        '& path': {
          fill: theme.palette.text.primary,
        },
      },
    },
  },
  '&.negative': {
    '& .contact': {
      borderBottom: `2px solid ${theme.palette.common.white}`,
      '& .MuiGrid-container': {
        '& .MuiGrid-item': {
          '& svg': {
            '& path': {
              fill: theme.palette.common.white,
            },
          },
          '&:nth-of-type(2)': {
            '& svg': {
              '& path': {
                '&:nth-of-type(2)': {
                  stroke: theme.palette.common.white,
                },
              },
            },
          },
        },
      },
    },
    '& .social-media': {
      '& a': {
        '& svg': {
          '& path': {
            fill: theme.palette.common.white,
          },
        },
      },
    },
  },
}))

const Footer: React.FunctionComponent<Props> = ({ load }: Props) => {
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const footerData = React.useMemo(() => contents?.footer || [], [contents])
  const socialMedia = React.useMemo(() => contents?.social_media || [], [contents])
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  return (
    <StyledContainer
      maxWidth={false}
      className={accessibility.css.negative ? 'negative' : ''}
      sx={{
        display: load ? 'none' : 'block',
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
      }}
    >
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center">
          <Logo />
        </Box>
        <Box className="contact">
          <Grid container spacing={2} paddingY={5} paddingX={3}>
            {footerData.map((value, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Box
                  className="wrapper-svg"
                  sx={{
                    '& svg, & img': {
                      height: fontSize + 30,
                    },
                  }}
                >
                  <img src={`https://surabaya.go.id/uploads/images/surabaya/${value.icon}`} />
                </Box>
                <Typography
                  onMouseEnter={(e) => textToSpeech(e, true)}
                  fontSize={fontSize - 2 + accessibility.fontSize}
                  textAlign="center"
                  marginTop={1}
                  marginBottom={downSm ? 2 : 1}
                  sx={{
                    whiteSpace: 'pre-line',
                    lineHeight: 1.3,
                  }}
                >
                  {value.description}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Grid container spacing={3} marginTop={4} alignItems="center">
          <Grid
            item
            className="social-media"
            xs={12}
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: downSm ? 'center' : 'flex-start',
            }}
          >
            {socialMedia.map((value, i) => (
              <Link key={i} href={value.url} target="_blank">
                <Box
                  className="wrapper-svg"
                  sx={{
                    '& svg, & img': {
                      height: fontSize + 16,
                    },
                  }}
                >
                  <img src={`https://surabaya.go.id/uploads/images/surabaya/${value.icon}`} />
                </Box>
              </Link>
            ))}
          </Grid>
          <Grid
            item
            sm={6}
            sx={{
              display: downSm ? 'none' : 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Search isFooter={true} />
          </Grid>
        </Grid>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          className="copy"
          marginTop={4}
          marginBottom={downSm ? 5 : 0}
        >
          <Box
            className="wrapper-svg"
            sx={{
              '& svg': {
                height: heightCopy,
              },
            }}
          >
            <LogoCc />
          </Box>
          <Typography fontSize={fontSize + 2}>
            {`${new Date().getFullYear()} Pemerintah Kota Surabaya`}
          </Typography>
        </Box>
      </Container>
    </StyledContainer>
  )
}

Footer.defaultProps = {}

export default memo(Footer)
