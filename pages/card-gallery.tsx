import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import StaggeredCardGallery from '@/components/card.gallery.staggered';

const CardGalleryPage: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        paddingTop: '40px',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', marginBottom: '60px' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              marginBottom: '16px',
              color: '#333',
            }}
          >
            Koleksi Momen Spesial
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: '18px',
            }}
          >
            Hover pada foto untuk melihat efek animasi 3D
          </Typography>
        </Box>

        {/* Gallery dengan animasi staggered */}
        <StaggeredCardGallery />

        {/* Deskripsi */}
        <Box
          sx={{
            marginTop: '80px',
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: '16px', fontWeight: 600 }}>
            Fitur Animasi
          </Typography>
          <Box component="ul" sx={{ marginLeft: '20px' }}>
            <Typography component="li" sx={{ marginBottom: '8px' }}>
              ✨ Animasi rotate 3D saat cursor mendekat
            </Typography>
            <Typography component="li" sx={{ marginBottom: '8px' }}>
              📸 Efek shadow yang meningkat pada hover
            </Typography>
            <Typography component="li" sx={{ marginBottom: '8px' }}>
              🎯 Responsive dan smooth transition
            </Typography>
            <Typography component="li">
              💫 Layout staggered yang menarik secara visual
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CardGalleryPage;
