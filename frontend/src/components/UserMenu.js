import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  ListItemIcon,
  Badge,
} from "@mui/material";
import {
  Settings,
  AccountCircle,
  BookmarkBorder,
  FavoriteBorder,
  Logout,
  Dashboard,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAnchorEl(null);
    navigate("/");
  };

  const handleMenuClick = (path) => {
    handleClose();
    navigate(path);
  };

  // Generate user avatar with better styling
  const getAvatarColor = (username) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* User Info Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '12px',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
        onClick={handleOpen}
      >
        <Avatar 
          sx={{ 
            bgcolor: getAvatarColor(user.username),
            width: 40,
            height: 40,
            fontSize: '16px',
            fontWeight: 'bold',
            mr: 2,
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              fontSize: '12px',
              opacity: 0.8,
              lineHeight: 1,
            }}
          >
            Welcome back
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              fontWeight: '500',
              fontSize: '14px',
              lineHeight: 1.2,
            }}
          >
            {user.username || "User"}
          </Typography>
        </Box>
        
        <KeyboardArrowDown 
          sx={{ 
            ml: 1, 
            color: 'white',
            fontSize: '20px',
            transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }} 
        />
      </Box>

      {/* Enhanced Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            },
          },
        }}
      >
        {/* User Profile Header */}
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: getAvatarColor(user.username),
                width: 32,
                height: 32,
                fontSize: '14px',
                mr: 1.5,
              }}
            >
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="600">
                {user.username || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Traveler
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem onClick={() => handleMenuClick('/dashboard')}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Dashboard</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick('/profile')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">My Profile</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick('/bookings')}>
          <ListItemIcon>
            <BookmarkBorder fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">My Bookings</Typography>
          <Badge 
            badgeContent={3} 
            color="primary" 
            sx={{ ml: 'auto' }}
            variant="standard"
          />
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick('/favorites')}>
          <ListItemIcon>
            <FavoriteBorder fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Favorites</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Settings</Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem 
          onClick={handleLogout}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;