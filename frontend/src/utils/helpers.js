import { TASK_PRIORITIES, TASK_STATUSES } from './constants';

export const getPriorityColor = (priority) =>
  TASK_PRIORITIES.find((p) => p.value === priority)?.color || '#64748b';

export const getStatusColor = (status) =>
  TASK_STATUSES.find((s) => s.value === status)?.color || '#64748b';

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
};

export const isDueToday = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  const today = new Date();
  const due = new Date(dueDate);
  return (
    due.getDate() === today.getDate() &&
    due.getMonth() === today.getMonth() &&
    due.getFullYear() === today.getFullYear()
  );
};

export const getInitials = (name, surname) =>
  `${name?.[0] || ''}${surname?.[0] || ''}`.toUpperCase();

export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http')) return avatarUrl;
  return avatarUrl;
};
