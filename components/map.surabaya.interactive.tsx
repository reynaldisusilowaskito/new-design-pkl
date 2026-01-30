import React, { memo, useState, useRef, useEffect } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BreakpointsContext } from 'contexts/breakpoints'

interface Props { }

const MapWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  padding: theme.spacing(2),
}))

const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
}))

const SVGContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  '& svg': {
    width: '100%',
    height: 'auto',
    display: 'block',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
  },
  '& path, & polygon': {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      fill: '#ffd54f !important',
      filter: 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    },
  },
}))

const TooltipBox = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: theme.spacing(1.5, 2),
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  pointerEvents: 'none',
  zIndex: 1000,
  border: '2px solid #1a7a7a',
}))

const TooltipTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: '#1a7a7a',
  marginBottom: theme.spacing(0.5),
}))

const TooltipText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#666',
}))

const InteractiveMapSurabaya: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [svgContent, setSvgContent] = useState<string>('')
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load SVG content
    fetch('/images/Kecamatan/Surabaya.svg')
      .then(response => response.text())
      .then(data => {
        setSvgContent(data)
      })
      .catch(error => console.error('Error loading SVG:', error))
  }, [])

  useEffect(() => {
    if (svgRef.current && svgContent) {
      const svgElement = svgRef.current.querySelector('svg')
      if (svgElement) {
        // Get all path and polygon elements
        const paths = svgElement.querySelectorAll('path, polygon')
        
        paths.forEach((path, index) => {
          const element = path as SVGElement
          
          // Add event listeners
          element.addEventListener('mouseenter', (e) => {
            const districtName = element.getAttribute('id') || element.getAttribute('data-name') || `Kecamatan ${index + 1}`
            setHoveredDistrict(districtName)
            
            const rect = element.getBoundingClientRect()
            setTooltipPos({
              x: rect.left + rect.width / 2,
              y: rect.top,
            })
          })
          
          element.addEventListener('mousemove', (e: Event) => {
            const mouseEvent = e as MouseEvent
            setTooltipPos({
              x: mouseEvent.clientX + 10,
              y: mouseEvent.clientY + 10,
            })
          })
          
          element.addEventListener('mouseleave', () => {
            setHoveredDistrict(null)
          })
          
          element.addEventListener('click', () => {
            const districtName = element.getAttribute('id') || element.getAttribute('data-name') || `Kecamatan ${index + 1}`
            setSelectedDistrict(selectedDistrict === districtName ? null : districtName)
            console.log('Selected district:', districtName)
          })
          
          // Style selected district
          if (selectedDistrict && (element.getAttribute('id') === selectedDistrict || element.getAttribute('data-name') === selectedDistrict)) {
            element.style.fill = '#ffeb3b'
          }
        })
      }
    }
  }, [svgContent, selectedDistrict])

  return (
    <MapWrapper>
      <MapContainer>
        <SVGContainer 
          ref={svgRef}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            marginTop: 2,
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic',
          }}
        >
          Peta Interaktif 31 Kecamatan Kota Surabaya
        </Typography>
      </MapContainer>

      {hoveredDistrict && (
        <TooltipBox
          sx={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <TooltipTitle>{hoveredDistrict}</TooltipTitle>
          <TooltipText>Klik untuk melihat detail</TooltipText>
        </TooltipBox>
      )}
    </MapWrapper>
  )
}

InteractiveMapSurabaya.defaultProps = {}

export default memo(InteractiveMapSurabaya)
