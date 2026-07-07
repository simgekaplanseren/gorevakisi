import {
  Card,
  CardContent,
  CardActions,
  Typography,
  LinearProgress,
  Box,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { formatDateTime } from '../../utils/helpers';

const ProjectCard = ({ project, isAdmin, onViewTasks, onViewKanban, onDelete }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
    }}
  >
    <CardContent sx={{ flex: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="h6" fontWeight={600} noWrap sx={{ maxWidth: '80%' }}>
          {project.name}
        </Typography>
        <Chip label={project.status} size="small" variant="outlined" />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
        {project.description || 'Açıklama yok'}
      </Typography>
      <Box mb={1}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">
            İlerleme
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {project.completedTasks}/{project.totalTasks} ({project.progressPercentage}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={project.progressPercentage}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Son güncelleme: {formatDateTime(project.updatedDate)}
      </Typography>
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
      <Box>
        <Button size="small" startIcon={<ListAltIcon />} onClick={onViewTasks}>
          Görevler
        </Button>
        <Button size="small" startIcon={<ViewKanbanIcon />} onClick={onViewKanban}>
          Kanban
        </Button>
      </Box>
      {isAdmin && (
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      )}
    </CardActions>
  </Card>
);

export default ProjectCard;
