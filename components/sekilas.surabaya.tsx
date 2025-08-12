import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Layout from 'components/layout'
import { BreakpointsContext } from 'contexts/breakpoints'
import useTextToSpeech from 'hooks/useTextToSpeech'

interface Props {
  detail: any
}

const MainContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#ffffffff',
  backgroundImage: 'url("/images/sekilas/bg%20batik.png")',
  backgroundRepeat: 'no-repeat', // Tidak berulang
  backgroundSize: 'cover', // Menutupi seluruh area
  backgroundPosition: 'center center', // Posisi tengah
  backgroundAttachment: 'fixed', // Background tetap saat scroll
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Overlay putih dengan opacity 70%
    zIndex: 0,
    pointerEvents: 'none',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  minHeight: '300px',
  marginTop: theme.spacing(8),
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(6),
    minHeight: '250px',
    padding: theme.spacing(0, 1),
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    minHeight: '200px',
    padding: theme.spacing(0, 1),
  },
}))

const HeaderCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '900px',
  height: '240px',
  margin: '0 auto',
  overflow: 'hidden', // Sembunyikan ornament yang keluar
  [theme.breakpoints.down('md')]: {
    height: '200px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '160px',
  },
}))

const GreenCard = styled(Box)(({ theme }) => ({
  background: '#136966',
  borderRadius: '24px',
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4, 6),
  width: '100%',
  height: '100%',
  zIndex: 5,
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 3),
    borderRadius: '16px',
  },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
}))

const StyledImage = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '350px',
  height: '200px',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('lg')]: {
    maxWidth: '400px',
    height: '225px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    height: '180px',
  },
}))

const ContentText = styled(Box)(({ theme }) => ({
  maxWidth: '76%',
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(0, 1),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 1),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 0.5),
  },
  '& p': {
    color: '#222',
    fontFamily: "'Roboto', Arial, sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: theme.spacing(3),
    wordWrap: 'break-word',
    textAlign: 'justify',  // Menambahkan justify text
  },
  '& a': {
    color: '#006462',
    textDecoration: 'underline',
    wordWrap: 'break-word',
    '&:hover': {
      color: '#2c6f9e',
    },
  },
  '& ul': {
    listStyle: 'disc',
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(6),
    '& li': {
      color: '#006462',
      marginBottom: theme.spacing(1),
      wordWrap: 'break-word',
    },
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    fontFamily: "'Roboto', Arial, sans-serif",
    fontWeight: 600,
    color: '#222',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    wordWrap: 'break-word',
  },
  '& h3': {
    fontSize: '20px',
    lineHeight: '24px',
  },
  '& strong, & b': {
    fontWeight: 700,
  },
}))

