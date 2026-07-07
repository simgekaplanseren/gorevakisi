export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const TASK_STATUSES = [
  { value: 'ToDo', label: 'To Do', color: '#64748b' },
  { value: 'InProgress', label: 'In Progress', color: '#3b82f6' },
  { value: 'Review', label: 'Review', color: '#a855f7' },
  { value: 'Completed', label: 'Completed', color: '#22c55e' },
];

export const TASK_PRIORITIES = [
  { value: 'Low', label: 'Low', color: '#22c55e' },
  { value: 'Medium', label: 'Medium', color: '#3b82f6' },
  { value: 'High', label: 'High', color: '#f97316' },
  { value: 'Critical', label: 'Critical', color: '#ef4444' },
];

export const STATUS_LABELS = Object.fromEntries(
  TASK_STATUSES.map((s) => [s.value, s.label])
);

export const PRIORITY_LABELS = Object.fromEntries(
  TASK_PRIORITIES.map((p) => [p.value, p.label])
);
