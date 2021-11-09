import React from 'react';
import { AppBar, Box } from '@mui/material';
import '../styles/Header.scss';

const Header = () => (
  <Box>
    <AppBar position="static" sx={{ backgroundColor: '#df9629' }}>
      <div className="header">
        TodoList by Alexander Shlyundikov
      </div>
    </AppBar>
  </Box>
);

export default Header;
