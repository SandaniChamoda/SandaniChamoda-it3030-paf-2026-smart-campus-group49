import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wrapper for routes that require authentication.
 * Optionally enforces a required role (e.g. "ADMIN").
 */
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div style={styles.forbidden}>
        <h2>403 — Forbidden</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0f3460',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  forbidden: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#6c757d',
  },
};

export default ProtectedRoute;
