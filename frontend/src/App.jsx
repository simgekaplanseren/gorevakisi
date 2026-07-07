import { AuthProvider } from './context/AuthContext';
import { AppThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <AppThemeProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </AppThemeProvider>
);

export default App;
