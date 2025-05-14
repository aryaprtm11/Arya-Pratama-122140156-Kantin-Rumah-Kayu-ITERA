import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const featureCardStyle = {
  width: '100%',
  maxWidth: '350px',
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '32px 24px',
  margin: '0 auto',
  transition: '0.3s',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)'
  }
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Paper elevation={3} sx={featureCardStyle}>
      <Box 
        sx={{ 
          bgcolor: '#E4EFE7', 
          borderRadius: '50%', 
          p: 2, 
          mb: 3,
          color: '#2E4F4F',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        component="h4" 
        gutterBottom 
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        textAlign="center"
        sx={{ lineHeight: 1.6 }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default FeatureCard; 