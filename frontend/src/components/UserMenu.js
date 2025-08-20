import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: '#B0DB9C', mr: 1 }}>
        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
      </Avatar>
      <Typography variant="body1" sx={{ mr: 2 }}>
        Hello, {user.username || 'User'}
      </Typography>
      <IconButton color="inherit" onClick={handleOpen}>
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
