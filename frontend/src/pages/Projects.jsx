import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { projectApi } from '../api/projectApi';
import { extractError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/projects/ProjectCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Projects = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadProjects = async (query = search) => {
    setLoading(true);
    try {
      const data = await projectApi.getAll(query || undefined);
      setProjects(data || []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadProjects(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const onCreate = async (data) => {
    setSubmitting(true);
    try {
      await projectApi.create(data);
      setDialogOpen(false);
      reset();
      loadProjects();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await projectApi.delete(deleteId);
      setDeleteId(null);
      loadProjects();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Projeler
        </Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Yeni Proje
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Proje ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner minHeight={300} />
      ) : projects.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={6}>
          Proje bulunamadı
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard
                project={project}
                isAdmin={isAdmin}
                onViewTasks={() => navigate(`/projects/${project.id}/tasks`)}
                onViewKanban={() => navigate(`/projects/${project.id}/kanban`)}
                onDelete={() => setDeleteId(project.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Proje</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onCreate)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Proje Adı"
              margin="dense"
              {...register('name', { required: 'Proje adı gerekli' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              label="Açıklama"
              margin="dense"
              multiline
              rows={3}
              {...register('description')}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>İptal</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              Oluştur
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Projeyi Sil"
        message="Bu projeyi silmek istediğinize emin misiniz? Tüm görevler de silinecektir."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={submitting}
      />
    </Box>
  );
};

export default Projects;
