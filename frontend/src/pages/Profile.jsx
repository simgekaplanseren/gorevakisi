import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Grid,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { profileApi } from '../api/profileApi';
import { extractError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getInitials, getAvatarUrl } from '../utils/helpers';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const profileForm = useForm();
  const passwordForm = useForm();

  const loadProfile = async () => {
    try {
      const data = await profileApi.get();
      setProfile(data);
      profileForm.reset({ name: data.name, surname: data.surname });
      updateUser(data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onUpdateProfile = async (data) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const updated = await profileApi.update(data);
      setProfile(updated);
      updateUser(updated);
      setSuccess('Profil güncellendi.');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onChangePassword = async (data) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await profileApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      setSuccess('Şifre değiştirildi.');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubmitting(true);
    try {
      const result = await profileApi.uploadAvatar(file);
      const avatarUrl = result.avatarUrl;
      setProfile((prev) => ({ ...prev, avatarUrl }));
      updateUser({ ...profile, avatarUrl });
      setSuccess('Profil fotoğrafı güncellendi.');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner minHeight={400} />;

  return (
    <Box maxWidth={800}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Profil
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Box position="relative">
            <Avatar
              src={getAvatarUrl(profile?.avatarUrl)}
              sx={{ width: 96, height: 96, fontSize: 32, bgcolor: 'primary.main' }}
            >
              {getInitials(profile?.name, profile?.surname)}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {profile?.name} {profile?.surname}
            </Typography>
            <Typography variant="body2" color="text.secondary">{profile?.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {profile?.role} · {profile?.assignedTaskCount} görev · {profile?.completedTaskCount} tamamlanan
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Kişisel Bilgiler
        </Typography>
        <Box component="form" onSubmit={profileForm.handleSubmit(onUpdateProfile)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ad"
                {...profileForm.register('name', { required: 'Ad gerekli' })}
                error={!!profileForm.formState.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Soyad"
                {...profileForm.register('surname', { required: 'Soyad gerekli' })}
                error={!!profileForm.formState.errors.surname}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={submitting}>
            Kaydet
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Şifre Değiştir
        </Typography>
        <Box component="form" onSubmit={passwordForm.handleSubmit(onChangePassword)}>
          <TextField
            fullWidth
            label="Mevcut Şifre"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            {...passwordForm.register('currentPassword', { required: 'Mevcut şifre gerekli' })}
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
          <TextField
            fullWidth
            label="Yeni Şifre"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            {...passwordForm.register('newPassword', {
              required: 'Yeni şifre gerekli',
              minLength: { value: 6, message: 'En az 6 karakter' },
            })}
          />
          <TextField
            fullWidth
            label="Yeni Şifre Tekrar"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            {...passwordForm.register('confirmPassword', {
              required: 'Şifre tekrarı gerekli',
              validate: (v) => v === passwordForm.watch('newPassword') || 'Şifreler eşleşmiyor',
            })}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={submitting}>
            Şifreyi Değiştir
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
