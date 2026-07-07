import { useState } from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box flex={1} display="flex" flexDirection="column" minWidth={0}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <Box component="main" flex={1} py={3} px={isMobile ? 2 : 3}>
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
