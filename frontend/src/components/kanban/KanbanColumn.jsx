import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography, Paper } from '@mui/material';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ id, title, color, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        minWidth: 280,
        maxWidth: 320,
        flex: '0 0 280px',
        bgcolor: isOver ? 'action.hover' : 'background.default',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      <Box
        px={2}
        py={1.5}
        display="flex"
        alignItems="center"
        gap={1}
        borderBottom={1}
        borderColor="divider"
      >
        <Box width={10} height={10} borderRadius="50%" bgcolor={color} />
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" ml="auto">
          {tasks.length}
        </Typography>
      </Box>
      <Box flex={1} overflow="auto" p={1.5} display="flex" flexDirection="column" gap={1.5}>
        {tasks.map((task) => (
          <SortableKanbanCard key={task.id} task={task} />
        ))}
      </Box>
    </Paper>
  );
};

const SortableKanbanCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard task={task} />
    </div>
  );
};

export default KanbanColumn;
