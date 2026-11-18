import React, { useState, useEffect, useCallback, useRef } from 'react';

/** Tiny inline SVG helper */
function Ic({ name, style = {} }) {
  const paths = {
    ext: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
    arr: <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
    book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    award: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: '1em', height: '1em', flex: 'none', stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {paths[name]}
    </svg>
  );
}

const SECTION_IDS = ['home', 'work', 'about', 'skills', 'achievements', 'process', 'contact'];

/** ===================== NAVBAR ===================== */
function Navbar({ activeSection, scrollToSection }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  const go = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="bar">
        {/* Logo */}
        <a href="#home" onClick={(e) => go(e, 'home')} className="logo" aria-label="Home">
          RK<b>.</b>
        </a>

        {/* Links + Single "Let's talk" button */}
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => go(e, id)}
              className={`l ${activeSection === id ? 'on' : ''}`}
            >
              {label}
            </a>
          ))}
          <a
            href="mailto:khanrijvan2610@gmail.com"
            className="talk-btn"
          >
            Let’s talk <Ic name="arr" style={{ color: 'var(--accent)' }} />
          </a>
        </nav>

        {/* Mobile Menu Button (<860px) */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="menu-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </div>
    </header>
  );
}

/** ===================== HOME ===================== */
function Home({ scrollToSection }) {
  const go = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <section id="home" style={{ paddingTop: 0 }}>
      <div className="hero-grid">
        {/* Left text */}
        <div style={{ maxWidth: 520 }}>
          <span style={{ fontWeight: 600, fontSize: 16, display: 'inline-block', position: 'relative', paddingBottom: 8, marginBottom: 6 }}>
            Hi, I’m
            <span style={{ position: 'absolute', left: 0, bottom: 0, width: 26, height: 2, background: 'var(--accent)', display: 'block', borderRadius: 2 }} />
          </span>

          <h1 style={{ fontSize: 'clamp(36px, 7.5vw, 76px)', fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.08, wordBreak: 'break-word' }}>
            Rijvan <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>Khan</em>
          </h1>

          <p style={{ fontWeight: 600, color: 'var(--sub)', margin: '14px 0 22px', fontSize: 17 }}>
            MERN Stack Developer
          </p>

          <p style={{ maxWidth: 440, color: 'var(--sub)', marginBottom: 28, fontSize: 'clamp(14px, 2.5vw, 15px)', lineHeight: 1.65 }}>
            I build and deploy full-stack products that are fast, secure and well tested. From the database to the interface, I turn ideas into working software.
          </p>

          <div className="hero-actions">
            <a
              href="#work"
              onClick={(e) => go(e, 'work')}
              className="btn-hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 24px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                border: '1.5px solid var(--accent)',
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                cursor: 'pointer',
              }}
            >
              View my work <Ic name="arr" />
            </a>
            <a
              href="#contact"
              onClick={(e) => go(e, 'contact')}
              className="btn-hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 24px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                border: '1.5px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              Contact me
            </a>
          </div>
        </div>

        {/* Right: Profile Photo */}
        <div className="hero-img-wrap">
          <div className="hero-img-box">
            {/* Subtle arched halo matching the navy shirt palette */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '88%',
                height: '88%',
                borderRadius: '50% 50% 0 0',
                background: 'var(--accent)',
                opacity: 0.12,
                zIndex: 0,
              }}
            />
            <img
              src="/rijvan.png"
              alt="Rijvan Khan – MERN Stack Developer"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                position: 'relative',
                zIndex: 1,
                objectFit: 'contain',
                objectPosition: 'center bottom',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** ===================== WORK ===================== */
const GH = 'https://github.com/Rijvan26';
const PROJECTS = [
  {
    id: 'resolver',
    name: 'Resolver',
    image: '/resolver.jpg',
    urlLabel: 'resolver-orcin.vercel.app',
    desc: 'AI-powered incident management platform where AI suggests and humans decide. 448 automated tests across 34 suites.',
    tags: ['React', 'TypeScript', 'TailwindCss', 'RAG', 'Node.js', 'MongoDB', 'Redis', 'BullMQ', 'Google Auth', 'BrevoEmail'],
    live: 'https://resolver-orcin.vercel.app/dashboard',
  },
  {
    id: 'supportme',
    name: 'SupportMe',
    image: '/supportme.jpg',
    urlLabel: 'supportme.com',
    desc: 'Creator support platform with guest checkout, UPI and card payments through Razorpay, and a supporter dashboard.',
    tags: ['React', 'TypeScript', 'TailwindCss', 'Redux Toolkit', 'Auth', 'Node.js', 'Razorpay'],
    live: 'https://support-me000.vercel.app/dashboard',
  },
  {
    id: 'intelexx',
    name: 'Intelexx AI',
    image: '/intelexx.png',
    urlLabel: 'intellexx-ai.app',
    desc: 'Real-time AI search assistant with web answers from Gemini and Tavily, JWT login and OTP email verification.',
    tags: ['React', 'Node.js', 'Express', 'RAG', 'LangChain', 'Gemini API', 'MongoDB'],
    live: '',
  },
];

