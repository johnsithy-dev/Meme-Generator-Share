import React, { useEffect, useState } from 'react';
import { fetchMemes, updateMeme, deleteMeme } from '../firebase.js';

export default function AdminDashboard() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTop, setEditTop] = useState('');
  const [editBottom, setEditBottom] = useState('');
  const [busyId, setBusyId] = useState(null);

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
      setError('Could not load memes.');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(meme) {
    setEditingId(meme.id);
    setEditTop(meme.top || '');
    setEditBottom(meme.bottom || '');
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    setBusyId(id);
    try {
      await updateMeme(id, { top: editTop, bottom: editBottom });
      setMemes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, top: editTop, bottom: editBottom } : m))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError('Could not save changes.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this meme? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteMeme(id);
      setMemes((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      setError('Could not delete this meme.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="ma-card">
      <div className="ma-gallery-head">
        <h2 className="ma-gallery-title">Admin Dashboard</h2>
        <span className="ma-gallery-note">{memes.length} meme{memes.length === 1 ? '' : 's'} total</span>
      </div>

      {loading && <div className="ma-loading">loading&hellip;</div>}
      {!loading && error && <div className="ma-status err">{error}</div>}

      {!loading && memes.length === 0 && (
        <div className="ma-emptystate">No memes have been posted yet.</div>
      )}

      {!loading && memes.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ textAlign: 'left', fontFamily: "'Arial Black', sans-serif", fontSize: 11, textTransform: 'uppercase' }}>
              <th style={{ padding: '8px 6px' }}>Preview</th>
              <th style={{ padding: '8px 6px' }}>Author</th>
              <th style={{ padding: '8px 6px' }}>Captions</th>
              <th style={{ padding: '8px 6px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme) => (
              <tr key={meme.id} style={{ borderTop: '2px solid var(--ink)' }}>
                <td style={{ padding: '10px 6px', width: 90 }}>
                  <img src={meme.imageUrl} alt="" style={{ width: 70, border: '2px solid var(--ink)', display: 'block' }} />
                </td>
                <td style={{ padding: '10px 6px', fontFamily: 'Courier New, monospace', fontSize: 12 }}>
                  @{meme.author || 'anonymous'}
                </td>
                <td style={{ padding: '10px 6px', minWidth: 220 }}>
                  {editingId === meme.id ? (
                    <div>
                      <input
                        className="ma-input"
                        style={{ marginBottom: 6 }}
                        value={editTop}
                        onChange={(e) => setEditTop(e.target.value)}
                        placeholder="Top text"
                      />
                      <input
                        className="ma-input"
                        value={editBottom}
                        onChange={(e) => setEditBottom(e.target.value)}
                        placeholder="Bottom text"
                      />
                    </div>
                  ) : (
                    <span style={{ fontFamily: 'Courier New, monospace', fontSize: 12 }}>
                      {[meme.top, meme.bottom].filter(Boolean).join(' / ') || <em>(no captions)</em>}
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px 6px' }}>
                  {editingId === meme.id ? (
                    <div className="ma-btn-row">
                      <button
                        className="ma-btn primary"
                        onClick={() => saveEdit(meme.id)}
                        disabled={busyId === meme.id}
                      >
                        Save
                      </button>
                      <button className="ma-btn ghost" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="ma-btn-row">
                      <button className="ma-btn ghost" onClick={() => startEdit(meme)}>
                        Edit
                      </button>
                      <button
                        className="ma-btn ghost"
                        onClick={() => handleDelete(meme.id)}
                        disabled={busyId === meme.id}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
