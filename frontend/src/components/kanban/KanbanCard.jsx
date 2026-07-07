import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { formatDate, getPriorityColor, isOverdue, isDueToday } from '../../utils/helpers';
import { PRIORITY_LABELS } from '../../utils/constants';

const KanbanCard = ({ task, isDragging }) => (
  <Card
    sx={{
      cursor: isDragging ? 'grabbing' : 'grab',
      boxShadow: isDragging ? 6 : 1,
      '&:hover': { boxShadow: 3 },
    }}
  >
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Typography variant="body2" fontWeight={600} mb={1}>
        {task.title}
      </Typography>
      {task.assignedUserName && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {task.assignedUserName}
        </Typography>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip
          label={PRIORITY_LABELS[task.priority]}
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            bgcolor: `${getPriorityColor(task.priority)}22`,
            color: getPriorityColor(task.priority),
          }}
        />
        {task.dueDate && (
          <Typography
            variant="caption"
            color={
              isOverdue(task.dueDate, task.status)
                ? 'error.main'
                : isDueToday(task.dueDate, task.status)
                  ? 'warning.main'
                  : 'text.secondary'
            }
          >
            {formatDate(task.dueDate)}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default KanbanCard;
