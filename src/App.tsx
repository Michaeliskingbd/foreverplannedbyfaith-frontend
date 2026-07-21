import { useState } from 'react';
import RsvpModal from './components/RsvpModal';
import './App.css'

function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  return (
    <div className="page-wrapper">
      <div 
        className={`envelope-wrapper ${isEnvelopeOpened ? 'open' : ''}`} 
      >
        <div className="envelope-back"></div>
        
        <div className="envelope-flaps">
          <div className="flap left-flap"></div>
          <div className="flap right-flap"></div>
          <div className="flap bottom-flap"></div>
          <div className="flap top-flap">
            <div className="envelope-seal" onClick={(e) => { e.stopPropagation(); setIsEnvelopeOpened(true); }}>Click Me</div>
          </div>
        </div>
        
        <div className="invitation-card">
        {/* ── Invitation text ── */}
        <div className="invitation-content">
          <p className="together-families">Together with their families</p>

          <p className="name-script bride">Kehinde Aladejuyigbe</p>

          <p className="ampersand">weds</p>

          <p className="name-script groom">Faith Ukachukwu</p>

          <p className="body-copy invite-line">
            Join us as we celebrate our civil wedding
            <br />
            and the beginning of our forever.
          </p>

          <p className="body-copy date-line">
           <strong>Date:</strong> 22nd of August, 2026
          </p>
          <p className="body-copy date-line">
           <strong>Time:</strong> 12pm
          </p>

          <p className="body-copy venue-line">
           <strong>Reception Venue:</strong> <strong>Norton Methodist Church Hall,</strong>
             {" "} <strong>Norton Road</strong>, <strong>Stockton-on-Tees</strong>, <strong>TS20 2QQ</strong>
          </p>

          <p className="body-copy quote-line">
            " A love rooted in faith, strengthened by grace and sealed forever"
          </p>
          <p className="body-copy hashtag-line">#ForeverplannedbyFaith#</p>

          <div className="rsvp-divider" />

          <div className="rsvp-block">
            <button className="rsvp-online-btn" onClick={() => setIsRsvpOpen(true)}>
              RSVP Online
            </button>
            <p className="rsvp-line">
              <span className="rsvp-name">Toyosi</span>
              <a className="rsvp-number" href="tel:07448882026">07448 882 026</a>
            </p>
            <p className="rsvp-line">
              <span className="rsvp-name">Emmanuel</span>
              <a className="rsvp-number" href="tel:07769497533">07769 497 533</a>
            </p>
          </div>
        </div>
      </div>
      
      </div>

      <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />
    </div>
  )
}

export default App
