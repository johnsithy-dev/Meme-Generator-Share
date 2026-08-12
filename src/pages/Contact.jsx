import React, { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="ma-card">
      <h2 className="ma-gallery-title" style={{ fontSize: 28, marginBottom: 12 }}>
        Contact
      </h2>

      {sent ? (
        <div className="ma-status ok" style={{ fontSize: 14 }}>
          Thanks{name ? `, ${name}` : ''} — your message has been noted.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
          <div className="ma-field">
            <span className="ma-label">Your name</span>
            <input className="ma-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="ma-field">
            <span className="ma-label">Message</span>
            <textarea
              className="ma-input"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button className="ma-btn primary" type="submit">Send</button>
        </form>
      )}
    </div>
  );
}
