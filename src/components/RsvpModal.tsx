import { useState } from 'react';
import './RsvpModal.css';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    willAttend: 'yes',
    numberOfAttendees: 1,
    message: '',
    reasonForNotAttending: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Allow only numbers
      value = value.replace(/\D/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        willAttend: formData.willAttend === 'yes',
      };

      const response = await fetch('http://localhost:5000/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      // Optional: reset form or auto-close after success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rsvp-modal-overlay">
      <div className="rsvp-modal">
        <button className="rsvp-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        {success ? (
          <div className="rsvp-success">
            <h2>Thank You!</h2>
            <p>Your RSVP has been successfully submitted.</p>
            <p>We look forward to celebrating with you.</p>
            <button className="rsvp-button" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 className="rsvp-modal-title">RSVP</h2>
            <p className="rsvp-modal-subtitle">Kindly respond to celebrate with us</p>
            
            {error && <div className="rsvp-error">{error}</div>}

            <form onSubmit={handleSubmit} className="rsvp-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John & Jane Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. 07448882026"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Will you attend? *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="willAttend"
                      value="yes"
                      checked={formData.willAttend === 'yes'}
                      onChange={handleChange}
                    />
                    Joyfully Accept
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="willAttend"
                      value="no"
                      checked={formData.willAttend === 'no'}
                      onChange={handleChange}
                    />
                    Regretfully Decline
                  </label>
                </div>
              </div>

              {formData.willAttend === 'yes' && (
                <div className="form-group fade-in">
                  <label htmlFor="numberOfAttendees">Number of Attendees *</label>
                  <input
                    type="number"
                    id="numberOfAttendees"
                    name="numberOfAttendees"
                    min="1"
                    max="10"
                    required
                    value={formData.numberOfAttendees}
                    onChange={handleChange}
                  />
                </div>
              )}

              {formData.willAttend === 'no' && (
                <div className="form-group fade-in">
                  <label htmlFor="reasonForNotAttending">Reason (optional)</label>
                  <input
                    type="text"
                    id="reasonForNotAttending"
                    name="reasonForNotAttending"
                    value={formData.reasonForNotAttending}
                    onChange={handleChange}
                    placeholder="We'll miss you!"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="message">Message for the couple (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="rsvp-button submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Send RSVP'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
