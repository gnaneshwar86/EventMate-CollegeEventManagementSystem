import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#00809D', color: 'white' }}>
      <img 
        src="/EventMate_Logo.png" 
        alt="EventMate Logo" 
        style={{ height: '50px', marginBottom: '16px' }} 
      />
      <Typography variant="body2">© 2025 EventMate. College Event Management System.</Typography>
    </Box>
  );
}

export default Footer;
