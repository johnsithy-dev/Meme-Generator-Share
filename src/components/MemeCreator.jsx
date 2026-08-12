import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { postMeme } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

const MAX_DIM = 700;

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

export default function MemeCreator() {
  const { user, profile } = useAuth();
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(42);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState({ msg: '', kind: '' });

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, topText, bottomText, fontSize, fillColor]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setStatus({ msg: '', kind: '' });
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.onerror = () => setStatus({ msg: 'Could not read that image file.', kind: 'err' });
      img.src = ev.target.result;
    };
    reader.onerror = () => setStatus({ msg: 'Could not read that file.', kind: 'err' });
    reader.readAsDataURL(file);
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');

    let w = image.width;
    let h = image.height;
    if (w > MAX_DIM || h > MAX_DIM) {
      const scale = MAX_DIM / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(image, 0, 0, w, h);

    const size = Math.max(16, Math.min(w / 6, fontSize));
    ctx.textAlign = 'center';
    ctx.font = `900 ${size}px 'Arial Black', Impact, sans-serif`;
    ctx.lineWidth = Math.max(2, size / 12);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = fillColor;
    ctx.lineJoin = 'round';

    const top = topText.toUpperCase();
    const bottom = bottomText.toUpperCase();

    if (top) {
      const lines = wrapLines(ctx, top, w * 0.92);
      let y = size + 8;
      lines.forEach((line) => {
        ctx.strokeText(line, w / 2, y);
        ctx.fillText(line, w / 2, y);
        y += size * 1.05;
      });
    }
    if (bottom) {
      const lines = wrapLines(ctx, bottom, w * 0.92);
      let y = h - 14 - (lines.length - 1) * size * 1.05;
      lines.forEach((line) => {
        ctx.strokeText(line, w / 2, y);
        ctx.fillText(line, w / 2, y);
        y += size * 1.05;
      });
    }
  }

  function handleDownload() {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  async function handlePost() {
    if (!image || !user) return;
    setPosting(true);
    setStatus({ msg: 'Posting…', kind: '' });
    try {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);
      await postMeme({
        dataUrl,
        top: topText,
        bottom: bottomText,
        author: profile?.displayName || user.email,
        authorId: user.uid,
      });
      setStatus({ msg: 'Posted! Check the Gallery tab.', kind: 'ok' });
    } catch (err) {
      console.error(err);
      setStatus({ msg: err.message || 'Something went wrong posting this meme.', kind: 'err' });
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="ma-card ma-create-grid">
      <div>
        <div className="ma-canvas-frame">
          {!image && <div className="ma-empty">no image yet<br />upload one on the right &rarr;</div>}
          <canvas ref={canvasRef} className={image ? '' : 'ma-hidden'} />
        </div>
        <div className="ma-btn-row">
          <button className="ma-btn ghost" onClick={handleDownload} disabled={!image}>
            Download PNG
          </button>
        </div>
      </div>

      <div>
        <div className="ma-field">
          <span className="ma-label">01 / Image</span>
          <label className="ma-file-btn">
            Choose file
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>
        </div>

        <div className="ma-field">
          <span className="ma-label">02 / Top text</span>
          <input
            className="ma-input"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="TOP TEXT"
            maxLength={80}
          />
        </div>

        <div className="ma-field">
          <span className="ma-label">03 / Bottom text</span>
          <input
            className="ma-input"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="BOTTOM TEXT"
            maxLength={80}
          />
        </div>

        <div className="ma-row ma-field">
          <div>
            <span className="ma-label">Text size</span>
            <input
              className="ma-input"
              type="range"
              min={20}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
          <div>
            <span className="ma-label">Fill color</span>
            <input
              className="ma-input"
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              style={{ height: 42, padding: 2 }}
            />
          </div>
        </div>

        {user ? (
          <div className="ma-btn-row">
            <button className="ma-btn primary" onClick={handlePost} disabled={!image || posting}>
              {posting ? 'Posting…' : 'Post to Gallery'}
            </button>
          </div>
        ) : (
          <div className="ma-status" style={{ fontSize: 13 }}>
            <Link to="/login">Log in</Link> to post your meme to the gallery.
          </div>
        )}
        <div className={`ma-status ${status.kind}`}>{status.msg}</div>
      </div>
    </div>
  );
}
