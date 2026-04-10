import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏫</span>
        </div>
        <h1 style={styles.title}>Smart Campus</h1>
        <p style={styles.subtitle}>Operations Hub</p>
        <p style={styles.description}>
          Manage facility bookings and maintenance requests for your campus.
        </p>
        <button onClick={login} style={styles.googleBtn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={styles.googleIcon}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '48px 40px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logo: {
    marginBottom: '16px',
  },
  logoIcon: {
    fontSize: '64px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '0 0 24px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  description: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 32px',
    lineHeight: '1.6',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 24px',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    background: '#fff',
    color: '#3c4043',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  },
};

export default LoginPage;
