import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './DashboardPages.css';

function AccountSettingsPage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    technicianSpecialty: 'GENERAL',
    notificationsEnabled: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: user.name || '',
      technicianSpecialty: user.technicianSpecialty || 'GENERAL',
      notificationsEnabled: Boolean(user.notificationsEnabled),
    }));
  }, [user]);

  const isGoogleAccount = String(user?.provider || '').toUpperCase() === 'GOOGLE';

  const technicianSpecialtyOptions = [
    'GENERAL',
    'PLUMBING',
    'ELECTRICAL',
    'IT_SUPPORT',
    'HVAC',
    'CARPENTRY',
    'CLEANING',
    'OTHER',
  ];

  const setMessage = (type, message) => {
    setFeedback({ type, message });
  };

  const formatMemberSince = (dateValue) => {
    if (!dateValue) return 'N/A';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatProvider = (provider) => {
    if (!provider) return 'Local';
    return provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage('', '');

    try {
      const payload = {
        name: form.name,
        profilePicture: user?.profilePicture ?? '',
      };

      if (user?.role === 'TECHNICIAN') {
        payload.technicianSpecialty = form.technicianSpecialty;
      }

      const updatedUser = await authService.updateProfile(payload);
      setUser(updatedUser);
      setMessage('success', 'Profile updated successfully.');
    } catch (err) {
      const fallback = 'Failed to update profile.';
      setMessage('error', err.response?.data?.message || fallback);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNotificationSave = async () => {
    setSavingPrefs(true);
    setMessage('', '');

    try {
      const updatedUser = await authService.updateNotificationSettings({
        notificationsEnabled: form.notificationsEnabled,
      });
      setUser(updatedUser);
      setMessage('success', 'Notification settings updated.');
    } catch (err) {
      const fallback = 'Failed to update notification settings.';
      setMessage('error', err.response?.data?.message || fallback);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('', '');

    if (isGoogleAccount) {
      setMessage('error', 'Google sign-in accounts cannot change password here.');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage('error', 'All password fields are required.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage('error', 'New password must be at least 8 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('error', 'New password and confirmation do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      const response = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setMessage('success', response?.message || 'Password updated successfully.');
    } catch (err) {
      setMessage('error', err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <section className="sc-container">
      <div className="account-settings-shell">
        {feedback.message && (
          <div className={`account-alert ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <article className="account-card">
          <h2>Profile Settings</h2>
          <p className="account-subtext">Keep your account details up to date.</p>

          <form onSubmit={handleProfileSubmit}>
            <div className="account-grid">
              <div className="account-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {user?.role === 'TECHNICIAN' && (
                <div className="account-field">
                  <label htmlFor="technicianSpecialty">Technician Specialty</label>
                  <select
                    id="technicianSpecialty"
                    value={form.technicianSpecialty}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, technicianSpecialty: e.target.value }))
                    }
                  >
                    {technicianSpecialtyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="account-actions">
              <button className="account-btn primary" type="submit" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </article>

        <article className="account-card">
          <h2>Account Information</h2>
          <p className="account-subtext">View your account metadata and sign-in details.</p>

          <div className="account-info-grid">
            <div className="account-info-item">
              <p className="account-info-label">Role</p>
              <p className="account-info-value">{user?.role || 'N/A'}</p>
            </div>

            <div className="account-info-item">
              <p className="account-info-label">Email</p>
              <p className="account-info-value">{user?.email || 'N/A'}</p>
            </div>

            <div className="account-info-item">
              <p className="account-info-label">Provider</p>
              <p className="account-info-value">{formatProvider(user?.provider)}</p>
            </div>

            <div className="account-info-item">
              <p className="account-info-label">Member Since</p>
              <p className="account-info-value">{formatMemberSince(user?.createdAt)}</p>
            </div>
          </div>
        </article>

        <article className="account-card">
          <h2>Notification Settings</h2>
          <p className="account-subtext">Control whether you receive in-app notifications.</p>

          <div className="account-toggle">
            <div>
              <strong>Enable notifications</strong>
              <p className="account-subtext" style={{ margin: '0.3rem 0 0' }}>
                Receive booking, ticket, and role update alerts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.notificationsEnabled}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notificationsEnabled: e.target.checked }))
              }
              aria-label="Enable notifications"
            />
          </div>

          <div className="account-actions">
            <button className="account-btn primary" type="button" onClick={handleNotificationSave} disabled={savingPrefs}>
              {savingPrefs ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </article>

        <article className="account-card">
          <h2>Security</h2>
          <p className="account-subtext">Change your account password.</p>

          {isGoogleAccount ? (
            <p className="account-subtext" style={{ marginBottom: 0 }}>
              You are signed in with Google. Password updates are managed by your Google account.
            </p>
          ) : (
            <form onSubmit={handlePasswordChange}>
              <div className="account-grid">
                <div className="account-field">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="account-field">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="account-field">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    minLength={8}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="account-actions">
                <button className="account-btn primary" type="submit" disabled={savingPassword}>
                  {savingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </article>
      </div>
    </section>
  );
}

export default AccountSettingsPage;
