import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { Box, Typography, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { taskApi } from '../api/taskApi';
import { projectApi } from '../api/projectApi';
import { extractError } from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import KanbanColumn from '../components/kanban/KanbanColumn';
import KanbanCard from '../components/kanban/KanbanCard';
import { TASK_STATUSES } from '../utils/constants';

const KanbanBoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectData, taskData] = await Promise.all([
        projectApi.getById(projectId),
        taskApi.getAll({ projectId }),
      ]);
      setProject(projectData);
      setTasks(taskData || []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === Number(event.active.id));
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id.toString().startsWith('column-')
      ? over.id.toString().replace('column-', '')
      : tasks.find((t) => t.id === Number(over.id))?.status;

    if (!newStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskApi.updateStatus(taskId, newStatus);
    } catch (err) {
      setError(extractError(err));
      loadData();
    }
  };

  if (loading) return <LoadingSpinner minHeight={400} />;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <IconButton onClick={() => navigate('/projects')}>
          <ArrowBackIcon />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight={700}>{project?.name}</Typography>
          <Typography variant="body2" color="text.secondary">Kanban Board</Typography>
        </Box>
        <IconButton onClick={() => navigate(`/projects/${projectId}/tasks`)}>
          <ListAltIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          display="flex"
          gap={2}
          overflow="auto"
          pb={2}
          sx={{ minHeight: 'calc(100vh - 200px)' }}
        >
          {TASK_STATUSES.map((col) => (
            <KanbanColumn
              key={col.value}
              id={`column-${col.value}`}
              title={col.label}
              color={col.color}
              tasks={getTasksByStatus(col.value)}
            />
          ))}
        </Box>
        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
};

export default KanbanBoardPage;
