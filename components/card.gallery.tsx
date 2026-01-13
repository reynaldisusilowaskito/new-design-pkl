import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Container } from '@mui/material';

interface CardGalleryProps {
  cards?: string[];
}

const CardGallery: React.FC<CardGalleryProps> = ({
  cards = [
    '/images/Card/front_card_1.png',
    '/images/Card/front_card_2.png',
    '/images/Card/front_card_3.png',
    '/images/Card/front_card_4.png',
  ],
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cardVariants = {
    initial: {
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
    },
    hover: {
      rotateY: 15,
      rotateZ: -5,
      scale: 1.05,
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        perspective: '1000px',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            padding: '40px 20px',
            minHeight: '400px',
            perspective: '1000px',
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              animate={hoveredIndex === index ? 'hover' : 'initial'}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                perspective: '1000px',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={card}
                  alt={`Card ${index + 1}`}
                  sx={{
                    display: 'block',
                    width: '280px',
                    height: '360px',
                    objectFit: 'cover',
                    borderRadius: '16px',
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

export default CardGallery;
