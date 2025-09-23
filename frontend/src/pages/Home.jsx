import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Home = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  
  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Update form when user changes
  React.useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
  }, [user]);

  React.useEffect(() => {
    if (user?.role.toLowerCase() === 'admin') {
      navigate('/admin');
    }
  }, []);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    
    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditingProfile(false);
      } else {
        setProfileMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile' });
    }
    
    setProfileLoading(false);
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
    setIsEditingProfile(false);
    setProfileMessage({ type: '', text: '' });
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      setPasswordLoading(false);
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setPasswordLoading(false);
      return;
    }
    
    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (result.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setPasswordDialogOpen(false);
          setPasswordMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setPasswordMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Failed to change password' });
    }
    
    setPasswordLoading(false);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage({ type: '', text: '' });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to GreenPath Bookings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your sustainable travel booking platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* User Info Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    Your Profile
                  </Typography>
                  {!isEditingProfile && (
                    <IconButton 
                      onClick={() => setIsEditingProfile(true)}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>

                {profileMessage.text && (
                  <Alert severity={profileMessage.type} sx={{ mb: 2 }}>
                    {profileMessage.text}
                  </Alert>
                )}

                {isEditingProfile ? (
                  <Box>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileInputChange}
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileInputChange}
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSaveProfile}
                        disabled={profileLoading}
                        startIcon={profileLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCancelProfileEdit}
                        disabled={profileLoading}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Email:</strong> {user?.email}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Role:</strong> {user?.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member since: {new Date(user?.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPasswordDialogOpen(true)}
                      sx={{ mt: 1 }}
                    >
                      Change Password
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      My Bookings
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate('/my-bookings')}
                    >
                      View All
                    </Button>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <EnergySavingsLeafIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Eco Tours
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate('/tours')}
                    >
                      Explore
                    </Button>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <LocationOn sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      New Booking
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => navigate('/tours')}
                    >
                      Book Now
                    </Button>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordMessage.text && (
            <Alert severity={passwordMessage.type} sx={{ mb: 2 }}>
              {passwordMessage.text}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} disabled={passwordLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            {passwordLoading ? <CircularProgress size={20} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Home;
