import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const Sidebar = ({ mobileOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const items = [
    ...(isAdmin
      ? [{ label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' }]
      : []),
    { label: 'Projeler', icon: FolderIcon, path: '/projects' },
    { label: 'Profil', icon: PersonIcon, path: '/profile' },
  ];

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2 }}>
        <TaskAltIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={700} color="primary">
          TaskFlow
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => handleNav(item.path)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon>
                <Icon color={active ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
