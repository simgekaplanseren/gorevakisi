import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import WarningIcon from '@mui/icons-material/Warning';
import TodayIcon from '@mui/icons-material/Today';
import { dashboardApi } from '../api/dashboardApi';
import { extractError } from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants';

const statCards = [
  { key: 'totalProjects', label: 'Toplam Proje', icon: FolderIcon, color: '#6366f1' },
  { key: 'totalTasks', label: 'Toplam Görev', icon: AssignmentIcon, color: '#3b82f6' },
  { key: 'completedTasks', label: 'Tamamlanan', icon: CheckCircleIcon, color: '#22c55e' },
  { key: 'inProgressTasks', label: 'Devam Eden', icon: PendingIcon, color: '#f97316' },
  { key: 'overdueTasks', label: 'Geciken', icon: WarningIcon, color: '#ef4444' },
  { key: 'dueTodayTasks', label: 'Bugün Teslim', icon: TodayIcon, color: '#a855f7' },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err) {
        setError(extractError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner minHeight={400} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={2} mb={4}>
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Grid item xs={6} sm={4} md={2} key={key}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Icon sx={{ color, fontSize: 22 }} />
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats[key]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={600} mb={2}>
        Son Eklenen Görevler
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Başlık</TableCell>
              <TableCell>Proje</TableCell>
              <TableCell>Atanan</TableCell>
              <TableCell>Öncelik</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Teslim</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(stats.recentTasks || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Henüz görev yok
                </TableCell>
              </TableRow>
            ) : (
              stats.recentTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.projectName}</TableCell>
                  <TableCell>{task.assignedUserName || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={PRIORITY_LABELS[task.priority] || task.priority}
                      size="small"
                      sx={{ bgcolor: `${getPriorityColor(task.priority)}22`, color: getPriorityColor(task.priority) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[task.status] || task.status}
                      size="small"
                      sx={{ bgcolor: `${getStatusColor(task.status)}22`, color: getStatusColor(task.status) }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
