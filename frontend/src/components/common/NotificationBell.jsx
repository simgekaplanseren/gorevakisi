import { useEffect, useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { dashboardApi } from '../../api/dashboardApi';
import { formatDate } from '../../utils/helpers';

const iconMap = {
  overdue: WarningAmberIcon,
  due_today: TodayIcon,
  upcoming: ScheduleIcon,
};

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getNotifications();
        setNotifications(data || []);
      } catch {
        setNotifications([]);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
        <Badge badgeContent={notifications.length} color="error" max={9}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { width: 340, maxHeight: 400 } }}
      >
        <Box px={2} py={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Bildirimler
          </Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="Bildirim yok" />
          </MenuItem>
        ) : (
          notifications.map((n, i) => {
            const Icon = iconMap[n.type] || ScheduleIcon;
            return (
              <MenuItem key={i} onClick={() => setAnchorEl(null)}>
                <ListItemIcon>
                  <Icon fontSize="small" color={n.type === 'overdue' ? 'error' : 'primary'} />
                </ListItemIcon>
                <ListItemText
                  primary={n.message}
                  secondary={n.dueDate ? formatDate(n.dueDate) : ''}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
