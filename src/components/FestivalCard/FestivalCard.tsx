'use client';

import { Festival } from '@/data/festivals';
import styles from './FestivalCard.module.css';

interface FestivalCardProps {
  festival: Festival;
  index?: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRange(start: string, end: string): string {
  const e = new Date(end);
  const year = e.getFullYear();
  return `${formatDate(start)} – ${formatDate(end)}, ${year}`;
}

function formatPrice(festival: Festival): string {
  const { currency, weekend } = festival.price;
  return `${currency} ${weekend.toLocaleString()}`;
}

export default function FestivalCard({ festival, index = 0 }: FestivalCardProps) {
  const genreColors: Record<string, string> = {
    techno: '#6B4E71',
    electronic: '#2B5B84',
    house: '#D97706',
    'deep house': '#D97706',
    trance: '#4F46E5',
    ambient: '#0D9488',
    downtempo: '#0D9488',
    indie: '#15803D',
    'indie rock': '#15803D',
    'bass music': '#B91C1C',
    dubstep: '#B91C1C',
    'drum & bass': '#B91C1C',
    afrobeats: '#C2410C',
    amapiano: '#C2410C',
    synthwave: '#BE185D',
    retrowave: '#BE185D',
    reggae: '#047857',
    folk: '#65A30D',
    'world music': '#0F766E',
    'j-pop': '#A21CAF',
    jazz: '#B45309',
    hip: '#1D4ED8',
    alternative: '#4D7C0F',
  };

  function getGenreColor(genre: string): string {
    for (const key of Object.keys(genreColors)) {
      if (genre.toLowerCase().includes(key)) return genreColors[key];
    }
    return '#DF6845';
  }

  const primaryGenreColor = getGenreColor(festival.genre[0]);
  const delayStyle = { animationDelay: `${index * 80}ms` };

  return (
    <div className={styles.card} style={{ '--accent': primaryGenreColor, ...delayStyle } as React.CSSProperties}>
      <div className={styles.cardHeader}>
        <span className={styles.icon} aria-hidden="true">{festival.image}</span>
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{festival.name}</h3>
          <p className={styles.tagline}>{festival.tagline}</p>
        </div>
        <div className={styles.rating}>
          <span className={styles.ratingValue}>⭐ {festival.rating}</span>
        </div>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaItem}>
          <span aria-hidden="true">📍</span>
          {festival.location.city}, {festival.location.country}
        </span>
        <span className={styles.metaItem}>
          <span aria-hidden="true">📅</span>
          {formatDateRange(festival.dates.start, festival.dates.end)}
        </span>
      </div>

      <p className={styles.description}>{festival.description}</p>

      <div className={styles.genreRow}>
        {festival.genre.slice(0, 3).map((g) => (
          <span
            key={g}
            className={styles.genreTag}
            style={{ borderColor: getGenreColor(g), color: getGenreColor(g) }}
          >
            {g}
          </span>
        ))}
        {festival.genre.length > 3 && (
          <span className={styles.genreMore}>+{festival.genre.length - 3}</span>
        )}
      </div>

      <div className={styles.artistRow}>
        <span className={styles.artistLabel}>🎤 Artists:</span>
        <span className={styles.artistList}>
          {festival.artists.slice(0, 3).join(', ')}
          {festival.artists.length > 3 && ` +${festival.artists.length - 3} more`}
        </span>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.priceBlock}>
          <span className={styles.priceLabel}>Weekend from</span>
          <span className={styles.price}>{formatPrice(festival)}</span>
        </div>
        <div className={styles.capacityBlock}>
          <span className={styles.capacityLabel}>Capacity</span>
          <span className={styles.capacity}>{festival.capacity.toLocaleString()}</span>
        </div>
        <span className={styles.demoTag}>Demo Data</span>
      </div>
    </div>
  );
}
