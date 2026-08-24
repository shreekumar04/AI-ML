import { LogLevel, type Configuration, type PopupRequest } from '@azure/msal-browser';

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID ?? 'YOUR_TENANT_ID';
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID ?? 'YOUR_CLIENT_ID';

// Microsoft Entra ID configuration. Replace placeholder environment values before real sign-in.
export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage' },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
      loggerCallback: (_level, message, containsPii) => {
        if (!containsPii) console.debug(message);
      },
    },
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['openid', 'profile', import.meta.env.VITE_AZURE_API_SCOPE ?? 'User.Read'],
};

export const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH !== 'false';
