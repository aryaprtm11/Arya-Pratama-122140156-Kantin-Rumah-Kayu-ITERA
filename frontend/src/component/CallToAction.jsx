import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const CallToAction = ({ onViewMenuClick }) => {
  return (
    <Box 
      sx={{ 
        bgcolor: '#E4EFE7', 
        borderRadius: 4,
        p: 4,
        textAlign: 'center',
        boxShadow: 3
      }}
    >
      <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
        Ingin Memesan Makanan?
      </Typography>
      <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 3 }}>
        Jelajahi menu kami dan temukan hidangan yang pas untuk menemani harimu!
      </Typography>
      <Button 
        variant="contained" 
        size="large"
        onClick={onViewMenuClick}
        sx={{ 
          bgcolor: '#4CAF50', 
          '&:hover': { bgcolor: '#388E3C' },
          borderRadius: '12px',
          px: 4,
          py: 1.5,
          fontWeight: 'bold'
        }}
      >
        Lihat Menu
      </Button>
    </Box>
  );
};

export default CallToAction; 