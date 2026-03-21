'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reflection, setReflection] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', isError: false });
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReviews();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation on scroll
    const animEls = document.querySelectorAll('.anim-fade');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animEls.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
    };
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

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '', isError: false }), 3000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submitReview = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      setReviews(prev => [newReview, ...prev]);
      setTotalCount(prev => prev + 1);

      // Reset form
      setName('');
      setEmail('');
      setReflection('');
      setPhoto(null);
      setRating(5);
      if (photoInputRef.current) photoInputRef.current.value = '';

      showToast('Reflection submitted — thank you ✦');
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error('Submit error:', err);
      showToast('Something went wrong. Please try again.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="antialiased">
      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
        {toast.msg}
      </div>

      {/* HEADER */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <div className="header-logo">
            <a href="/" aria-label="Pranvana home">
              <span className="logo">Pranvana</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="hero">
        <p className="hero-eyebrow">Pure Agarbatti · Essential Oil Fragrance</p>
        <h1>Purity in Prayer. <em>Safety in Breath.</em></h1>
        <p className="hero-sub">✦ Essence of Earth ✦</p>
        <div className="hero-cta">
          <a href="#gallery" className="btn">Share Your Reflection</a>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <i></i>
        </div>
      </div>

      {/* PROMISE STRIP */}
      <div className="promise-strip">
        <div className="promise-item">Flower Based</div>
        <div className="promise-item">Hand Rolled</div>
        <div className="promise-item">Contains Essential Oil</div>
        <div className="promise-item">Gentle Slow Burn</div>
      </div>

      {/* TRUTH STRIP */}
      <div className="truth-strip">
        <p className="sec-label">The Hidden Truth</p>
        <h2>What is really burning <em>in your home?</em></h2>
        <p>Most mass-market agarbatti is made from industrial waste dust, bound with petrochemical resins, and scented with artificial perfume. When these burn, they release toxic particles into the air your family breathes during prayer.</p>
        <p>We are not here to frighten you. We are here to be the first brand honest enough to say it — and to offer a real alternative.</p>
        <div className="truth-pillars">
          <div className="truth-pillar anim-fade">
            <span className="truth-pillar-icon">⚠️</span>
            <div className="truth-pillar-title">Toxic Fillers</div>
            <div className="truth-pillar-body">Industrial sawdust and waste dust used as base material in most commercial agarbatti — never disclosed on the pack.</div>
          </div>
          <div className="truth-pillar anim-fade">
            <span className="truth-pillar-icon">⚗️</span>
            <div className="truth-pillar-title">Harmful Binders</div>
            <div className="truth-pillar-body">Synthetic resins — often imported chemical adhesives — hold the stick together and release harmful compounds when burned.</div>
          </div>
          <div className="truth-pillar anim-fade">
            <span className="truth-pillar-icon">🧪</span>
            <div className="truth-pillar-title">Chemical Fragrance</div>
            <div className="truth-pillar-body">Artificial perfume concentrate — ten times cheaper than essential oil, zero percent natural — applied to mimic real scent.</div>
          </div>
          <div className="truth-pillar anim-fade">
            <span className="truth-pillar-icon">🫁</span>
            <div className="truth-pillar-title">Who Is Most at Risk</div>
            <div className="truth-pillar-body">Children under 10, elders above 60, and anyone with respiratory sensitivity — the very people seated closest during puja.</div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="reviews-section" id="gallery">
        <p className="sec-label">Family Voices</p>
        <h2 className="sec-title">Reflec<span style={{ fontStyle: 'italic', color: 'var(--amber-lt)' }}>tions</span></h2>
        <div className="divider"></div>

        <div className="badge">
          <span className="b-stars">★★★★★</span>
          <span className="b-num">{totalCount}</span>
          <span className="b-txt">Families Shared</span>
        </div>

        <div className="grid" id="reviewGrid">
          {reviews.map((review: any, idx) => (
            <article key={review.id || idx} className="card anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
              {review.photo && (
                <div className="card-photo">
                  <img src={review.photo} alt="ritual" />
                </div>
              )}
              <div className="card-stars">
                {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
              </div>
              <p className="card-text">"{review.reflection}"</p>
              <span className="card-author">{review.name}</span>
              <span className="card-verified">Verified Buyer</span>
            </article>
          ))}
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="form-section">
        <div className="form-wrap">
          <h3 className="form-title">Share Your Experience</h3>
          <p className="form-sub">Tell other families what you discovered</p>
          <p className="form-count"><strong>{totalCount}</strong>&nbsp; Families Shared</p>

          <form onSubmit={submitReview}>
            <div className="field">
              <label>Your Name <span style={{ color: '#c0392b' }}>*</span></label>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email Address <span style={{ color: '#c0392b' }}>*</span></label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Your Reflection <span style={{ color: '#c0392b' }}>*</span></label>
              <textarea
                placeholder="Describe your experience with Pranvana..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                required
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
                    role="button"
                    aria-label={`${v} stars`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Upload Photo (Optional)</label>
              <div className="upload-box" onClick={() => photoInputRef.current?.click()}>
                <div className="ico">📷</div>
                <p>Click to upload ritual photo</p>
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={photoInputRef}
                onChange={handlePhotoChange}
              />
              {photo && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img src={photo} alt="Preview" style={{ display: 'block', margin: '0 auto', maxWidth: '100%', borderRadius: 'var(--radius-sm)', maxHeight: '200px', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      if (photoInputRef.current) photoInputRef.current.value = '';
                    }}
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#c0392b',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn--full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Reflection'}
            </button>
          </form>
        </div>
      </section>

      {/* ORIGIN SECTION */}
      <section className="origin-bg">
        <div className="origin-inner">
          <p className="sec-label">Our Origin</p>
          <h2>We asked one question <br /> no one else was asking.</h2>
          <div className="divider"></div>
          <p>Agarbatti has been part of Indian homes for thousands of years. It is woven into prayer, into memory, into the smell of a grandmother's puja room on a winter morning. Nobody questioned it. Until we did.</p>
          <p>The question was simple: what is actually inside these sticks? What we found was troubling — industrial filler, petrochemical binders, synthetic fragrance — materials chosen for cost, not for the family breathing the smoke.</p>
          <p>We made a decision: if we could not light it in our own home, in front of our own children, we would not make it at all. That is the only standard Pranvana has ever used.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="/" className="logo">Pranvana</a>
            <p>Crafting silence in a noisy world.</p>
            <p>Incense for the modern ritual.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/pranvana/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61588256046574" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Pranvana · Designed with intention</p>
        </div>
      </footer>
    </div>
  );
}
