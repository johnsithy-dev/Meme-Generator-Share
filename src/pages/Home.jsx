import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="ma-card">
      <h2 className="ma-gallery-title" style={{ fontSize: 28, marginBottom: 12 }}>
        Welcome
      </h2>
      <p style={{ fontFamily: 'Courier New, monospace', fontSize: 14, lineHeight: 1.6, maxWidth: 560 }}>
        Meme Generator + Share is a simple tool for turning any picture into a classic
        top/bottom-text meme, then posting it to a public wall for everyone to see.
      </p>
      <div className="ma-btn-row" style={{ marginTop: 20 }}>
        <Link to="/create" className="ma-btn primary">Start creating</Link>
        <Link to="/gallery" className="ma-btn ghost">View gallery</Link>
      </div>
    </div>
  );
}
