import React, { memo } from 'react'
import { Box, Card, Typography, Grid, LinearProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BreakpointsContext } from 'contexts/breakpoints'
import InteractiveMapSurabaya from './map.surabaya.interactive'

interface Props { }

const BoxStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  backgroundImage: 'url(/images/bg-batik.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: '80vh',
  },
}))

const ContainerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  maxWidth: '1200px',
  width: '100%',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}))

const MainCardBox = styled(Box)(({ theme }) => ({
  flex: 3,
  borderRadius: '55px',
  border: '5px solid #D2B690',
  background: 'linear-gradient(135deg, #64969680 0%, #50787880 100%)',
  minHeight: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
}))

const AreaInfoBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  background: theme.palette.mode === 'dark' ? 'rgba(8, 33, 33, 0.92)' : '#ffffff',
  borderRadius: '12px',
  padding: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  maxWidth: '200px',
  zIndex: 10,
}))

const AreaLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : '#666',
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}))

const AreaValue = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#1a7a7a',
}))

const DemographyTitleBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark' ? 'rgba(8, 33, 33, 0.92)' : '#ffffff',
  border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.24)' : '#1a7a7a'}`,
  borderRadius: '30px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
}))

const DemographyTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#1a7a7a',
  textAlign: 'center',
}))

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}))

const StatsWrapperBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? 'rgba(8, 33, 33, 0.92)' : '#ffffff',
  borderRadius: '20px',
  padding: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  flex: 1,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
  },
}))

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.75),
  borderRadius: '16px',
  border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.24)' : '#1a7a7a'}`,
  minWidth: '160px',
  background: theme.palette.mode === 'dark' ? 'rgba(8, 33, 33, 0.92)' : '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    flex: '1 1 calc(50% - 8px)',
    minWidth: 'unset',
  },
}))

const GenderRatioContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
  marginTop: theme.spacing(1.5),
}))

const GenderRatioColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 'fit-content',
}))

const GenderIcon = styled('img')(({ theme }) => ({
  width: '20px',
  height: '20px',
  flexShrink: 0,
}))

const GenderValue = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a1a',
}))

const KategoriLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#4caf50',
  fontWeight: 500,
  marginTop: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  '&::after': {
    content: '""',
    flex: 1,
    borderBottom: '1px dotted #4caf50',
  },
}))

const GenderProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: '3px',
  flex: 1,
  minWidth: '100px',
  height: '28px',
}))

const StatCardIconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '100%',
    height: 'auto',
  },
}))

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#374151',
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}))

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a1a',
  marginBottom: theme.spacing(1),
}))

const StatSubtext = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : '#999',
  fontWeight: 500,
}))

const DescriptionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: theme.palette.mode === 'dark' ? 'rgba(8, 33, 33, 0.92)' : '#ffffff',
  maxWidth: '1200px',
  width: '100%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'center',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}))

const IconsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(1),
}))

const DescriptionIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '60px',
  '& img': {
    width: '100%',
    height: 'auto',
    maxWidth: '50px',
  },
}))

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  lineHeight: 1.6,
  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.86)' : '#333',
  textAlign: 'justify',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,  letterSpacing: '2px',  width: '100%',
}))