function Work() {
  return (
    <section id="work" style={{ paddingTop: 72 }}>
      <h2 style={{ fontSize: 'clamp(24px,3vw,30px)', fontWeight: 700, marginBottom: 28, position: 'relative', paddingBottom: 12, letterSpacing: '-.02em', lineHeight: 1.12 }}>
        Selected work
        <span style={{ position: 'absolute', left: 0, bottom: 0, width: 30, height: 3, borderRadius: 3, background: 'var(--accent)', display: 'block' }} />
      </h2>
      <div className="work-grid">
        {PROJECTS.map((p) => (
          <article
            key={p.id}
            className="card-hover group"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Real Project Screenshot in Browser Window Frame */}
            <div
              style={{
                height: 180,
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--peach)',
                borderBottom: '1px solid var(--line)',
              }}
            >
              {/* Browser bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  background: 'color-mix(in srgb, var(--card) 92%, transparent)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
                <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--sub)', fontFamily: 'monospace', opacity: 0.85 }}>
                  {p.urlLabel}
                </span>
              </div>

              {/* Project Image */}
              <img
                src={p.image}
                alt={`${p.name} preview`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  paddingTop: 24,
                  display: 'block',
                  transition: 'transform 0.35s ease',
                }}
                className="group-hover:scale-[1.03]"
              />
            </div>

            {/* Project Details */}
            <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.12, letterSpacing: '-.02em' }}>
                {p.name} <Ic name="ext" style={{ color: 'var(--accent)', fontSize: 14 }} />
              </h3>
              <p style={{ fontSize: 13, color: 'var(--sub)' }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontSize: 12, color: 'var(--sub)', padding: '2px 10px', borderRadius: 999, background: 'var(--peach)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 700, color: 'var(--accent)', paddingTop: 6 }}>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                  >
                    Live demo
                  </a>
                )}
                <a
                  href={p.github || GH}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                >
                  GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** ===================== ABOUT ===================== */
const TRAITS = [
  ['target', 'Detail oriented'],
  ['zap', 'Problem solver'],
  ['code', 'Clean code advocate'],
  ['book', 'Always learning'],
  ['users', 'Team player'],
  ['search', 'Curious mind'],
];

