import React from 'react';

export default function About() {
  return (
    <div className="ma-card">
      <h2 className="ma-gallery-title" style={{ fontSize: 28, marginBottom: 12 }}>
        About
      </h2>
      <p style={{ fontFamily: 'Courier New, monospace', fontSize: 14, lineHeight: 1.6, maxWidth: 560 }}>
        This project was built as a school assignment to practice full-stack development:
        a React front end for the image editor and gallery, paired with Firebase Authentication
        and Firestore on the back end for accounts, storage, and CRUD operations.
      </p>
      <p style={{ fontFamily: 'Courier New, monospace', fontSize: 14, lineHeight: 1.6, maxWidth: 560, marginTop: 12 }}>
        Anyone can browse the public gallery. Signing in lets you post your own memes, and
        admin accounts can moderate everything from the Admin dashboard.
      </p>
    </div>
  );
}
