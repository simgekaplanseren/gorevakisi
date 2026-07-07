import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Alert,
  Box,
  Link as MuiLink,
  Typography,
  Grid,
} from '@mui/material';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { extractError } from '../api/authApi';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await registerUser({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
      });
      navigate('/projects');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Kayıt Ol" subtitle="Yeni hesap oluşturun">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ad"
              {...register('name', { required: 'Ad gerekli' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Soyad"
              {...register('surname', { required: 'Soyad gerekli' })}
              error={!!errors.surname}
              helperText={errors.surname?.message}
            />
          </Grid>
        </Grid>
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
        <TextField
          fullWidth
          label="Şifre"
          type="password"
          margin="normal"
          {...register('password', {
            required: 'Şifre gerekli',
            minLength: { value: 6, message: 'En az 6 karakter' },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          fullWidth
          label="Şifre Tekrar"
          type="password"
          margin="normal"
          {...register('confirmPassword', {
            required: 'Şifre tekrarı gerekli',
            validate: (v) => v === watch('password') || 'Şifreler eşleşmiyor',
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </Button>
        <Box textAlign="center" mt={2}>
          <Typography variant="body2" component="span" color="text.secondary">
            Zaten hesabınız var mı?{' '}
          </Typography>
          <MuiLink component={Link} to="/login" variant="body2">
            Giriş Yap
          </MuiLink>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Register;
