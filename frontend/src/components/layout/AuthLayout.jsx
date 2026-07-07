import { Box, Paper, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const AuthLayout = ({ title, subtitle, children }) => (
  <Box
    minHeight="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      p: 2,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Box textAlign="center" mb={3}>
        <TaskAltIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Paper>
  </Box>
);

export default AuthLayout;
