import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ minHeight = 200 }) => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight={minHeight}>
    <CircularProgress size={36} />
  </Box>
);

export default LoadingSpinner;
