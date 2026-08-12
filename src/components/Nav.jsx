import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { logoutUser } from '../firebase.js';

export default function Nav() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutUser();
    setMenuOpen(false);
    navigate('/');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="ma-hero">
      <div className="ma-hero-top">
        <div>
          <h1 className="ma-title">
            <span>Meme</span>
            <br />
            Generator
          </h1>
          <p className="ma-tagline">
            // upload an image, caption it, ship it to the public wall.
          </p>
        </div>

        <div className="ma-hero-right">
          {user ? (
            <button className="ma-tab ma-auth-btn" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <NavLink to="/login" onClick={closeMenu} className="ma-tab ma-auth-btn">
              Log in
            </NavLink>
          )}

          <button
            className="ma-hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <nav className={`ma-tabs ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `ma-tab ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/create" onClick={closeMenu} className={({ isActive }) => `ma-tab ${isActive ? 'active' : ''}`}>
          Create
        </NavLink>
        <NavLink to="/gallery" onClick={closeMenu} className={({ isActive }) => `ma-tab ${isActive ? 'active' : ''}`}>
          Gallery
        </NavLink>
        <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `ma-tab ${isActive ? 'active' : ''}`}>
          About
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `ma-tab ${isActive ? 'active' : ''}`}>
          Contact
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => `ma-tab ${isActive ? 'active' : ''}`}>
            Admin
          </NavLink>
        )}
      </nav>
    </header>
  );
}