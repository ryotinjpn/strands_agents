import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff4757', // Bright red
      light: '#ff6b7a',
      dark: '#e84357',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff3838', // Coral red
      light: '#ff6b66',
      dark: '#d63031',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff3838',
      light: '#ff6b66',
      dark: '#d63031',
    },
    warning: {
      main: '#fdcb6e',
      light: '#fed7aa',
      dark: '#e17055',
    },
    info: {
      main: '#74b9ff',
      light: '#a8d1ff',
      dark: '#0984e3',
    },
    success: {
      main: '#00b894',
      light: '#55efc4',
      dark: '#00a085',
    },
    background: {
      default: '#fef7f7', // Very light red/pink
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3436',
      secondary: '#636e72',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#ff4757',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#ff4757',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#ff4757',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#2d3436',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #ff4757 30%, #ff6b7a 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #e84357 30%, #ff5569 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(255, 71, 87, 0.1)',
          border: '1px solid rgba(255, 71, 87, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255, 71, 87, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#ff6b7a',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff4757',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #ff4757 30%, #ff6b7a 90%)',
          boxShadow: '0 2px 12px rgba(255, 71, 87, 0.2)',
        },
      },
    },
  },
});