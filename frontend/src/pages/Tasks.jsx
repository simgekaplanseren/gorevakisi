import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import SearchIcon from '@mui/icons-material/Search';
import CommentIcon from '@mui/icons-material/Comment';
import { useForm } from 'react-hook-form';
import { taskApi } from '../api/taskApi';
import { projectApi } from '../api/projectApi';
import { userApi } from '../api/userApi';
import { commentApi } from '../api/commentApi';
import { extractError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  isOverdue,
  isDueToday,
  formatDateTime,
} from '../utils/helpers';
import { TASK_STATUSES, TASK_PRIORITIES, PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants';

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', dueDateFrom: '', dueDateTo: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [commentDrawer, setCommentDrawer] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectData, taskData] = await Promise.all([
        projectApi.getById(projectId),
        taskApi.getAll({
          projectId,
          search: filters.search || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          dueDateFrom: filters.dueDateFrom || undefined,
          dueDateTo: filters.dueDateTo || undefined,
        }),
      ]);
      setProject(projectData);
      setTasks(taskData || []);
      if (isAdmin) {
        const userData = await userApi.getAll();
        setUsers(userData || []);
      }
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, filters]);

  const openCreate = () => {
    setEditTask(null);
    reset({ title: '', description: '', priority: 'Medium', dueDate: '', assignedUserId: '' });
    setDialogOpen(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedUserId: task.assignedUserId || '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        assignedUserId: data.assignedUserId ? Number(data.assignedUserId) : null,
      };
      if (editTask) {
        await taskApi.update(editTask.id, { ...payload, status: data.status });
      } else {
        await taskApi.create({ ...payload, projectId: Number(projectId) });
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await taskApi.delete(deleteId);
      setDeleteId(null);
      loadData();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openComments = async (task) => {
    setCommentDrawer(task);
    try {
      const data = await commentApi.getByTask(task.id);
      setComments(data || []);
    } catch {
      setComments([]);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await commentApi.create(commentDrawer.id, newComment);
      setNewComment('');
      const data = await commentApi.getByTask(commentDrawer.id);
      setComments(data || []);
      loadData();
    } catch (err) {
      setError(extractError(err));
    }
  };

  if (loading && !project) return <LoadingSpinner minHeight={400} />;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={() => navigate('/projects')}>
          <ArrowBackIcon />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight={700}>
            {project?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Görev Listesi
          </Typography>
        </Box>
        <Button startIcon={<ViewKanbanIcon />} onClick={() => navigate(`/projects/${projectId}/kanban`)}>
          Kanban
        </Button>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Yeni Görev
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Görev ara..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Durum"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            {TASK_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Öncelik"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            {TASK_PRIORITIES.map((p) => (
              <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Başlangıç"
            InputLabelProps={{ shrink: true }}
            value={filters.dueDateFrom}
            onChange={(e) => setFilters({ ...filters, dueDateFrom: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Bitiş"
            InputLabelProps={{ shrink: true }}
            value={filters.dueDateTo}
            onChange={(e) => setFilters({ ...filters, dueDateTo: e.target.value })}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Başlık</TableCell>
              <TableCell>Atanan</TableCell>
              <TableCell>Öncelik</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Teslim</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Görev bulunamadı</TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignedUserName || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={PRIORITY_LABELS[task.priority]}
                      size="small"
                      sx={{ bgcolor: `${getPriorityColor(task.priority)}22`, color: getPriorityColor(task.priority) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[task.status]}
                      size="small"
                      sx={{ bgcolor: `${getStatusColor(task.status)}22`, color: getStatusColor(task.status) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={isOverdue(task.dueDate, task.status) ? 'error.main' : isDueToday(task.dueDate, task.status) ? 'warning.main' : 'text.primary'}
                    >
                      {formatDate(task.dueDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openComments(task)}>
                      <CommentIcon fontSize="small" />
                    </IconButton>
                    {isAdmin && (
                      <>
                        <IconButton size="small" onClick={() => openEdit(task)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(task.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTask ? 'Görev Düzenle' : 'Yeni Görev'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField fullWidth label="Başlık" margin="dense" {...register('title', { required: 'Başlık gerekli' })} error={!!errors.title} helperText={errors.title?.message} />
            <TextField fullWidth label="Açıklama" margin="dense" multiline rows={3} {...register('description')} />
            <TextField fullWidth select label="Öncelik" margin="dense" defaultValue="Medium" {...register('priority')}>
              {TASK_PRIORITIES.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </TextField>
            {editTask && (
              <TextField fullWidth select label="Durum" margin="dense" defaultValue={editTask.status} {...register('status')}>
                {TASK_STATUSES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </TextField>
            )}
            <TextField fullWidth type="date" label="Teslim Tarihi" margin="dense" InputLabelProps={{ shrink: true }} {...register('dueDate')} />
            {isAdmin && (
              <TextField fullWidth select label="Atanan Kişi" margin="dense" defaultValue="" {...register('assignedUserId')}>
                <MenuItem value="">Atanmamış</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.name} {u.surname}</MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>İptal</Button>
            <Button type="submit" variant="contained" disabled={submitting}>{editTask ? 'Güncelle' : 'Oluştur'}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog open={!!deleteId} title="Görevi Sil" message="Bu görevi silmek istediğinize emin misiniz?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={submitting} />

      <Drawer anchor="right" open={!!commentDrawer} onClose={() => setCommentDrawer(null)} PaperProps={{ sx: { width: 360 } }}>
        <Box p={2}>
          <Typography variant="h6" fontWeight={600} mb={1}>{commentDrawer?.title}</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Yorumlar</Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {comments.length === 0 ? (
              <ListItem><ListItemText primary="Henüz yorum yok" /></ListItem>
            ) : (
              comments.map((c) => (
                <ListItem key={c.id} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 1 }}>
                  <Typography variant="caption" fontWeight={600}>{c.userName}</Typography>
                  <Typography variant="body2">{c.comment}</Typography>
                  <Typography variant="caption" color="text.secondary">{formatDateTime(c.createdDate)}</Typography>
                </ListItem>
              ))
            )}
          </List>
          <Box display="flex" gap={1} mt={2}>
            <TextField fullWidth size="small" placeholder="Yorum yaz..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <Button variant="contained" onClick={submitComment}>Gönder</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Tasks;
