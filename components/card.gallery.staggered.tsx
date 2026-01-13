import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface StaggeredCardGalleryProps {
  cards?: string[];
}

const StaggeredCardGallery: React.FC<StaggeredCardGalleryProps> = ({
  cards = [
    '/images/Card/front_card_1.png',
    '/images/Card/front_card_2.png',
    '/images/Card/front_card_3.png',
    '/images/Card/front_card_4.png',
  ],
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Layout configuration untuk staggered cards (mirip gambar)
  const cardConfig = [
    {
      x: -180,
      y: 40,
      rotation: -12,
      zIndex: 1,
    },
    {
      x: -60,
      y: -20,
      rotation: -6,
      zIndex: 3,
    },
    {
      x: 60,
      y: 20,
      rotation: 6,
      zIndex: 2,
    },
    {
      x: 180,
      y: -40,
      rotation: 12,
      zIndex: 0,
    },
  ];

  const cardVariants = {
    initial: (index: number) => ({
      x: cardConfig[index].x,
      y: cardConfig[index].y,
      rotateZ: cardConfig[index].rotation,
      scale: 1,
    }),
    hover: {
      scale: 1.12,
      y: -30,
      rotateZ: 0,
      filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        paddingY: '40px',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '600px',
          height: '450px',
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="initial"
            animate={hoveredIndex === index ? 'hover' : 'initial'}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: 'absolute',
              zIndex: hoveredIndex === index ? 100 : cardConfig[index].zIndex,
              transformStyle: 'preserve-3d',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                width: '280px',
                height: '360px',
                backgroundColor: '#fff',
                border: '4px solid white',
                transition: 'box-shadow 0.3s ease',
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
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px',
                }}
              />

              {/* Overlay gradient untuk efek lebih menarik */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)',
                  pointerEvents: 'none',
                  borderRadius: '20px',
                }}
              />
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default StaggeredCardGallery;
