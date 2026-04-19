import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import RoleDashboardLayout from './RoleDashboardLayout';

function TechnicianDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalAssigned: 0,
    openCount: 0,
    inProgressCount: 0,
    resolvedTodayCount: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const res = await API.get(`/tickets/technician/${user.id}/summary`);
        setSummary({
          totalAssigned: res.data?.totalAssigned || 0,
          openCount: res.data?.openCount || 0,
          inProgressCount: res.data?.inProgressCount || 0,
          resolvedTodayCount: res.data?.resolvedTodayCount || 0,
        });
      } catch (error) {
        console.error('Failed to load technician summary:', error);
      }
    };

    fetchSummary();
  }, [user?.id]);

  const stats = [
    { label: 'Total Assigned Tickets', value: summary.totalAssigned },
    { label: 'Open Tickets', value: summary.openCount },
    { label: 'In Progress', value: summary.inProgressCount },
    { label: 'Resolved Today', value: summary.resolvedTodayCount },
  ];

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
    <RoleDashboardLayout
      badge="Technician Dashboard"
      heading={`Welcome, ${user?.name || 'Technician'}`}
      description="Monitor assigned maintenance work, update ticket progress, and stay notified about operational changes."
      stats={stats}
      actions={actions}
    />
  );
}

export default TechnicianDashboard;
