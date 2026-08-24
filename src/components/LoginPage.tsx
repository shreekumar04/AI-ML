import { useMsal } from '@azure/msal-react';
import { loginRequest, useMockAuth } from '../auth/authConfig';

interface LoginPageProps {
  onMockLogin: () => void;
}

// Separate SSO page. Mock mode is the default so the downloaded project works immediately.
export function LoginPage({ onMockLogin }: LoginPageProps) {
  const { instance } = useMsal();

  const handleLogin = async () => {
    if (useMockAuth) return onMockLogin();
    await instance.loginPopup(loginRequest);
  };

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="brand-block">SERVER LIFECYCLE AI</div>
        <h1>Act before infrastructure risk becomes operational risk.</h1>
        <p>
          Vendor lifecycle evidence, CMDB context and auditable decisions—together in one workspace.
        </p>
      </section>
      <section className="login-card" aria-labelledby="login-title">
        <h2 id="login-title">Welcome back</h2>
        <p>Sign in with your corporate account to continue.</p>
        <button className="btn brand-button w-100" onClick={handleLogin}>
          Sign in with Microsoft
        </button>
        <strong>SSO protected</strong>
        <small>Microsoft Entra ID • MSAL • Conditional Access</small>
        <hr />
        <small>Access is logged and limited by role.</small>
        {useMockAuth && <div className="mock-label">Mock authentication is enabled</div>}
      </section>
    </main>
  );
}