const HomeSection3_5: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)

  const statisticsData = [
    {
      title: 'Demografi Kec. Mulyorejo',
      label: 'Kepadatan Penduduk',
      value: '7.388',
      numericValue: 7388,
      subtext: 'Jiwa/km2 (2024)',
      icon: '📊',
      isDensity: true,
    },
    {
      label: 'Rasio Gender',
      value: '0.53:1',
      female: { value: '50.9%', percentage: 50.9 },
      male: { value: '49.05%', percentage: 49.05 },
      icon: '👥',
      isGenderRatio: true,
    },
    {
      label: 'Usia Produktif',
      value: '71,18%',
      subtext: '15-64 Tahun',
      percentage: 71.18,
      icon: '📈',
    },
    {
      label: 'Pertumbuhan Populasi',
      value: '+0.75%',
      subtext: 'Annual Growth',
      icon: '📍',
    },
  ]

  // Function untuk menentukan warna berdasarkan density
  const getDensityColor = (numericValue: number) => {
    if (numericValue < 15000) return '#4caf50' // Hijau - rendah
    if (numericValue <= 20000) return '#ffc107' // Kuning - sedang
    return '#f44336' // Merah - tinggi
  }

  // Function untuk menghitung persentase density
  const getDensityPercentage = (numericValue: number) => {
    const maxDensity = 30000
    return (numericValue / maxDensity) * 100
  }

  return (
    <BoxStyled>
      <ContainerBox>
        <MainCardBox>
          {/* Peta Interaktif Kecamatan - Layout Geografis */}
          <InteractiveMapSurabaya />

          {/* Area Info Box */}
          <AreaInfoBox>
            <AreaLabel>Keseluruhan Wilayah</AreaLabel>
            <AreaLabel>Surabaya</AreaLabel>
            <AreaValue>327 hingga 336 km²</AreaValue>
          </AreaInfoBox>
        </MainCardBox>

        <StatsWrapperBox>
          <StatsContainer>
            <DemographyTitleBox>
              <DemographyTitle>Demografi Kec. Mulyorejo</DemographyTitle>
            </DemographyTitleBox>

            {statisticsData.map((stat, index) => (
              <StatCard key={index}>
                {index === 0 && (
                  <StatCardIconWrapper>
                    <img src="/images/Peta Interaktif/kepadatanpenduduk.svg" alt="Kepadatan Penduduk" />
                  </StatCardIconWrapper>
                )}
                {index === 1 && (
                  <StatCardIconWrapper>
                    <img src="/images/Peta Interaktif/rasio gender.svg" alt="Rasio Gender" />
                  </StatCardIconWrapper>
                )}
                {index === 2 && (
                  <StatCardIconWrapper>
                    <img src="/images/Peta Interaktif/Usia Produktif.svg" alt="Usia Produktif" />
                  </StatCardIconWrapper>
                )}
                
                <StatLabel>{stat.label}</StatLabel>
                
                {/* Layout khusus untuk Rasio Gender */}
                {index === 1 && (stat as any).isGenderRatio ? (
                  <>
                    <GenderRatioContainer>
                      <GenderRatioColumn>
                        <GenderIcon src="/images/Peta Interaktif/female.svg" alt="Female" />
                      </GenderRatioColumn>
                      
                      <GenderProgressContainer>
                        <Box sx={{ flex: (stat as any).female.percentage / 100, position: 'relative' }}>
                          <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                              height: '28px',
                              borderRadius: '3px',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#e91e63',
                                borderRadius: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              color: '#ffffff',
                              fontSize: '11px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {(stat as any).female.percentage}%
                          </Typography>
                        </Box>
                        <Box sx={{ flex: (stat as any).male.percentage / 100, position: 'relative' }}>
                          <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                              height: '28px',
                              borderRadius: '3px',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#2196f3',
                                borderRadius: '3px',
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              color: '#ffffff',
                              fontSize: '11px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {(stat as any).male.percentage}%
                          </Typography>
                        </Box>
                      </GenderProgressContainer>
                      
                      <GenderRatioColumn>
                        <GenderIcon src="/images/Peta Interaktif/Vector.svg" alt="Male" />
                      </GenderRatioColumn>
                    </GenderRatioContainer>
                  </>
                ) : (
                  <>
                    <StatValue>{stat.value}</StatValue>
                    <StatSubtext>{stat.subtext}</StatSubtext>
                  </>
                )}
                
                {/* Progress bar untuk Kepadatan Penduduk */}
                {index === 0 && (stat as any).isDensity && (
                  <Box sx={{ mt: 1.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getDensityPercentage((stat as any).numericValue)}
                      sx={{
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getDensityColor((stat as any).numericValue),
                          borderRadius: '4px',
                        },
                      }}
                    />
                  </Box>
                )}
                
                {/* Progress bar untuk data lain */}
                {(stat.percentage && index > 1) && (
                  <>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={stat.percentage}
                        sx={{
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: index === 2 ? '#4caf50' : '#1976d2',
                            borderRadius: '3px',
                          },
                        }}
                      />
                    </Box>
                    {index === 2 && (
                      <KategoriLabel>
                        Kategori Tinggi
                      </KategoriLabel>
                    )}
                  </>
                )}
              </StatCard>
            ))}
          </StatsContainer>
        </StatsWrapperBox>
      </ContainerBox>

      <DescriptionCard>
        <IconsRow>
          <DescriptionIconWrapper>
            <img src="/images/Peta Interaktif/Group 84.svg" alt="Icon left" />
          </DescriptionIconWrapper>
          
          <DescriptionIconWrapper>
            <img src="/images/Peta Interaktif/Group 115.svg" alt="Icon right" />
          </DescriptionIconWrapper>
        </IconsRow>

        <DescriptionText>
          Peta interaktif ini memvisualisasikan persebaran penduduk di 31 kecamatan di Kota Surabaya.
          Sebagai pusat aglomerasi Jawa Timur, Surabaya memiliki karakteristik demografi yang heterogen
          dengan pembagian wilayah utama meliputi Pusat, Utara, Selatan, Barat, dan Timur.
          Visualisasi ini bertujuan untuk memetakan konsentrasi kepadatan penduduk, rasio gender, dan
          persebaran usia produktif guna mendukung perencanaan tata kota yang berbasis data (data-driven
          policy) serta permerataan pembangunan infrastruktur.
        </DescriptionText>
      </DescriptionCard>
    </BoxStyled>
  )
}

HomeSection3_5.defaultProps = {}

export default memo(HomeSection3_5)
