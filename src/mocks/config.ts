/**
 * Mock mode configuration.
 * Set VITE_MOCK_MODE=true in .env to enable UI preview without a backend.
 */
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';
