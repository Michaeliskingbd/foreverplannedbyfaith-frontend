import { useState } from 'react';
import './AdminDashboard.css';

interface RsvpData {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  willAttend: boolean;
  numberOfAttendees: number;
  message?: string;
  reasonForNotAttending?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://foreverplannedbyfaith-backend.onrender.com';
      const response = await fetch(`${API_URL}/api/rsvp`, {
        headers: {
          'Authorization': `Bearer ${passcode}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setRsvps(data.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch occasionally or add a refresh button
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://foreverplannedbyfaith-backend.onrender.com';
      const response = await fetch(`${API_URL}/api/rsvp`, {
        headers: {
          'Authorization': `Bearer ${passcode}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRsvps(data.data);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <h2>Admin Access</h2>
          {error && <p className="admin-error">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Summary stats
  const totalRsvps = rsvps.length;
  const totalAttending = rsvps.filter(r => r.willAttend).reduce((acc, curr) => acc + curr.numberOfAttendees, 0);
  const totalDeclined = rsvps.filter(r => !r.willAttend).length;

  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-header">
        <h1>Reservations Dashboard</h1>
        <div className="admin-actions">
          <button onClick={handleRefresh} className="btn-secondary">Refresh Data</button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-secondary">Logout</button>
        </div>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Submissions</h3>
          <p>{totalRsvps}</p>
        </div>
        <div className="stat-card attending">
          <h3>Total Guests Attending</h3>
          <p>{totalAttending}</p>
        </div>
        <div className="stat-card declined">
          <h3>Regretfully Declined</h3>
          <p>{totalDeclined}</p>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Attending</th>
              <th>Guests</th>
              <th>Reason/Message</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp._id}>
                <td>{new Date(rsvp.createdAt).toLocaleDateString()}</td>
                <td><strong>{rsvp.fullName}</strong></td>
                <td>{rsvp.phoneNumber}</td>
                <td>{rsvp.email || '-'}</td>
                <td>
                  <span className={`status-badge ${rsvp.willAttend ? 'yes' : 'no'}`}>
                    {rsvp.willAttend ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{rsvp.willAttend ? rsvp.numberOfAttendees : '-'}</td>
                <td className="message-cell">
                  {!rsvp.willAttend && rsvp.reasonForNotAttending && (
                    <div><strong>Reason:</strong> {rsvp.reasonForNotAttending}</div>
                  )}
                  {rsvp.message && (
                    <div><strong>Msg:</strong> {rsvp.message}</div>
                  )}
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-state">No RSVPs received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
