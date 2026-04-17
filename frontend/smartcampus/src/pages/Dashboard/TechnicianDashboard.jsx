import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardPages.css';

function TechnicianDashboard() {
  const { user } = useAuth();

  const actions = [
    {
      to: '/tickets/technician',
      title: 'Assigned Tickets',
      desc: 'Review all maintenance tickets assigned to you.',
    },
    {
      to: '/notifications',
      title: 'Notifications',
      desc: 'Check assignment updates and ticket alerts.',
    },
    {
      to: '/account/settings',
      title: 'Profile Settings',
      desc: 'Maintain your profile and notification preferences.',
    },
  ];

  return (
    <section className="role-dashboard sc-container">
      <header className="role-hero">
        <span className="role-badge">Technician Dashboard</span>
        <h1>Hello, {user?.name || 'Technician'}</h1>
        <p>
          Monitor assigned maintenance work, update ticket progress, and stay
          notified about operational changes.
        </p>
      </header>

      <div className="dashboard-stats">
        <article className="dashboard-stat-card">
          <p>Account Role</p>
          <h3>Technician</h3>
        </article>
        <article className="dashboard-stat-card">
          <p>Status</p>
          <h3>On Duty</h3>
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

export default TechnicianDashboard;
