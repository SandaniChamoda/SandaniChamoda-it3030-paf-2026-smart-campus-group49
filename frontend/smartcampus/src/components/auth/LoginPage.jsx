import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

function LoginPage() {
  const { login, loginWithEmail, getRoleDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const successMessage = location.state?.message || '';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const authData = await loginWithEmail(form);
      navigate(getRoleDashboardPath(authData?.user?.role), { replace: true });
    } catch (err) {
      const fallback = 'Unable to sign in. Check your credentials and try again.';
      setError(err.response?.data?.message || fallback);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-badge">SmartCampus</div>
        <div className="auth-logo-wrap">
          <span className="auth-logo-icon">🏫</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue to your campus workspace.</p>

  {successMessage && <div className="auth-alert auth-alert-success">{successMessage}</div>}
        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            placeholder="you@campus.edu"
            required
          />

          <label className="auth-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            placeholder="Enter your password"
            required
          />

          <label className="auth-label" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="auth-input"
            required
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="TECHNICIAN">TECHNICIAN</option>
          </select>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <button onClick={login} className="auth-google-btn" type="button">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="auth-google-icon"
          />
          Sign in with Google
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
