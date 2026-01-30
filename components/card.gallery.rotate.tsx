import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Container } from '@mui/material';

interface RotateCardGalleryProps {
  cards?: string[];
}

const RotateCardGallery: React.FC<RotateCardGalleryProps> = ({
  cards = [
    '/images/Card/card1.webp',
    '/images/Card/card2.webp',
    '/images/Card/card3.webp',
    '/images/Card/card4.webp',
  ],
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      setMousePosition({ x: rotateY, y: rotateX });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setMousePosition({ x: 0, y: 0 });
  };

  // Card positions dengan offset untuk layout yang lebih menarik
  const cardPositions = [
    { rotation: -8, translate: '-40px' },
    { rotation: -4, translate: '-20px' },
    { rotation: 4, translate: '20px' },
    { rotation: 8, translate: '40px' },
  ];

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        perspective: '1200px',
        overflow: 'visible',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '-20px',
            padding: '60px 20px',
            minHeight: '500px',
            perspective: '1200px',
            position: 'relative',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{
                rotateZ: cardPositions[index]?.rotation || 0,
                y: 0,
              }}
              animate={
                hoveredIndex === index
                  ? {
                      rotateZ: cardPositions[index]?.rotation || 0,
                      rotateX: mousePosition.y,
                      rotateY: mousePosition.x,
                      y: -20,
                      scale: 1.08,
                    }
                  : {
                      rotateZ: cardPositions[index]?.rotation || 0,
                      rotateX: 0,
                      rotateY: 0,
                      y: 0,
                      scale: 1,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseMove={(e) =>
                handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>, index)
              }
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow:
                    hoveredIndex === index
                      ? '0 20px 60px rgba(0, 0, 0, 0.3)'
                      : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                  flexShrink: 0,
                  transform: `translateY(${cardPositions[index]?.translate || '0px'})`,
                  '&:hover': {
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={card}
                  alt={`Card ${index + 1}`}
                  sx={{
                    display: 'block',
                    width: '260px',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                  }}
                />
                {/* Shine effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    borderRadius: '20px',
                  }}
                />
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default RotateCardGallery;
