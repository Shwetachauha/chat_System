import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from '@/store';
import { theme } from '@/theme';
import { router } from '@/routes';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastContainer } from '@/components/common/Toast';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <RouterProvider router={router} />
          <ToastContainer />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
