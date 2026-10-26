'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChatWidget from '@/components/ChatWidget/ChatWidget';
import styles from './page.module.css';
import { FESTIVALS, Festival } from '@/data/festivals';

// Show top 6 festivals on homepage
const FEATURED = FESTIVALS.slice(0, 6);

function formatDateShort(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}, ${e.getFullYear()}`;
}

const GENRE_TAGS = [
  'Techno', 'House', 'Indie', 'Electronic', 'Bass', 'Ambient',
  'Synthwave', 'Afrobeats', 'Reggae', 'World Music', 'Jazz', 'Folk',
];

export default function HomePage() {
  const [heroSearch, setHeroSearch] = useState('');

  const triggerChat = (query?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-festival-chat', {
          detail: { query: query?.trim() ? query.trim() : undefined },
        })
      );
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerChat(heroSearch || 'Find festivals near me');
  };

  return (
    <main id="main-content">
      {/* ===== NAV ===== */}
      <header className={styles.nav} role="banner">
        <div className={styles.navInner}>
          <a href="/" className={styles.logo} aria-label="That Festival Site Home">
            <Image
              src="/logo.png"
              alt="That Festival Site Logo"
              width={44}
              height={44}
              className={styles.logoImg}
              priority
            />
            <span className={styles.logoText}>
              That Festival Site <span className={styles.logoBadge}>AI Demo</span>
            </span>
          </a>
          <nav className={styles.navLinks} aria-label="Primary">
            <a href="#festivals" className={styles.navLink}>Festivals</a>
            <a href="#genres" className={styles.navLink}>Genres</a>
            <a href="#how" className={styles.navLink}>How It Works</a>
          </nav>
          <div className={styles.navCta}>
            <button
              onClick={() => triggerChat()}
              className={styles.navChatBtn}
              aria-label="Open AI Assistant"
            >
              Ask AI Assistant ✦
            </button>
            <span className={styles.navDemoBadge}>⚠ Fictional Demo Data</span>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroBg} style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="/festival-warm.jpg"
            alt="Aerial view of a summer music festival at golden hour"
            fill
            priority
            quality={85}
            sizes="100vw"
            className={styles.heroBgImg}
          />
          <div className={styles.heroBgOverlay} aria-hidden="true" />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Your Ultimate Guide to Music Festivals</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            Discover Your Next<br />Festival Experience
          </h1>
          <p className={styles.heroDesc}>
            Explore our fictional demo dataset of festivals, lineups, and ticket prices.
            Ask the AI assistant anything — it&apos;s all crafted for demonstration!
          </p>

          {/* Interactive Search bar */}
          <form
            onSubmit={handleHeroSubmit}
            className={styles.heroSearch}
            role="search"
            aria-label="Festival search"
          >
            <span className={styles.heroSearchIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              className={styles.heroSearchInput}
              placeholder="Search festivals, genres, artists (e.g. techno, summer, low budget)…"
              aria-label="Search festival database"
            />
            <button type="submit" className={styles.heroSearchBtn} aria-label="Submit search to AI assistant">
              Ask AI ✦
            </button>
          </form>

          <p className={styles.heroHint}>
            👇 Or tap the <strong>🎪 assistant button</strong> in the bottom-right corner anytime
          </p>
        </div>
      </section>

      {/* ===== SECTION 1: FEATURED FESTIVALS ===== */}
      <section id="festivals" className={styles.section} aria-labelledby="featured-title">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Demo Dataset</p>
              <h2 id="featured-title" className={styles.sectionTitle}>Featured Festivals</h2>
            </div>
            <p className={styles.sectionNote}>
              ⚠ All festivals below are entirely fictional — created for demo purposes only.
            </p>
          </div>

          <div className={styles.festivalGrid} role="list" aria-label="Featured demo festivals">
            {FEATURED.map((festival: Festival) => (
              <article key={festival.id} className={styles.festivalCard} role="listitem">
                {/* Card image area with genre badge */}
                <div className={styles.cardImageArea}>
                  <span className={styles.cardEmoji} aria-hidden="true">{festival.image}</span>
                  <div className={styles.cardGenreBadge}>
                    {festival.genre[0]}
                  </div>
                  <div className={styles.cardRating} aria-label={`Rating: ${festival.rating} out of 5`}>
                    ★ {festival.rating}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardLocation}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {festival.location.city}, {festival.location.country}
                    </span>
                    <span className={styles.cardDate}>
                      📅 {formatDateShort(festival.dates.start, festival.dates.end)}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{festival.name}</h3>
                  <p className={styles.cardTagline}>{festival.tagline}</p>
                  <p className={styles.cardDesc}>{festival.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>
                      <span className={styles.cardPriceLabel}>From</span>
                      <span className={styles.cardPriceValue}>
                        {festival.price.currency} {festival.price.weekend.toLocaleString()}
                      </span>
                      <span className={styles.cardPriceType}>weekend</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerChat(`Tell me about ${festival.name} in ${festival.location.city}`)}
                      className={styles.cardChatBtn}
                      title={`Ask AI Assistant about ${festival.name}`}
                    >
                      Ask AI →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.sectionFooter}>
            <p className={styles.sectionFooterText}>
              {FESTIVALS.length} fictional festivals in the demo dataset ·{' '}
              <button
                type="button"
                onClick={() => triggerChat('Compare festivals')}
                className={styles.inlineLinkBtn}
              >
                Ask AI to compare all of them →
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: BROWSE BY GENRE ===== */}
      <section id="genres" className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="genres-title">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeaderCenter}>
            <p className={styles.sectionEyebrow}>Find Your Sound</p>
            <h2 id="genres-title" className={styles.sectionTitle}>Browse by Genre</h2>
            <p className={styles.sectionSubtitle}>
              Click any genre below to let the AI search our fictional demo dataset instantly
            </p>
          </div>

          <div className={styles.genreGrid} role="list" aria-label="Music genres">
            {GENRE_TAGS.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => triggerChat(`Explore ${genre} festivals`)}
                className={styles.genreChip}
                role="listitem"
                title={`Ask AI for ${genre} festivals`}
              >
                {genre} <span className={styles.genreChipArrow}>→</span>
              </button>
            ))}
          </div>

          <div className={styles.genrePromo}>
            <div className={styles.genrePromoText}>
              <h3 className={styles.genrePromoTitle}>Not sure where to start?</h3>
              <p className={styles.genrePromoDesc}>
                Click any example query below to test the AI festival discovery demo:
              </p>
            </div>
            <div className={styles.genrePromoExamples} aria-label="Example queries">
              {[
                'Show me techno festivals in Europe',
                'Best summer festivals under €200',
                'Compare Neon Pulse and Voltage',
                'Who plays at Solar Bloom?',
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => triggerChat(ex)}
                  className={styles.genrePromoExample}
                >
                  &ldquo;{ex}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: HOW IT WORKS ===== */}
      <section id="how" className={styles.section} aria-labelledby="how-title">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeaderCenter}>
            <p className={styles.sectionEyebrow}>AI-Powered Discovery</p>
            <h2 id="how-title" className={styles.sectionTitle}>How It Works</h2>
          </div>

          <div className={styles.stepsRow}>
            {[
              {
                num: '01',
                icon: '🎪',
                title: 'Open the Chat',
                desc: 'Tap the floating 🎪 button in the bottom-right corner to open the AI Festival Assistant.',
              },
              {
                num: '02',
                icon: '💬',
                title: 'Ask a Question',
                desc: 'Search by genre, location, artist, season, or budget. The AI searches our fictional demo dataset.',
              },
              {
                num: '03',
                icon: '🎟️',
                title: 'Explore Results',
                desc: 'Get detailed festival cards with lineup info, pricing, capacity, and genre tags.',
              },
            ].map((step) => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">{step.num}</div>
                <div className={styles.stepIcon} aria-hidden="true">{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <Image
                  src="/logo.png"
                  alt="That Festival Site Logo"
                  width={34}
                  height={34}
                  className={styles.footerLogoImg}
                />
                <span>AI Demo</span>
              </div>
              <p className={styles.footerTagline}>A fictional demo inspired by festival discovery sites.</p>
            </div>
            <div className={styles.footerLinks}>
              <h4 className={styles.footerLinksTitle}>Explore Demo</h4>
              <div className={styles.footerLinksList}>
                <button type="button" onClick={() => triggerChat('Explore techno festivals')} className={styles.footerLinkBtn}>Techno Festivals</button>
                <button type="button" onClick={() => triggerChat('Explore house festivals')} className={styles.footerLinkBtn}>House & Disco</button>
                <button type="button" onClick={() => triggerChat('Explore indie festivals')} className={styles.footerLinkBtn}>Indie & Folk</button>
                <button type="button" onClick={() => triggerChat('Explore world music festivals')} className={styles.footerLinkBtn}>World Music</button>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <h4 className={styles.footerLinksTitle}>Ask the AI</h4>
              <div className={styles.footerLinksList}>
                <button type="button" onClick={() => triggerChat('Best festivals under €200')} className={styles.footerLinkBtn}>Find by Budget</button>
                <button type="button" onClick={() => triggerChat('Compare festivals')} className={styles.footerLinkBtn}>Compare Festivals</button>
                <button type="button" onClick={() => triggerChat('Find festivals by artist')} className={styles.footerLinkBtn}>Find by Artist</button>
                <button type="button" onClick={() => triggerChat('Find festivals near me')} className={styles.footerLinkBtn}>Festivals Near Me</button>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerDisclaimer}>
              <strong>⚠ Demo Disclaimer:</strong> All festival names, artist names, locations, dates, prices and data shown
              are entirely fictional and created solely for demonstration purposes. This AI demo is inspired by the concept
              of festival discovery and does not represent any real events, real artists, or any existing festival listing service
              including thatfestivalsite.com.
            </p>
            <p className={styles.footerCopy}>
              Built with Next.js · Demo only · No real festival data
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </main>
  );
}
