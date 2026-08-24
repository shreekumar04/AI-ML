import axios from 'axios';

// Shared Axios client. A request interceptor can later inject an MSAL access token.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  // PLACEHOLDER: set config.headers.Authorization using acquireTokenSilent() in production.
  config.headers['X-Correlation-ID'] = crypto.randomUUID();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Central location for telemetry, standardized errors and 401/403 handling.
    return Promise.reject(error);
  },
);
