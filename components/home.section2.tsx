import React, { memo } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { orderBy } from 'lodash'
import CarouselSmall from 'components/carousel.small'
import { Menu as MenuType } from 'components/header'
import { fontSize, borderRadius } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {}

const BoxStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  '& .MuiTypography-root': {
    fontSize: fontSize + 8,
    textTransform: 'uppercase',
    fontWeight: 300,
    color: theme.palette.common.white,
    lineHeight: 1.2,
    '& span': {
      display: 'block',
      fontWeight: 800,
      fontSize: fontSize + 18,
    },
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(borderRadius),
    '& .MuiTypography-root': {
      fontSize: fontSize + 4,
      '& span': {
        fontSize: fontSize + 14,
      },
    },
  },
}))

function findMenu(array: schema['schemas']['Menu'][], title: string) {
  let object = null
  array.some(function f(a: MenuType) {
    const isInclude = a.title.toLowerCase().includes(title.toLowerCase())
    if (isInclude) {
      object = a
      return true
    }
    if (Array.isArray(a.child)) {
      return a.child.some(f)
    }
  })
  return object
}

const HomeSection2: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const menu = React.useMemo(() => contents?.menu || [], [contents])
  const { textToSpeech } = useTextToSpeech()
  const whatsInSurabaya: MenuType[] = React.useMemo(() => {
    const result = findMenu(menu, 'Ada Apa di Surabaya')
    return menu.length > 0 ? (result ? orderBy(result['child'], ['order', 'asc']) : []) : []
  }, [menu])

  if (whatsInSurabaya?.length < 1) return <></>
  return (
    <Grid container spacing={0} alignItems="stretch" overflow={downSm ? 'hidden' : 'visible'}>
      <Grid item xs={12} sm={4}>
        <BoxStyled height={downSm ? 'auto' : '100%'}>
          <Typography onMouseEnter={(e) => textToSpeech(e, true)}>
            Ada apa di <span>Surabaya ?</span>
          </Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} sm={8}>
        <CarouselSmall data={whatsInSurabaya} />
      </Grid>
    </Grid>
  )
}

HomeSection2.defaultProps = {}

export default memo(HomeSection2)
