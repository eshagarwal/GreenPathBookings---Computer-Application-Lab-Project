import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { register } from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        }
      });
      setSuccess('Registration successful! You can now log in.');
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: '',
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" name="username"
            value={formData.username} onChange={handleChange} margin="normal" required />

          <TextField fullWidth label="Email" name="email" type="email"
            value={formData.email} onChange={handleChange} margin="normal" required />

          <TextField fullWidth label="Password" name="password" type="password"
            value={formData.password} onChange={handleChange} margin="normal" required />

          <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName}
            onChange={handleChange} margin="normal" />

          <TextField fullWidth label="Phone" name="phone"
            value={formData.phone} onChange={handleChange} margin="normal" />

          <TextField fullWidth label="Address" name="address"
            value={formData.address} onChange={handleChange} margin="normal" />

          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
