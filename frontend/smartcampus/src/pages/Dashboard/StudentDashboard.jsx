import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardPages.css';

function StudentDashboard() {
  const { user } = useAuth();

  const actions = [
    {
      to: '/bookings',
      title: 'My Bookings',
      desc: 'View your current and past booking requests.',
    },
    {
      to: '/create',
      title: 'Create Booking',
      desc: 'Reserve campus facilities with approval workflow.',
    },
    {
      to: '/tickets/my',
      title: 'My Tickets',
      desc: 'Track maintenance and support requests.',
    },
    {
      to: '/notifications',
      title: 'Notifications',
      desc: 'See booking and ticket updates in one feed.',
    },
    {
      to: '/account/settings',
      title: 'Profile Settings',
      desc: 'Edit your profile and notification preferences.',
    },
  ];

  return (
    <section className="role-dashboard sc-container">
      <header className="role-hero">
        <span className="role-badge">Student Dashboard</span>
        <h1>Welcome, {user?.name || 'Student'}</h1>
        <p>
          Manage your campus activity from one place, including reservations,
          support tickets, and account preferences.
        </p>
      </header>

      <div className="dashboard-stats">
        <article className="dashboard-stat-card">
          <p>Account Role</p>
          <h3>Student</h3>
        </article>
        <article className="dashboard-stat-card">
          <p>Status</p>
          <h3>Active</h3>
        </article>
        <article className="dashboard-stat-card">
          <p>Notifications</p>
          <h3>{user?.notificationsEnabled ? 'On' : 'Off'}</h3>
        </article>
      </div>

      <div className="dashboard-grid">
        {actions.map((item) => (
          <Link to={item.to} key={item.to} className="dashboard-action">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span>Open</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default StudentDashboard;
