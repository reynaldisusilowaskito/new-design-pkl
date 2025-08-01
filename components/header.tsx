import React, { memo } from 'react'
import { Box, AppBar, useScrollTrigger, Slide, Typography, Toolbar } from '@mui/material'
import Link from 'next/link'
import { orderBy } from 'lodash'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { heightHeader } from 'styles/theme'
import { fontSize } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import ButtonMode from 'components/button.mode'
import { AccessibilityContext } from 'contexts/accessibility'
import HeaderDialog from 'components/header.dialog'
import BottomNav from 'components/bottomNav'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

export interface Menu {
  id?: number
  title: string
  url: string
  level?: number
  icon?: string
  child: Menu[]
}

interface Props {
  window?: () => Window
  opacity: number
  children?: React.ReactElement
}

function HideOnScroll(props: Props) {
  const { children, window } = props
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export const Logo = React.memo(() => {
  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => router.push('/')}
      sx={{
        cursor: 'pointer',
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
      }}
    >
      <img src={`/images/logo/logo-surabaya.png`} height={40} />
      {!downSm && (
        <Typography
          marginLeft={1.5}
          fontWeight={600}
          fontSize={fontSize - 3 + accessibility.fontSize}
          textTransform="uppercase"
          sx={{
            color: 'text.primary',
            whiteSpace: 'nowrap',
          }}
        >
          {`Pemerintah Kota Surabaya`}
        </Typography>
      )}
    </Box>
  )
})

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey.A100,
  background:
    theme.palette.mode == 'dark'
      ? theme.palette.background.paper
      : `linear-gradient(0deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey.A100} 65%)`,
  minHeight: heightHeader,
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    minHeight: 70,
  },
}))

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '& a': {
    margin: theme.spacing(0, 1.5),
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '&.active': {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.down(theme.breakpoints.values.sm + 424)]: {
      // 1024
      margin: theme.spacing(0, 1),
      padding: theme.spacing(0.5, 1),
    },
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 0.5),
      padding: theme.spacing(0.5),
    },
  },
  '&.negative': {
    '& a.active': {
      color: theme.palette.common.white,
    },
  },
}))

const Header: React.FunctionComponent<Props> = (props: Props) => {
  const { opacity } = props
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const { downSm, downMd } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const menu = React.useMemo(() => contents?.menu || [], [contents])
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(null)
  const [menuSelected, setMenuSelected] = React.useState([])
  const handleClickMenu = React.useCallback(
    (e: any, i: number) => {
      e.preventDefault()
      setOpen(true)
      setSelected(i)
      setMenuSelected(orderBy(menu[i]['child'], ['order', 'asc']))
    },
    [menu, selected]
  )
  const handleClose = React.useCallback(() => {
    setOpen(false)
    setSelected(null)
  }, [])
  return (
    <>
      <HideOnScroll {...props}>
        <AppBarStyled
          elevation={0}
          sx={{
            filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={downMd ? 2 : 8}
            paddingRight={4}
            sx={{
              opacity,
            }}
          >
            <Box>
              <Logo />
            </Box>
            {!downSm ? (
              <StyledToolbar
                className={accessibility.css.negative ? 'negative' : ''}
                sx={{
                  '& a': {
                    fontSize: fontSize - 2 + accessibility.fontSize,
                  },
                }}
              >
                {menu.map((v: any, i: number) => (
                  <Link
                    key={i}
                    href={v.url}
                    onClick={(e) => handleClickMenu(e, i)}
                    className={selected == i ? 'active' : ''}
                    >
                      <span onMouseEnter={(e) => textToSpeech(e, true)}>{v.title}</span>
                      <ExpandMoreIcon fontSize="medium" />
                  </Link>
                ))}
                <ButtonMode />
              </StyledToolbar>
            ) : (
              <ButtonMode />
            )}
          </Box>
        </AppBarStyled>
      </HideOnScroll>
      {menu.length > 0 && <HeaderDialog menu={menuSelected} open={open} onClose={handleClose} />}
      {downSm && <BottomNav selected={selected} onClick={handleClickMenu} onClose={handleClose} />}
    </>
  )
}

Header.defaultProps = {}

export default memo(Header)
