import { useEffect } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { removeToast } from '@/store/slices/uiSlice';

export function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  return (
    <Stack spacing={1} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {toasts.map((toast) => (
        <Snackbar key={toast.id} open anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert
            severity={toast.type}
            onClose={() => dispatch(removeToast(toast.id))}
            variant="filled"
            sx={{ minWidth: 280 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
