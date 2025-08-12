import React, { memo } from 'react'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { fontSize } from 'styles/theme'
import { ButtonStyled } from 'components/title'
import Element3 from 'public/images/icon/element_3.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {}

const paddingList = 4
const transition = 0.1
const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  position: 'relative',
  '& .wrapper-svg-section3': {
    position: 'absolute',
    top: theme.spacing(-5),
    left: `calc(100% + ${theme.spacing(2)})`,
    '& svg': {
      width: 50,
      '& circle': {
        fill: theme.palette.common.white,
      },
    },
  },
  '& .MuiList-root': {
    padding: theme.spacing(2, 4),
    maxHeight: 400,
    overflowY: 'auto',
    overflowX: 'hidden',
    '& .MuiListItem-root': {
      position: 'relative',
      '&:before': {
        content: `''`,
        position: 'absolute',
        top: 0,
        left: theme.spacing(paddingList),
        transform: 'translateY(-50%)',
        backgroundColor: theme.palette.common.white,
        height: 2,
        width: `calc(100% - ${theme.spacing(paddingList * 2)})`,
      },
      '&:after': {
        content: `''`,
        position: 'absolute',
        transition: `all ${transition}s ease-in-out`,
        top: 0,
        left: 0,
        backgroundColor: theme.palette.common.white,
        height: `100%`,
        width: `100%`,
        borderRadius: theme.spacing(5),
        overflow: 'hidden',
        opacity: 0,
      },
      '&:hover': {
        '&:after': {
          transform: `scale(1.04, 1.05)`,
          transformOrigin: 'center center',
          opacity: 1,
        },
        '& .MuiListItemButton-root': {
          '& .MuiListItemText-root': {
            '& .MuiTypography-root': {
              transform: `scale(1.04)`,
              transformOrigin: 'center center',
              color:
                theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.text.primary,
            },
          },
          '& .MuiButton-root': {
            transform: `scale(1.2)`,
            transformOrigin: 'center center',
          },
        },
      },
      '& .MuiListItemButton-root': {
        position: 'relative',
        zIndex: 1,
        padding: theme.spacing(2.5, paddingList),
        cursor: 'inherit',
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            textTransform: 'uppercase',
            fontWeight: 700,
            color: theme.palette.common.white,
            transition: `all ${transition}s ease-in-out`,
          },
        },
        '& .MuiButton-root': {
          transition: `all ${transition}s ease-in-out`,
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          },
        },
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  '&.negative': {
    '& .MuiList-root': {
      '& .MuiListItem-root': {
        '& .MuiButton-root': {
          '&:hover': {
            backgroundColor: theme.palette.common.white,
          },
        },
        '&:before': {
          backgroundColor: theme.palette.secondary.main,
        },
        '&:after': {
          backgroundColor: theme.palette.secondary.main,
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-section3': {
      display: 'none',
    },
    '& .MuiList-root': {
      padding: theme.spacing(2, 0),
      '& .MuiListItem-root': {
        '&:before': {
          left: 0,
          width: `100%`,
        },
        '&:after': {
          borderRadius: 0,
        },
        '& .MuiListItemButton-root': {
          padding: theme.spacing(1, 2),
        },
        '&:hover': {
          '&:after': {
            transform: `none`,
          },
          '& .MuiListItemButton-root': {
            '& .MuiListItemText-root': {
              '& .MuiTypography-root': {
                transform: `none`,
              },
            },
            '& .MuiButton-root': {
              transform: `none`,
            },
          },
        },
      },
    },
  },
}))

const HomeSection5: React.FunctionComponent<Props> = () => {
  const { data } = useQuery<schema['schemas']['Service'][]>(['home_services'])
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const loading = false
  return (
    <BoxStyled className={accessibility.css.negative ? 'negative' : ''}>
      <Box className="wrapper-svg-section3">
        <Element3 />
      </Box>
      {!loading && (
        <List>
          {data?.length > 0 &&
            data?.map((v, i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton disableRipple component="div">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <ListItemText
                      primary={`${i + 1}. ${v.title}`}
                      onMouseEnter={(e) => textToSpeech(e, true)}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: {
                            sx: fontSize - 1 + accessibility.fontSize,
                            sm: fontSize + 1 + accessibility.fontSize,
                          },
                        },
                      }}
                    />
                    <Link href={v.url}>
                      <ButtonStyled
                        variant="contained"
                        disableElevation
                        color="secondary"
                        onMouseEnter={(e) => textToSpeech(e, true)}
                        sx={{
                          fontSize: fontSize + (downSm ? 0 : 2) + accessibility.fontSize,
                          lineHeight: downSm ? 1.2 : 1.6,
                          minWidth: downSm ? 100 : 'auto',
                          marginLeft: downSm ? 1 : 0,
                          bgcolor: accessibility.css.negative ? 'common.white' : null,
                        }}
                      >
                        {`Kunjungi ${downSm ? '' : 'Laman'}`}
                      </ButtonStyled>
                    </Link>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      )}
    </BoxStyled>
  )
}

HomeSection5.defaultProps = {}

export default memo(HomeSection5)