function About() {
  return (
    <section id="about" style={{ paddingTop: 72 }}>
      <div className="about-grid">
        {/* Line-art SVG: developer with mug + books */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <svg
            style={{ width: '100%', maxWidth: 380, height: 'auto', color: 'var(--ink)' }}
            viewBox="0 0 380 300"
            role="img"
            aria-label="Illustration of a developer with a mug and books"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M40 30 Q40 6 80 6 Q120 6 120 30 L120 120 L40 120 Z" fill="var(--card)" />
            <line x1="80" y1="6" x2="80" y2="120" />
            <circle cx="190" cy="104" r="34" fill="var(--card)" />
            <circle cx="176" cy="76" r="19" fill="currentColor" />
            <circle cx="200" cy="72" r="19" fill="currentColor" />
            <circle cx="218" cy="90" r="13" fill="currentColor" />
            <circle cx="182" cy="108" r="7" />
            <circle cx="203" cy="108" r="7" />
            <path d="M184 124 Q193 130 202 124" />
            <path d="M120 270 C118 200 140 160 190 150 C240 160 262 200 262 270 Z" fill="var(--card)" />
            <path d="M214 214 C240 218 252 206 252 192" />
            <rect x="236" y="168" width="30" height="34" rx="6" fill="var(--accent)" stroke="var(--accent)" />
            <path d="M266 176 a10 10 0 0 1 0 20" />
            <rect x="262" y="246" width="96" height="14" fill="var(--card)" />
            <rect x="268" y="232" width="84" height="14" fill="var(--card)" />
            <rect x="274" y="218" width="74" height="14" fill="var(--card)" />
            <line x1="30" y1="270" x2="360" y2="270" strokeWidth="2.5" />
          </svg>
        </div>

        <div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,30px)', fontWeight: 700, marginBottom: 28, position: 'relative', paddingBottom: 12, letterSpacing: '-.02em', lineHeight: 1.12 }}>
            About me
            <span style={{ position: 'absolute', left: 0, bottom: 0, width: 30, height: 3, borderRadius: 3, background: 'var(--accent)', display: 'block' }} />
          </h2>
          <p style={{ color: 'var(--sub)', fontSize: 'clamp(14px, 2.5vw, 15px)', lineHeight: 1.65 }}>
            I’m a MERN stack developer who cares about secure, tested and well-built products. I design REST APIs, build clean React interfaces and write the automated tests that keep them working.
          </p>
          <div className="traits-grid">
            {TRAITS.map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
                <Ic name={icon} style={{ color: 'var(--accent)', fontSize: 22 }} /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** ===================== SKILLS MARQUEE ===================== */
const SKILLS = [
  ['JS', 'JavaScript'], ['TS', 'TypeScript'], ['Re', 'React'], ['RR', 'React Router'],
  ['RT', 'Redux Toolkit'], ['RQ', 'RTK Query'], ['Tw', 'Tailwind CSS'], ['UI', 'ShadCN'],
  ['No', 'Node.js'], ['Ex', 'Express.js'], ['API', 'REST APIs'], ['JWT', 'JWT'],
  ['MQ', 'BullMQ'], ['IO', 'Socket.IO'], ['Mo', 'MongoDB'], ['MG', 'Mongoose'],
  ['Rd', 'Redis'], ['Dk', 'Docker'], ['Gt', 'Git & GitHub'], ['PM', 'Postman'],
  ['RZ', 'Razorpay'], ['AI', 'Gemini API'], ['GQ', 'Groq API'],
];

function Skills() {
  const tiles = [...SKILLS, ...SKILLS];

  return (
    <section id="skills" style={{ paddingTop: 72 }}>
      <h2 style={{ fontSize: 'clamp(24px,3vw,30px)', fontWeight: 700, marginBottom: 28, position: 'relative', paddingBottom: 12, letterSpacing: '-.02em', lineHeight: 1.12 }}>
        Skills &amp; technologies
        <span style={{ position: 'absolute', left: 0, bottom: 0, width: 30, height: 3, borderRadius: 3, background: 'var(--accent)', display: 'block' }} />
      </h2>

      <div
        className="skills-strip"
        style={{
          overflow: 'hidden',
          padding: '6px 0 18px',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
          maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
        }}
      >
        <div className="track">
          {tiles.map((s, i) => (
            <div
              key={i}
              style={{
                width: 110,
                flex: 'none',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 18,
                padding: '18px 8px 14px',
                textAlign: 'center',
                boxShadow: '0 8px 20px -16px rgba(242, 106, 27, 0.5)',
              }}
            >
              <b style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, margin: '0 auto 10px', borderRadius: 12, background: 'var(--peach)', color: 'var(--accent)', fontWeight: 800, fontSize: 16, letterSpacing: '-.03em' }}>
                {s[0]}
              </b>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{s[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** ===================== ACHIEVEMENTS ===================== */
const WINS = [
  { icon: 'award', date: 'June 2026', title: '4th place at a hackathon', sub: 'Fullstack developer and tester', desc: 'Helped build a backend visualization web app with React Flow, Gemini API and Monaco Editor, and presented it in a live demo.' },
  { icon: 'book', date: 'Certification', title: 'KODR Bootcamp', sub: 'Sheryians Coding School', desc: 'Full stack development and data structures and algorithms.' },
];

function Achievements() {
  return (
    <section id="achievements" style={{ paddingTop: 72 }}>
      <h2 style={{ fontSize: 'clamp(24px,3vw,30px)', fontWeight: 700, marginBottom: 28, position: 'relative', paddingBottom: 12, letterSpacing: '-.02em', lineHeight: 1.12 }}>
        Achievements
        <span style={{ position: 'absolute', left: 0, bottom: 0, width: 30, height: 3, borderRadius: 3, background: 'var(--accent)', display: 'block' }} />
      </h2>
      <div className="achievements-grid">
        {WINS.map((w, i) => (
          <div
            key={i}
            className="card-hover"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              padding: '24px 28px',
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--peach)',
                color: 'var(--ink)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 24,
                flex: 'none',
              }}
            >
              <Ic name={w.icon} style={{ fontSize: 24 }} />
            </div>
            <div style={{ flex: 1 }}>
              <small style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                {w.date}
              </small>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '2px 0 3px', letterSpacing: '-.02em', lineHeight: 1.25, color: 'var(--ink)' }}>
                {w.title}
              </h3>
              <small style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 12.5, display: 'block', marginBottom: 6 }}>
                {w.sub}
              </small>
              <p style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.6 }}>{w.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ===================== PROCESS ===================== */
const STEPS = [
  ['search', 'Understand', 'Learn the problem and who it is for.'],
  ['pen', 'Plan', 'Define the data model and API first.'],
  ['code', 'Build', 'Write the API and the React interface.'],
  ['check', 'Test', 'Write tests and try to break it.'],
  ['send', 'Ship', 'Deploy, share a demo and improve.'],
];

function Process() {
  return (
    <section id="process" style={{ paddingTop: 72 }}>
      <h2 style={{ fontSize: 'clamp(24px,3vw,30px)', fontWeight: 700, marginBottom: 28, position: 'relative', paddingBottom: 12, letterSpacing: '-.02em', lineHeight: 1.12 }}>
        My process
        <span style={{ position: 'absolute', left: 0, bottom: 0, width: 30, height: 3, borderRadius: 3, background: 'var(--accent)', display: 'block' }} />
      </h2>
      <div className="process-grid">
        {STEPS.map((s, i) => (
          <div key={i}>
            <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', background: 'var(--peach)', color: 'var(--ink)', display: 'grid', placeItems: 'center', margin: '0 auto 10px', fontSize: 24 }}>
              <Ic name={s[0]} style={{ fontSize: 24 }} />
              {i < STEPS.length - 1 && <span className="process-connector" />}
            </div>
            <small style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12, display: 'block' }}>0{i + 1}</small>
            <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.02em' }}>{s[1]}</h3>
            <p style={{ fontSize: 12, color: 'var(--sub)' }}>{s[2]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ===================== CONTACT ===================== */
function Contact() {
  return (
    <div id="contact" className="contact-container">
      <div className="site-wrap">
        <div className="contact-grid">
          <div>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em', margin: 0, padding: 0 }}>
              Let’s build something<br />
              meaningful <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>together.</em>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, fontWeight: 500 }}>
            <a href="mailto:khanrijvan2610@gmail.com" className="contact-email" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Ic name="mail" style={{ fontSize: 18 }} /> khanrijvan2610@gmail.com
            </a>
            <a href="tel:+917389974179" className="contact-phone" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Ic name="phone" style={{ fontSize: 18 }} /> +91 73899 74179
            </a>
          </div>

          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Let’s connect</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: 'https://github.com/Rijvan26', icon: 'github', label: 'GitHub' },
                { href: 'https://linkedin.com/in/rijvaan-khan', icon: 'linkedin', label: 'LinkedIn' },
                { href: 'mailto:khanrijvan2610@gmail.com', icon: 'mail', label: 'Email' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="soc-btn"
                  style={{ width: 42, height: 42, border: '1.5px solid var(--ink)', borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 18, background: 'var(--card)' }}
                >
                  <Ic name={icon} style={{ fontSize: 18 }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--sub)', marginTop: 32 }}>
          © 2026 Rijvan Khan. All rights reserved. <b style={{ color: 'var(--accent)' }}>♥</b>
        </p>
      </div>
    </div>
  );
}

/** ===================== SCROLL SPY HOOK ===================== */
function useScrollSpy() {
  const [active, setActive] = useState('home');
  const isProgrammaticScrollRef = useRef(false);
  const timeoutRef = useRef(null);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    isProgrammaticScrollRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

    window.history.replaceState(null, '', '#' + id);
    setActive(id);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && SECTION_IDS.includes(hash)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          setActive(hash);
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    function spy() {
      if (isProgrammaticScrollRef.current) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (atBottom) {
        setActive('contact');
        return;
      }

      let cur = 'home';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) {
          cur = id;
        }
      }
      setActive(cur);
    }

    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();

    return () => {
      window.removeEventListener('scroll', spy);
      window.removeEventListener('resize', spy);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return { activeSection: active, scrollToSection };
}

/** ===================== APP ROOT ===================== */
export default function App() {
  const { activeSection, scrollToSection } = useScrollSpy();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      <main className="site-wrap">
        <Home scrollToSection={scrollToSection} />
        <Work />
        <About />
        <Skills />
        <Achievements />
        <Process />
      </main>

      <Contact />
    </div>
  );
}
