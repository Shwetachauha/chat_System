import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    subtle?: string;
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: 3,
          },
        },
        '*': {
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: 3,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#f1f5f9',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: '#e2e8f0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              borderWidth: 1.5,
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.14)',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '4px 0 24px rgb(0 0 0 / 0.08)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 20px 40px rgb(0 0 0 / 0.12)',
          border: '1px solid #f1f5f9',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 25px 50px rgb(0 0 0 / 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: 10,
          minWidth: 18,
          height: 18,
          borderRadius: 9,
        },
      },
    },
  },
});
