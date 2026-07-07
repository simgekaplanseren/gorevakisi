import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Alert,
  Box,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { extractError } from '../api/authApi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(data);
      navigate(result.user.role === 'Admin' ? '/dashboard' : '/projects');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="TaskFlow" subtitle="Hesabınıza giriş yapın">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
        <TextField
          fullWidth
          label="Şifre"
          type={showPassword ? 'text' : 'password'}
          margin="normal"
          {...register('password', { required: 'Şifre gerekli' })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box textAlign="right" mt={1}>
          <MuiLink component={Link} to="/forgot-password" variant="body2">
            Şifremi unuttum
          </MuiLink>
        </Box>
        <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>
        <Box textAlign="center" mt={2}>
          <Typography variant="body2" component="span" color="text.secondary">
            Hesabınız yok mu?{' '}
          </Typography>
          <MuiLink component={Link} to="/register" variant="body2">
            Kayıt Ol
          </MuiLink>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Login;
