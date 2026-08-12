import React, { useEffect, useState } from 'react';
import { fetchMemes } from '../firebase.js';

export default function Gallery() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMemes();
      setMemes(data);
    } catch (err) {
      console.error(err);
      setError('Could not load the gallery right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ma-card">
      <div className="ma-gallery-head">
        <h2 className="ma-gallery-title">The Wall</h2>
        <span className="ma-gallery-note">shared &middot; visible to everyone</span>
      </div>

      {loading && <div className="ma-loading">loading memes&hellip;</div>}

      {!loading && error && <div className="ma-emptystate">{error}</div>}

      {!loading && !error && memes.length === 0 && (
        <div className="ma-emptystate">The wall is empty. Be the first to post a meme.</div>
      )}

      {!loading && !error && memes.length > 0 && (
        <div className="ma-grid">
          {memes.map((meme) => (
            <div className="ma-sticker" key={meme.id}>
              <img src={meme.imageUrl} alt={[meme.top, meme.bottom].filter(Boolean).join(' / ') || 'meme'} />
              <div className="ma-sticker-meta">
                <span className="ma-sticker-author">@{meme.author || 'anonymous'}</span>
                <span>
                  {meme.createdAt?.toDate ? meme.createdAt.toDate().toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
