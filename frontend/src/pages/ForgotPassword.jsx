import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, Box, Link as MuiLink, Typography } from '@mui/material';
import AuthLayout from '../components/layout/AuthLayout';
import { authApi, extractError } from '../api/authApi';

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi (demo).');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Şifremi Unuttum" subtitle="E-posta adresinize sıfırlama bağlantısı gönderilecek">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="E-posta"
          margin="normal"
          {...register('email', {
            required: 'E-posta gerekli',
            pattern: { value: /^\S+@\S+$/i, message: 'Geçerli e-posta girin' },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </Button>
        <Box textAlign="center" mt={2}>
          <MuiLink component={Link} to="/login" variant="body2">
            Giriş sayfasına dön
          </MuiLink>
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2}>
          Bu özellik şimdilik yalnızca arayüz demosudur.
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPassword;
