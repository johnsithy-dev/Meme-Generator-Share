# Meme Generator + Share

Upload an image, add top/bottom text with an HTML canvas, and post the result
to a public gallery. Built with React, Firebase Authentication, and Firestore.

## Pages / Scope

**Website**
- Home, About, Contact (static info pages)
- Create — upload image, add text overlay, download or post
- Gallery — public wall showing every meme posted by any user
- Admin dashboard — authentication-gated, full CRUD (edit captions, delete memes)

**Auth**
- Register (email/password)
- Log in
- Forgot / reset password
- Roles: every new account is `role: "user"` by default. To make an account
  an admin, open Firestore in the Firebase console, find that user's
  document in the `users` collection, and change `role` to `"admin"` by hand.

## Tech stack
- React 18 + Vite + React Router
- Firebase Authentication (email/password)
- Firebase Firestore (memes + user profiles/roles)
- No Firebase Storage — images are stored as compressed data URLs directly
  inside Firestore documents, since Storage now requires the paid Blaze plan
  and Firestore stays free on Spark.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Firebase project setup** (in the Firebase console)
   - Build > Authentication > Sign-in method > enable **Email/Password**
   - Build > Firestore Database > Create database > **test mode**
   - Project settings > Your apps > register a Web app to get your config

3. **Environment variables**
   ```bash
   cp .env.example .env
   ```
   Paste your Firebase config values into `.env`. (`.env` is gitignored —
   your real keys never get pushed to GitHub. Whoever clones this repo
   needs to create their own `.env` from `.env.example`.)

4. **Run it**
   ```bash
   npm run dev
   ```

5. **Make yourself an admin** (optional, to see the Admin dashboard)
   - Register an account in the running app
   - In Firebase console > Firestore Database > `users` collection, find
     your user document (matches your Firebase Auth UID) and change
     `role` from `"user"` to `"admin"`
   - Refresh the app — an "Admin" tab will appear in the nav

## Project structure
```
meme-app/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx                  # routes
    ├── firebase.js               # Auth + Firestore CRUD helpers
    ├── index.css
    ├── context/
    │   └── AuthContext.jsx       # tracks signed-in user + role
    ├── components/
    │   ├── Nav.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── MemeCreator.jsx
    │   └── Gallery.jsx
    └── pages/
        ├── Home.jsx
        ├── About.jsx
        ├── Contact.jsx
        ├── Login.jsx
        ├── Register.jsx
        ├── ForgotPassword.jsx
        └── AdminDashboard.jsx    # CRUD: edit captions, delete memes
```

## Notes for grading
- Firestore security rules are in test mode (open read/write) for ease of
  development — before any real deployment, rules should be tightened so
  only authenticated users can write and only admins can delete.
- "CRUD operation" is implemented on the `memes` collection: Create (post a
  meme), Read (gallery + admin table), Update (edit captions in Admin),
  Delete (remove in Admin).