const SekilasSurabaya: React.FunctionComponent<Props> = ({ detail }: Props) => {
  const { downSm } = React.useContext(BreakpointsContext)
  const { textToSpeech } = useTextToSpeech()

  return (
    <MainContainer>
      {/* Header Section with Green Card */}
      <HeaderSection>
        <HeaderCard>
          {/* Ornament Top Left */}
          <Box
            sx={{
              position: 'absolute',
              top: '-30px',
              left: '-10px',
              width: '100px',
              height: '120px',
              zIndex: 10,
              display: downSm ? 'none' : 'block',
            }}
          >
            <img
              src="/images/sekilas/ornamen 2.svg"
              alt="Ornament"
              style={{
                width: '150%',
                height: '140%',
                objectFit: 'contain',
              }}
            />
          </Box>
          
          {/* Ornament Bottom Right */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '-100px',
              right: '35px',
              width: '200px',
              height: '430px',
              zIndex: 10,
              display: downSm ? 'none' : 'block',
            }}
          >
            <img
              src="/images/sekilas/ornamen.svg"
              alt="Ornament"
              style={{
                width: '120%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          <GreenCard>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: downSm ? '20px' : '30px',
                lineHeight: '1.2',
                fontFamily: "'Oswald', 'Bebas Neue', 'Arial Black', sans-serif",
                marginLeft: downSm ? 0 : '60px',
                marginBottom: 1,
                position: 'relative',
                zIndex: 10,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => textToSpeech(e, true)}
            >
              SEKILAS TENTANG SURABAYA
            </Typography>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontFamily: "'Lato', Arial, sans-serif",
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                marginLeft: downSm ? 0 : '60px',
                position: 'relative',
                zIndex: 10,
                textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => textToSpeech(e, true)}
            >
              dengan narasumber yang terpercaya.
            </Typography>
          </GreenCard>
        </HeaderCard>
      </HeaderSection>
      
      <Layout paddingY={0} maxWidth="lg">
        <Box sx={{ marginTop: 0, paddingBottom: 8 }}>
          {/* ImageContainer dipindahkan ke sini, sebelum ContentText */}
          <ImageContainer>
            <StyledImage>
              <img
                src="/images/sekilas/balai-kota.png"
                alt="Balai Kota Surabaya"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        width: 100%; 
                        height: 100%; 
                        background-color: #f5f5f5; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: #999;
                        font-family: 'Roboto', Arial, sans-serif;
                      ">
                        Balai Kota Surabaya
                      </div>
                    `;
                  }
                }}
              />
            </StyledImage>
            <StyledImage>
              <img
                src="/images/sekilas/alun-alun-sby.png"
                alt="Alun-Alun Surabaya"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        width: 100%; 
                        height: 100%; 
                        background-color: #f5f5f5; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: #999;
                        font-family: 'Roboto', Arial, sans-serif;
                      ">
                        Alun-Alun Surabaya
                      </div>
                    `;
                  }
                }}
              />
            </StyledImage>
          </ImageContainer>

          <ContentText>
            {/* Dynamic content from CMS */}
            {detail.content ? (
              <Box dangerouslySetInnerHTML={{ __html: detail.content }} />
            ) : (
              <>
                <Typography component="p" onMouseEnter={(e) => textToSpeech(e, true)}>
                  Kota Surabaya terletak antara 07° 9′ S d 07° 21′ Lintang Selatan dan 112° 36′ s.d 112° 54′ Bujur Timur. 
                  Wilayahnya merupakan daratan rendah dengan ketinggian 3-6 meter diatas permukaan air laut, kecuali di sebelah 
                  selatan ketinggiannya 25-50 meter diatas permukaan air laut. Kota Surabaya terbagi menjadi 31 kecamatan dan 154 
                  Kelurahan. Kecamatan yang wilayahnya paling luas adalah Kecamatan Benowo, yaitu sekitar 23.73 km². Sedangkan yang 
                  paling kecil adalah kecamatan Simokerto dengan luas wilayah 2.59 km².
                </Typography>

                <Typography component="p" onMouseEnter={(e) => textToSpeech(e, true)}>
                  Wilayah Kota Surabaya bagian utara, bagian timur berbatasan dengan Selat Madura, bagian selatan berbatasan dengan 
                  Kabupaten Sidoarjo, dan bagian barat berbatasan dengan Kabupaten Gresik. Berdasarkan data yang diperoleh dari Stasiun 
                  Meteorologi Juanda, suhu rata-rata berkisar antara 26,07°C hingga 29,03°C. Curah hujan cukup tinggi sepanjang tahun, 
                  tertinggi terjadi pada bulan Januari 2021 dengan curah hujan sebesar 551,8 mm.
                </Typography>

                <Typography component="p" onMouseEnter={(e) => textToSpeech(e, true)}>
                  <strong>Sumber :</strong> Publikasi BPS : Kota Surabaya Dalam Angka 2023.
                </Typography>

                <Typography component="p" onMouseEnter={(e) => textToSpeech(e, true)}>
                  Cerita Sejarah Kota Surabaya kental dengan nilai kepahlawanan. Sejak awal berdirinya, kota ini memiliki sejarah panjang 
                  yang terkait dengan nilai-nilai heroisme. Istilah Surabaya terdiri dari kata sura (berani) dan baya (bahaya), yang kemudian 
                  secara harfiah diartikan sebagai berani menghadapi bahaya yang datang.
                </Typography>

                <Typography component="p" onMouseEnter={(e) => textToSpeech(e, true)}>
                  Sejarah Surabaya juga berkaitan dengan aktivitas perdagangan. Secara geografis Surabaya memang diciptakan sebagai kota 
                  dagang dan pelabuhan. Surabaya merupakan pelabuhan gerbang utama Kerajaan Majapahit. Letaknya yang dipesisir utara Pulau 
                  Jawa membuatnya berkembang menjadi sebuah pelabuhan penting di zaman Majapahit pada masa abad ke-14.
                </Typography>

                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "'Roboto', Arial, sans-serif",
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '24px',
                    color: '#222',
                    marginBottom: 1,
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => textToSpeech(e, true)}
                >
                  Tugas dan Fungsi Kota Surabaya
                </Typography>

                <Box component="ul">
                  <Box component="li">
                    <Typography
                      component="a"
                      href="https://jdih.surabaya.go.id/produk-hukum/peraturan-daerah/2021/3"
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={(e) => textToSpeech(e, true)}
                    >
                      Peraturan Daerah Nomor 3 Tahun 2021 tentang Perubahan atas Peraturan Daerah Kota Surabaya Nomor 14 Tahun 2016 
                      tentang Pembentukan dan Susunan Perangkat Daerah Kota Surabaya
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      component="a"
                      href="https://jdih.surabaya.go.id/produk-hukum/peraturan-daerah/2016/14"
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={(e) => textToSpeech(e, true)}
                    >
                      Peraturan Daerah Kota Surabaya Nomor 14 Tahun 2016 tentang Pembentukan dan Susunan Perangkat Daerah Kota Surabaya
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </ContentText>
        </Box>
      </Layout>
    </MainContainer>
  )
}

SekilasSurabaya.defaultProps = {}

export default memo(SekilasSurabaya)
