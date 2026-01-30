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
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <img 
        src={`/images/logo/logo-navbar.svg`} 
        height={36} 
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
        }}
      />
    </Box>
  )
})

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(22, 22, 22, 0.55)',
  backdropFilter: 'blur(10px)',
  borderRadius: '999px',
  margin: theme.spacing(4, 'auto'), // Auto margin untuk center horizontal
  width: '90%', // Lebar 80%
  left: '50%', // Posisi dari kiri 50%
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  top: theme.spacing(3), // Ubah nilai ini untuk menurunkan navbar
}))

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '& a': {
    margin: theme.spacing(0, 1.5),
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    '&:hover': {
      color: 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-1px)',
    },
    '&.active': {
      color: 'rgba(255, 255, 255, 1)',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '1px',
      },
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
    // backgroundColor: theme.palette.background.paper,
    '& a': {
      color: theme.palette.text.primary,
      '&.active': {
        color: theme.palette.text.primary,
        '&::after': {
          // backgroundColor: theme.palette.secondary.main,
        },
      },
    },
  },
}))

const Header: React.FunctionComponent<Props> = (props: Props) => {
  const { opacity } = props
  const { downSm, downMd } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const menu=[
    {
        "title": "Mengenal Surabaya",
        "url": "#",
        "level": 0,
        "child": [
            { "title": "Tentang Surabaya", "url": "/page/0/1/sekilas-tentang-surabaya", "child": [] },
            {
                "title": "Pemerintahan",
                "url": "#",
                "child": [
                    { "title": "Visi & Misi", "url": "/page/0/11/visi-misi-kota-surabaya", "child": [] },
                    { "title": "Struktur Organisasi", "url": "#", "child": [] },
                    { "title": "Perangkat Daerah", "url": "#", "child": [] },
                    { "title": "Profil Walikota", "url": "#", "child": [] },
                    { "title": "Alamat Pemkot", "url": "#", "child": [] }
                ]
            },
            {
                "title": "Ada Apa di Surabaya ?",
                "url": "#",
                "child": [
                    { "title": "Transportasi", "url": "#", "child": [] },
                    { "title": "Bisnis & Investasi", "url": "#", "child": [] },
                    { "title": "Akomodasi", "url": "#", "child": [] },
                    { "title": "Wisata", "url": "#", "child": [] }
                ]
            },
            {
                "title": "Organisasi",
                "url": "#",
                "child": [
                    { "title": "Dharma Wanita", "url": "/news", "child": [] },
                    { "title": "PMI Kota Surabaya", "url": "/pmi", "child": [] },
                    { "title": "PKK Surabaya", "url": "/pkk", "child": [] }
                ]
            }
        ]
    },
    {
        "title": "Layanan Publik",
        "url": "#",
        "child": [
            { "title": "Pengaduan Masyarakat", "url": "#", "child": [{ "title": "Media Center", "url": "#", "child": [] }] },
            { "title": "Perizinan", "url": "#", "child": [{ "title": "SSW Alfa", "url": "#", "child": [] }] },
            { "title": "Kesehatan", "url": "#", "child": [
                { "title": "E-Health", "url": "#", "child": [] },
                { "title": "Lawan Covid", "url": "#", "child": [] },
                { "title": "Sertifikat Vaksin", "url": "#", "child": [] }
            ]},
            { "title": "Pendidikan", "url": "#", "child": [
                { "title": "Profil Sekolah", "url": "#", "child": [] },
                { "title": "Rapor Online", "url": "#", "child": [] },
                { "title": "Aplikasi Guru", "url": "#", "child": [] }
            ]},
            { "title": "Sosial Masyarakat", "url": "#", "child": [{ "title": "E-Pemutakhiran Data", "url": "#", "child": [] }] },
            { "title": "Kependudukan", "url": "#", "child": [{ "title": "KLAMPID", "url": "#", "child": [] }] },
            { "title": "Ekonomi", "url": "#", "child": [{ "title": "E-Peken", "url": "#", "child": [] }] },
            { "title": "WhistleBlowing", "url": "#", "child": [] }
        ]
    },
    {
        "title": "Informasi Publik",
        "url": "#",
        "child": [
            { "title": "JDIH", "url": "#", "child": [] },
            { "title": "PPID", "url": "#", "child": [] },
            { "title": "Open Data", "url": "#", "child": [] },
            { "title": "Satu Peta", "url": "#", "child": [] },
            { "title": "Foto", "url": "/photos", "child": [] },
            { "title": "Video", "url": "/videos", "child": [] },
            { "title": "Infografis", "url": "/infografis", "child": [] },
            { "title": "Podcast", "url": "/podcasts", "child": [] },
            { "title": "Berita Terbaru", "url": "/news", "child": [] },
            { "title": "Siaran Pers", "url": "/pers", "child": [] },

        ]
    },{
        "title": "Transparansi",
        "url": "#",
        "child": [  
            { "title": "Transparansi Tahun 2026", "url": "/page/0/9/kontak-kami", "child": [] },
            { "title": "Transparansi Tahun 2025", "url": "/page/0/10/tata-cara-penggunaan-website", "child": [] },
            { "title": "Transparansi Tahun 2024", "url": "/page/0/7/kebijakan-privasi", "child": [] },
            { "title": "Transparansi Tahun 2023", "url": "/page/0/7/kebijakan-privasi", "child": [] },
            { "title": "Transparansi Tahun 2022", "url": "/page/0/7/kebijakan-privasi", "child": [] },
            { "title": "Transparansi Tahun 2021", "url": "/page/0/7/kebijakan-privasi", "child": [] }
        ]
    },{
        "title": "PPID",
        "url": "#",
        "child": [{ "title": "PPID Pemerintah Kota Surabaya", "child": [] }
      ]   

    },{
        "title": "Sosial Media",
        "url": "/page/0/9/kontak-kami",
        "level": 0,
        "child": [  { "title": "Facebook", "url": "/page/0/9/kontak-kami", "child": [] },
            { "title": "Instagram", "url": "/page/0/10/tata-cara-penggunaan-website", "child": [] },
            { "title": "X", "url": "/page/0/7/kebijakan-privasi", "child": [] },
            { "title": "Youtube", "url": "/page/0/7/kebijakan-privasi", "child": [] },
            { "title": "Tiktok", "url": "/page/0/7/kebijakan-privasi", "child": [] },
            ]

    }
];
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
  // Dynamic font size for menu links, default 13px
  const menuFontSize = `${13 + accessibility.fontSize}px`;
  return (
    <>
      <HideOnScroll {...props}>
        <AppBarStyled
          elevation={0}
          sx={{
            filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={downMd ? 2 : 3}
            paddingRight={downMd ? 2 : 3}
            sx={{
              opacity,
              width: '100%',
              minHeight: 60,
              background: 'transparent',
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
                  minHeight: 60,
                  '& a': {
                    fontSize: menuFontSize,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    margin: '0 8px',
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
