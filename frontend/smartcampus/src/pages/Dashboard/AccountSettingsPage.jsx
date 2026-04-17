import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './DashboardPages.css';

function AccountSettingsPage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', profilePicture: '', notificationsEnabled: true });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      profilePicture: user.profilePicture || '',
      notificationsEnabled: Boolean(user.notificationsEnabled),
    });
  }, [user]);

  const setMessage = (type, message) => {
    setFeedback({ type, message });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage('', '');

    try {
      const updatedUser = await authService.updateProfile({
        name: form.name,
        profilePicture: form.profilePicture,
      });
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

              <div className="account-field">
                <label htmlFor="profilePicture">Profile Picture URL</label>
                <input
                  id="profilePicture"
                  type="url"
                  value={form.profilePicture}
                  onChange={(e) => setForm((prev) => ({ ...prev, profilePicture: e.target.value }))}
                  placeholder="https://example.com/photo.png"
                />
              </div>
            </div>

            <div className="account-actions">
              <button className="account-btn primary" type="submit" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
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
      </div>
    </section>
  );
}

export default AccountSettingsPage;
