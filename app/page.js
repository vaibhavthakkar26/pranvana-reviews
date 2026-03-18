'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reflection, setReflection] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', isError: false });

  const photoInputRef = useRef(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const showToast = (msg, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '', isError: false }), 3000);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const submitReview = async () => {
    if (!name.trim() || !reflection.trim() || !email.trim()) {
      showToast('Please fill in your name, email and reflection.', true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', true);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          reflection,
          rating,
          photo
        })
      });

      if (!res.ok) throw new Error('Submission failed');

      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setTotalCount(prev => prev + 1);

      // Reset form
      setName('');
      setEmail('');
      setReflection('');
      setPhoto(null);
      setRating(5);
      if (photoInputRef.current) photoInputRef.current.value = '';

      showToast('Reflection submitted — thank you ✦');
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error('Submit error:', err);
      showToast('Something went wrong. Please try again.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:        #faf8f4;
          --bg2:       #f4f0ea;
          --surface:   #ffffff;
          --card:      #ffffff;
          --border:    #e8e0d4;
          --amber:     #b07d3a;
          --amber-lt:  #c9975a;
          --sand:      #6e5a42;
          --muted:     #a0917f;
          --text:      #3a2e22;
          --soft:      #7a6a56;
        }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          letter-spacing: 0.02em;
        }
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.4rem 3rem;
          display: flex; align-items: center; justify-content: center;
          background: rgba(250,248,244,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.4em;
          color: var(--amber);
          text-transform: uppercase;
        }
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 7rem 2rem 5rem;
          position: relative;
          background: linear-gradient(170deg, #fdf9f3 0%, #f5ede0 60%, #ede0cc 100%);
          overflow: hidden;
        }
        .hero::before, .hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(176,125,58,0.12);
          pointer-events: none;
        }
        .hero::before { width: 600px; height: 600px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .hero::after  { width: 900px; height: 900px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .hero-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 1.8rem;
          animation: fadeUp 0.9s ease 0.2s forwards;
        }
        .hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 10vw, 7.5rem);
          font-weight: 300;
          line-height: 1;
          color: var(--text);
          letter-spacing: 0.06em;
          animation: fadeUp 1.1s ease 0.35s forwards;
        }
        .hero h1 em { font-style: italic; color: var(--amber-lt); }
        .hero-sub {
          margin-top: 2rem;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: var(--muted);
          text-transform: uppercase;
          animation: fadeUp 0.9s ease 0.6s forwards;
        }
        .scroll-hint {
          position: absolute; bottom: 2.5rem; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .scroll-hint span { font-size: 0.5rem; letter-spacing: 0.35em; color: var(--muted); text-transform: uppercase; }
        .scroll-hint i {
          display: block; width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--amber), transparent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.25; transform: scaleY(0.6); }
          50%      { opacity: 1;    transform: scaleY(1); }
        }
        @keyframes pop {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        section { padding: 6rem 1.5rem; }
        .sec-label {
          text-align: center;
          font-size: 0.58rem; letter-spacing: 0.5em;
          text-transform: uppercase; color: var(--amber);
          margin-bottom: 0.8rem;
        }
        .sec-title {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 300; color: var(--text);
        }
        .divider {
          width: 36px; height: 1px;
          background: var(--amber); opacity: 0.5;
          margin: 1.4rem auto 3rem;
        }
        .badge {
          display: flex; align-items: center; justify-content: center; gap: 0.7rem;
          width: fit-content; margin: 0 auto 3.5rem;
          padding: 0.55rem 1.4rem;
          border: 1px solid var(--border);
          border-radius: 100px;
          background: var(--surface);
          box-shadow: 0 2px 12px rgba(176,125,58,0.08);
        }
        .badge .b-stars { color: var(--amber); font-size: 0.75rem; letter-spacing: 2px; }
        .badge .b-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; color: var(--amber);
        }
        .badge .b-txt {
          font-size: 0.6rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
        }
        .grid {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2.2rem 1.8rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
          animation: pop 0.5s ease both;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
        .card:hover {
          box-shadow: 0 8px 32px rgba(176,125,58,0.12);
          transform: translateY(-3px);
          border-color: rgba(176,125,58,0.3);
        }
        .card-stars { color: var(--amber); font-size: 0.85rem; letter-spacing: 3px; margin-bottom: 1rem; }
        .card-content { flex-grow: 1; display: flex; flex-direction: column; }
        .card-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.06rem; font-style: italic;
          color: var(--sand); line-height: 1.85;
          margin-bottom: 1.4rem;
          flex-grow: 1;
        }
        .card-author {
          font-size: 0.62rem; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--amber);
          margin-top: auto;
        }
        .card-photo { margin: -2.2rem -1.8rem 1.4rem -1.8rem; border-radius: 8px 8px 0 0; overflow: hidden; }
        .card-photo img { width: 100%; height: 200px; object-fit: cover; }
        .form-wrap {
          max-width: 580px; margin: 1.5rem auto 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 3rem 2.5rem;
          box-shadow: 0 4px 32px rgba(0,0,0,0.05);
        }
        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem; font-weight: 300;
          color: var(--text); text-align: center; margin-bottom: 0.4rem;
        }
        .form-sub {
          text-align: center; font-size: 0.62rem;
          letter-spacing: 0.3em; color: var(--muted);
          text-transform: uppercase; margin-bottom: 0.5rem;
        }
        .form-count {
          text-align: center; font-size: 0.65rem;
          letter-spacing: 0.3em; color: var(--muted);
          text-transform: uppercase; margin-bottom: 2.5rem;
        }
        .form-count strong {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem; color: var(--amber); font-weight: 300;
        }
        .field { margin-bottom: 1.4rem; }
        .field label {
          display: block; font-size: 0.58rem;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 0.5rem;
        }
        .field input,
        .field textarea {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text);
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem; font-weight: 300;
          padding: 0.85rem 1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field input:focus,
        .field textarea:focus {
          border-color: var(--amber);
          box-shadow: 0 0 0 3px rgba(176,125,58,0.1);
        }
        .field textarea { resize: vertical; min-height: 95px; }

        .star-row { display: flex; gap: 6px; }
        .star-row span {
          cursor: pointer; font-size: 1.55rem;
          color: #ddd; transition: color 0.12s, transform 0.12s;
        }
        .star-row span.lit { color: var(--amber); transform: scale(1.12); }

        .upload-box {
          border: 1.5px dashed var(--border);
          border-radius: 6px;
          background: var(--bg);
          padding: 1.8rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .upload-box:hover { border-color: var(--amber); background: #fdf6ec; }
        .upload-box .ico { font-size: 1.4rem; margin-bottom: 0.4rem; }
        .upload-box p { font-size: 0.62rem; letter-spacing: 0.15em; color: var(--muted); text-transform: uppercase; }
        #photoInput { display: none; }
        #photoPreview {
          width: 100%; max-height: 155px; object-fit: cover;
          border-radius: 4px; border: 1px solid var(--border);
          display: none; margin-top: 0.75rem;
        }

        .btn {
          width: 100%; padding: 0.95rem;
          background: var(--amber); color: #fff;
          border: none; border-radius: 5px;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; letter-spacing: 0.4em;
          text-transform: uppercase; cursor: pointer;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          margin-top: 0.5rem;
          box-shadow: 0 4px 16px rgba(176,125,58,0.25);
        }
        .btn:hover:not(:disabled) {
          background: #9a6a28;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(176,125,58,0.35);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .origin-bg {
          background: linear-gradient(160deg, #f5ede0 0%, #ede0cc 100%);
        }
        .origin-inner {
          max-width: 720px; margin: 0 auto; text-align: center;
        }
        .origin-inner h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 4vw, 2.9rem);
          font-weight: 300; color: var(--text);
          line-height: 1.3; margin-bottom: 2rem;
        }
        .origin-inner p {
          font-size: 0.9rem; line-height: 2.1;
          color: var(--soft); margin-bottom: 1rem;
        }

        .toast {
          position: fixed; bottom: 2rem; left: 50%;
          transform: translateX(-50%) translateY(90px);
          background: var(--amber); color: #fff;
          font-size: 0.62rem; letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 0.75rem 2.2rem; border-radius: 100px;
          box-shadow: 0 4px 20px rgba(176,125,58,0.35);
          transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 999; white-space: nowrap;
        }
        .toast.show { transform: translateX(-50%) translateY(0); }
        .toast.error { background: #d32f2f; }

        footer {
          border-top: 1px solid var(--border);
          background: var(--bg2);
          padding: 3rem 2rem; text-align: center;
        }
        footer .logo { display: block; margin-bottom: 1rem; }
        footer p {
          font-size: 0.58rem; letter-spacing: 0.2em;
          color: var(--muted); text-transform: uppercase; line-height: 2.2;
        }

        @media (max-width: 640px) {
          nav { padding: 1.2rem 1.5rem; }
          .form-wrap { padding: 2rem 1.5rem; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav><span className="logo">Pranvana</span></nav>

      {/* HERO */}
      <div className="hero">
        <p className="hero-eyebrow">Artisan Incense &middot; Kyoto Tradition</p>
        <h1>Reflec<em>tions</em></h1>
        <p className="hero-sub">Community Gallery</p>
        <div className="scroll-hint">
          <span>Scroll</span>
          <i></i>
        </div>
      </div>

      {/* REVIEWS */}
      <section id="gallery" style={{ background: 'var(--bg)' }}>
        <p className="sec-label">Community Gallery</p>
        <h2 className="sec-title">Reflections</h2>
        <div className="divider"></div>

        <div className="badge">
          <span className="b-stars">★★★★★</span>
          <span className="b-num" id="totalCount">{totalCount}</span>
          <span className="b-txt">Stories Shared</span>
        </div>

        <div className="grid" id="reviewGrid">
          {reviews.map((review, idx) => (
            <div key={review.id || idx} className="card" style={{ animationDelay: `${idx * 0.05}s` }}>
              {review.photo && (
                <div className="card-photo">
                  <img src={review.photo} alt="ritual" />
                </div>
              )}
              <div className="card-stars" style={{ marginTop: review.photo ? '0' : '1rem' }}>
                {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
              </div>
              <div className="card-content">
                <p className="card-text">"{review.reflection}"</p>
                <span className="card-author">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUBMIT FORM */}
      <section style={{ paddingTop: '2rem', background: 'var(--bg2)' }}>
        <div className="form-wrap">
          <h3 className="form-title">The Ritual of Review</h3>
          <p className="form-sub">Share your moment of pause</p>
          <p className="form-count"><strong>{totalCount}</strong>&nbsp; Stories Shared</p>

          <div className="field">
            <label>Your Name</label>
            <input 
              type="text" 
              placeholder="Full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="field">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="field">
            <label>Your Reflection</label>
            <textarea 
              placeholder="Describe your experience with PRANVANA..." 
              value={reflection} 
              onChange={(e) => setReflection(e.target.value)} 
            />
          </div>

          <div className="field">
            <label>Rating</label>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((v) => (
                <span 
                  key={v} 
                  className={v <= rating ? 'lit' : ''} 
                  onClick={() => setRating(v)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Ritual Photo (optional)</label>
            <div className="upload-box" onClick={() => photoInputRef.current.click()}>
              <div className="ico">📷</div>
              <p>Click to upload photo</p>
            </div>
            <input 
              type="file" 
              id="photoInput" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={photoInputRef}
              onChange={handlePhotoChange}
            />
            {photo && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img id="photoPreview" src={photo} alt="Preview" style={{ display: 'block', margin: '0 auto', maxWidth: '100%', borderRadius: '4px' }} />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto(null);
                    if (photoInputRef.current) photoInputRef.current.value = '';
                  }}
                  style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.6rem', 
                    letterSpacing: '0.15em', 
                    textTransform: 'uppercase', 
                    color: '#d32f2f', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Cancel Photo
                </button>
              </div>
            )}
          </div>

          <button 
            className="btn" 
            onClick={submitReview} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reflection'}
          </button>
        </div>
      </section>

      {/* ORIGIN */}
      <section className="origin-bg">
        <div className="origin-inner">
          <p className="sec-label">Our Origin</p>
          <h2>Silence, Crafted<br />by Hand.</h2>
          <div className="divider"></div>
          <p>In the narrow stone alleys of Kyoto, time moves differently. It was here, watching a third-generation master grind sandalwood into fine dust, that PRANVANA was conceived.</p>
          <p>We reject the industrial acceleration of modern fragrance. Our incense is not dipped in synthetic perfume; it is kneaded from raw woods, spices, and resins. Each stick is dried in the mountain air for weeks before it reaches your home.</p>
          <p>This is not just a scent. It is a lineage of patience.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span className="logo">Pranvana</span>
        <p>Crafting silence in a noisy world.</p>
        <p>Incense for the modern ritual.</p>
        <br />
        <p>&copy; 2026 PRANVANA &middot; Designed with intention</p>
      </footer>

      <div className={`toast ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
}
