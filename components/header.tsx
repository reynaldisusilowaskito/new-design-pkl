import React, { memo } from 'react'
import { Box, AppBar, useScrollTrigger, Slide, Toolbar } from '@mui/material'
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
      <img src={`/images/logo/logo-navbar.svg`} height={40} />
    </Box>
  )
})

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30,40,40,0.35)'
    : 'rgba(30, 60, 60, 0.35)',
  minHeight: 48,
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '999px',
  border: '1px solid #fff',
  margin: '0 auto',
  width: '90%',
  left: 0,
  right: 0,
  position: 'fixed',
  top: 30,
  zIndex: 1100,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.down('sm')]: {
    minHeight: 40,
    width: 'calc(100% - 8px)',
    margin: '6px auto 0 auto',
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
            paddingLeft={downMd ? 2 : 6}
            paddingRight={2}
            sx={{
              opacity,
              borderRadius: '999px',
              width: '100%',
              minHeight: 40,
              background: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 160 }}>
              <Logo />
            </Box>
            {!downSm ? (
              <StyledToolbar
                className={accessibility.css.negative ? 'negative' : ''}
                sx={{
                  flex: 1,
                  justifyContent: 'center',
                  minHeight: 40,
                  '& a': {
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    margin: '0 14px',
                  },
                }}
              >
                {menu.map((v: any, i: number) => (
                  <Link
                    key={i}
                    href={v.url}
                    onClick={(e) => handleClickMenu(e, i)}
                    className={selected == i ? 'active' : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span onMouseEnter={(e) => textToSpeech(e, true)}>{v.title}</span>
                    <ExpandMoreIcon fontSize="medium" />
                  </Link>
                ))}
                <Box sx={{ marginLeft: 2 }}>
                  <ButtonMode />
                </Box>
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
