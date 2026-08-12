// Firebase setup.
// Fill in your own project's keys in the .env file at the project root.
//
// This version does NOT use Firebase Storage (it now requires the paid
// Blaze plan). Meme images are saved directly inside Firestore documents,
// which stays free on the Spark plan.
//
// Enable these in the Firebase console before running the app:
//   Build > Authentication > Sign-in method > Email/Password (enable it)
//   Build > Firestore Database > Create database (test mode)

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const MAX_IMAGE_BYTES = 900_000; // stay under Firestore's 1MiB document limit

// ---------------- AUTH ----------------

/**
 * Registers a new account and creates a matching Firestore user profile
 * with a default "user" role. To make an account an admin, open Firestore
 * in the Firebase console, find that user's document in the "users"
 * collection, and change role to "admin" by hand.
 */
export async function registerUser({ email, password, displayName }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    email,
    displayName: displayName || email.split('@')[0],
    role: 'user',
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/** Subscribes to auth state changes. Returns an unsubscribe function. */
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Fetches the Firestore profile (including role) for a signed-in user. */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// ---------------- MEMES (CRUD) ----------------

/** Create: saves a meme (image + captions + author) as one Firestore document. */
export async function postMeme({ dataUrl, top, bottom, author, authorId }) {
  if (dataUrl.length > MAX_IMAGE_BYTES) {
    throw new Error('Image is too large. Try a smaller source image.');
  }
  await addDoc(collection(db, 'memes'), {
    imageUrl: dataUrl,
    top: top || '',
    bottom: bottom || '',
    author: author || 'anonymous',
    authorId: authorId || null,
    createdAt: serverTimestamp(),
  });
}

/** Read: fetches all memes, newest first. */
export async function fetchMemes() {
  const q = query(collection(db, 'memes'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Read: fetches only memes posted by one user (for their own dashboard view). */
export async function fetchMemesByUser(uid) {
  const q = query(
    collection(db, 'memes'),
    where('authorId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Update: edits a meme's top/bottom captions. */
export async function updateMeme(memeId, { top, bottom }) {
  await updateDoc(doc(db, 'memes', memeId), { top, bottom });
}

/** Delete: removes a meme document. */
export async function deleteMeme(memeId) {
  await deleteDoc(doc(db, 'memes', memeId));
}
