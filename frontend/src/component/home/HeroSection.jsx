import React from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  Chip 
} from '@mui/material';
import { Restaurant, ShoppingCart } from '@mui/icons-material';
import Kantin from "../../assets/Kantin.jpg";

const HeroSection = ({ onOrderClick }) => {
  return (
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={7}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card elevation={6} sx={{ 
            overflow: 'hidden', 
            borderRadius: 4,
            width: '100%'
          }}>
            <CardMedia
              component="img"
              image={Kantin}
              alt="Kantin ITERA"
              sx={{ 
                height: { xs: 300, sm: 400, md: 500, lg: 550 },
                width: '100%',
                objectFit: 'cover',
                transition: '0.5s ease',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}
            />
          </Card>
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#2E4F4F',
              mb: 2,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Selamat Datang di Rumah Kayu ITERA!
          </Typography>
          
          <Chip 
            icon={<Restaurant />} 
            label="Kuliner Kampus Terbaik" 
            color="success" 
            sx={{ mb: 2 }} 
          />
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              fontSize: '1.1rem',
              color: '#555',
              lineHeight: 1.7
            }}
          >
            Selamat datang di Kantin Rumah Kayu ITERA — tempat di mana cita rasa nusantara berpadu dengan kenyamanan suasana. Kami hadir untuk memberikan pengalaman bersantap yang tak hanya lezat, tetapi juga penuh kehangatan.
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              fontSize: '1.1rem',
              color: '#555',
              lineHeight: 1.7
            }}
          >
            Dengan tempat yang nyaman dan harga bersahabat, Rumah Kayu ITERA siap jadi tempat andalanmu setiap hari. Rasakan sendiri kelezatan yang tak hanya memanjakan lidah, tapi juga membuatmu betah berlama-lama!
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            onClick={onOrderClick}
            startIcon={<ShoppingCart />}
            sx={{ 
              bgcolor: '#4CAF50', 
              '&:hover': { bgcolor: '#388E3C' },
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none'
            }}
          >
            Pesan Sekarang
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeroSection; 