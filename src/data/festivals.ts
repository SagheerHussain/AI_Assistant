// DEMO DATA — All festivals listed here are entirely fictional.
// This dataset was created for demonstration purposes only and does not
// represent real events, artists, or listings from any external source.

export interface Festival {
  id: string;
  name: string;
  tagline: string;
  location: {
    city: string;
    country: string;
    region: 'Europe' | 'North America' | 'Asia' | 'Africa';
    venue: string;
    lat: number;
    lon: number;
  };
  dates: {
    start: string; // ISO date YYYY-MM-DD in 2027
    end: string;
  };
  genre: string[];
  artists: string[];
  price: {
    dayPass: number;
    weekend: number;
    vip: number;
    currency: string;
  };
  capacity: number;
  description: string;
  highlights: string[];
  image: string; // emoji used as placeholder icon
  rating: number; // out of 5
  website: string; // fictional
}

export const FESTIVALS: Festival[] = [
  {
    id: "neon-pulse-berlin",
    name: "Neon Pulse Festival",
    tagline: "The Future of Sound",
    location: {
      city: "Berlin",
      country: "Germany",
      region: "Europe",
      venue: "Tempelhof Grounds",
      lat: 52.473,
      lon: 13.403,
    },
    dates: { start: "2027-07-09", end: "2027-07-11" },
    genre: ["techno", "electronic", "ambient", "industrial"],
    artists: [
      "Zara Volt",
      "The Midnight Circuit",
      "Pulse Unit",
      "DJ Axiom",
      "KRØM",
      "Synthetic Echo",
    ],
    price: { dayPass: 65, weekend: 155, vip: 310, currency: "EUR" },
    capacity: 25000,
    description:
      "Berlin's premier underground techno experience set across the iconic Tempelhof runway. Six stages, three nights of relentless beats.",
    highlights: [
      "6 stages including an outdoor stage",
      "48-hour non-stop music",
      "Light sculpture installations",
      "Camping available",
    ],
    image: "🟣",
    rating: 4.8,
    website: "neonpulsefestival.demo",
  },
  {
    id: "solar-bloom-ibiza",
    name: "Solar Bloom",
    tagline: "Dance Until Dawn",
    location: {
      city: "Ibiza",
      country: "Spain",
      region: "Europe",
      venue: "Playa del Sol Arena",
      lat: 38.906,
      lon: 1.432,
    },
    dates: { start: "2027-08-06", end: "2027-08-08" },
    genre: ["house", "deep house", "disco", "afro house"],
    artists: [
      "Luna Marquez",
      "Roberto Vibe",
      "Cleo & Sands",
      "Afro Pulse Collective",
      "DJ Mambo",
    ],
    price: { dayPass: 80, weekend: 200, vip: 450, currency: "EUR" },
    capacity: 15000,
    description:
      "A sun-soaked house music paradise on the shores of Ibiza, featuring beach stages and cliff-top sunset sessions.",
    highlights: [
      "Beachfront main stage",
      "Sunset cliff sessions",
      "Pool parties daily",
      "Star DJs from 6 countries",
    ],
    image: "☀️",
    rating: 4.9,
    website: "solarbloomibiza.demo",
  },
  {
    id: "aurora-borealis-festival",
    name: "Aurora Borealis Festival",
    tagline: "Music Beneath the Northern Lights",
    location: {
      city: "Tromsø",
      country: "Norway",
      region: "Europe",
      venue: "Arctic Sound Park",
      lat: 69.649,
      lon: 18.956,
    },
    dates: { start: "2027-02-12", end: "2027-02-14" },
    genre: ["ambient", "downtempo", "drone", "experimental", "neo-classical"],
    artists: [
      "Frostwave",
      "Sigrid Solstice",
      "The Glacial Quartet",
      "Nordic Drift",
      "Auroras (live)",
    ],
    price: { dayPass: 55, weekend: 130, vip: 280, currency: "NOK" },
    capacity: 5000,
    description:
      "An intimate festival under the Arctic sky, pairing ethereal ambient music with the natural spectacle of the Northern Lights.",
    highlights: [
      "Northern Lights viewing decks",
      "Heated geodesic dome stages",
      "Ice sculpture gallery",
      "Hot springs access",
    ],
    image: "🌌",
    rating: 4.7,
    website: "aurorafest.no.demo",
  },
  {
    id: "crimson-dust-mojave",
    name: "Crimson Dust",
    tagline: "Where the Desert Comes Alive",
    location: {
      city: "Mojave",
      country: "USA",
      region: "North America",
      venue: "Desert Flats Grounds",
      lat: 35.017,
      lon: -118.174,
    },
    dates: { start: "2027-04-16", end: "2027-04-19" },
    genre: ["indie rock", "psychedelic", "folk", "alternative"],
    artists: [
      "The Sandwalkers",
      "Prism Road",
      "Mellow Gold",
      "Earthen Bloom",
      "Vera Caine",
      "Desert Wolves",
    ],
    price: { dayPass: 70, weekend: 175, vip: 380, currency: "USD" },
    capacity: 30000,
    description:
      "Four days of indie and psychedelic music under the blazing Mojave sun, with immersive art installations across the desert floor.",
    highlights: [
      "4-day multi-stage experience",
      "Immersive art desert trail",
      "Camping & glamping",
      "Local craft food market",
    ],
    image: "🏜️",
    rating: 4.6,
    website: "crimsondustfest.demo",
  },
  {
    id: "voltage-amsterdam",
    name: "Voltage Festival",
    tagline: "Electrify Your Weekend",
    location: {
      city: "Amsterdam",
      country: "Netherlands",
      region: "Europe",
      venue: "Amsterdam Arena District",
      lat: 52.314,
      lon: 4.942,
    },
    dates: { start: "2027-06-18", end: "2027-06-20" },
    genre: ["techno", "trance", "hard techno", "rave"],
    artists: [
      "Volt Protocol",
      "Syndicate X",
      "Eva Overdrive",
      "The Grid",
      "Phase Shift",
      "BNKR",
    ],
    price: { dayPass: 72, weekend: 168, vip: 320, currency: "EUR" },
    capacity: 40000,
    description:
      "Europe's largest dedicated techno and trance festival, transforming Amsterdam's arena district into a labyrinth of sound.",
    highlights: [
      "8 stages across the district",
      "72 hours of music",
      "Laser & pyro main show",
      "International headliners",
    ],
    image: "⚡",
    rating: 4.8,
    website: "voltagefestival.nl.demo",
  },
  {
    id: "jade-river-kyoto",
    name: "Jade River Festival",
    tagline: "Tradition Meets Tomorrow",
    location: {
      city: "Kyoto",
      country: "Japan",
      region: "Asia",
      venue: "Riverside Cultural Park",
      lat: 35.011,
      lon: 135.768,
    },
    dates: { start: "2027-10-08", end: "2027-10-10" },
    genre: ["j-pop", "lo-fi", "jazz", "world music", "fusion"],
    artists: [
      "Hana Suki",
      "The Haiku Collective",
      "Night Blossom",
      "Koto & Bass",
      "DJ Sakura",
    ],
    price: { dayPass: 6500, weekend: 16000, vip: 30000, currency: "JPY" },
    capacity: 12000,
    description:
      "A serene celebration of music at the intersection of traditional Japanese aesthetics and modern sound, held along Kyoto's historic rivers.",
    highlights: [
      "Traditional garden stage",
      "River lantern ceremony",
      "Japanese food culture market",
      "Tea ceremony experience",
    ],
    image: "🎋",
    rating: 4.9,
    website: "jaderiverfest.jp.demo",
  },
  {
    id: "bass-canyon-bc",
    name: "Bass Canyon",
    tagline: "Feel the Rumble",
    location: {
      city: "Gorge Amphitheatre",
      country: "USA",
      region: "North America",
      venue: "Canyon Stage Grounds",
      lat: 47.076,
      lon: -119.994,
    },
    dates: { start: "2027-08-13", end: "2027-08-16" },
    genre: ["bass music", "dubstep", "drum & bass", "trap", "riddim"],
    artists: [
      "Subsonic Ray",
      "Quake Theory",
      "Low Frequency Unit",
      "Magnitude 9",
      "Bass Witch",
      "Decibel Storm",
    ],
    price: { dayPass: 85, weekend: 210, vip: 420, currency: "USD" },
    capacity: 22000,
    description:
      "Four days of earth-shaking bass music set against the dramatic canyon landscape of the Pacific Northwest.",
    highlights: [
      "Canyon panorama stage",
      "4-night camping",
      "Sunrise bass sets",
      "Sub-bass speaker array",
    ],
    image: "🔊",
    rating: 4.7,
    website: "basscanyonfest.demo",
  },
  {
    id: "velvet-underground-manchester",
    name: "Velvet Underground Fest",
    tagline: "Underground, Uncut, Undeniable",
    location: {
      city: "Manchester",
      country: "UK",
      region: "Europe",
      venue: "Mayfield Depot",
      lat: 53.476,
      lon: -2.232,
    },
    dates: { start: "2027-09-24", end: "2027-09-26" },
    genre: ["techno", "acid", "industrial", "noise", "post-punk"],
    artists: [
      "Mira Black",
      "Acid House Unit",
      "Construct 7",
      "The Noise Garden",
      "Vinyl Panic",
    ],
    price: { dayPass: 50, weekend: 120, vip: 240, currency: "GBP" },
    capacity: 8000,
    description:
      "A raw, industrial underground festival housed in an iconic Manchester warehouse. No frills, just pure underground energy.",
    highlights: [
      "Warehouse industrial atmosphere",
      "Acid room 24hrs",
      "Vinyl-only DJ sets",
      "No phones policy in main room",
    ],
    image: "🏭",
    rating: 4.6,
    website: "velvetundergroundfest.uk.demo",
  },
  {
    id: "rainbow-coast-capetown",
    name: "Rainbow Coast Festival",
    tagline: "Africa's Biggest Music Celebration",
    location: {
      city: "Cape Town",
      country: "South Africa",
      region: "Africa",
      venue: "Atlantic Seaboard Grounds",
      lat: -33.919,
      lon: 18.424,
    },
    dates: { start: "2027-12-26", end: "2027-12-30" },
    genre: ["afrobeats", "amapiano", "hip-hop", "kwaito", "house"],
    artists: [
      "Mama Afrika",
      "Solar Bounce",
      "The Zulu Kings",
      "Amapiano Queens",
      "Cape Groove Collective",
    ],
    price: { dayPass: 350, weekend: 850, vip: 1800, currency: "ZAR" },
    capacity: 35000,
    description:
      "A five-day celebration of African music culture with the Atlantic Ocean as a backdrop. The continent's most diverse music festival.",
    highlights: [
      "Ocean panorama stage",
      "Cultural village experience",
      "5 days of music",
      "International & local artists",
    ],
    image: "🌈",
    rating: 4.8,
    website: "rainbowcoastfest.demo",
  },
  {
    id: "synth-wave-toronto",
    name: "Synthwave Summit",
    tagline: "Retro Futures",
    location: {
      city: "Toronto",
      country: "Canada",
      region: "North America",
      venue: "Echo Park Exhibition Centre",
      lat: 43.651,
      lon: -79.347,
    },
    dates: { start: "2027-11-05", end: "2027-11-07" },
    genre: ["synthwave", "retrowave", "new wave", "darksynth", "vaporwave"],
    artists: [
      "Neon Grid",
      "Cassette Dreams",
      "The Chromatics",
      "Outrun Collective",
      "Pixel Knight",
    ],
    price: { dayPass: 55, weekend: 130, vip: 260, currency: "CAD" },
    capacity: 10000,
    description:
      "An 80s-drenched indoor festival dripping with neon, analog synths, and retro-futuristic visuals. A love letter to the golden age of electronic music.",
    highlights: [
      "Retro arcade zone",
      "Analog synth museum",
      "VHS aesthetic installations",
      "CRT video art gallery",
    ],
    image: "🌆",
    rating: 4.5,
    website: "synthwavesummit.ca.demo",
  },
  {
    id: "jungle-beats-bali",
    name: "Jungle Beats Bali",
    tagline: "Rhythm in the Rainforest",
    location: {
      city: "Ubud",
      country: "Indonesia",
      region: "Asia",
      venue: "Sacred Valley Grounds",
      lat: -8.506,
      lon: 115.263,
    },
    dates: { start: "2027-05-21", end: "2027-05-24" },
    genre: ["world music", "reggae", "dub", "psychedelic", "tribal"],
    artists: [
      "Bali Breeze",
      "The Roots Wave",
      "Jungle Pulse",
      "Sacred Circle",
      "Dub Mystic",
    ],
    price: { dayPass: 450000, weekend: 1100000, vip: 2400000, currency: "IDR" },
    capacity: 8000,
    description:
      "Deep in the Balinese jungle, this four-day festival combines world rhythms with ancient ritual sites and lush tropical scenery.",
    highlights: [
      "Jungle-edge main stage",
      "Sunrise yoga & music",
      "Traditional Balinese ceremonies",
      "Eco-camping available",
    ],
    image: "🌿",
    rating: 4.7,
    website: "junglebeats.bali.demo",
  },
  {
    id: "electric-meadow-london",
    name: "Electric Meadow",
    tagline: "Where Fields Become Dance Floors",
    location: {
      city: "Glastonbury",
      country: "UK",
      region: "Europe",
      venue: "Meadow Fields Estate",
      lat: 51.179,
      lon: -2.714,
    },
    dates: { start: "2027-06-25", end: "2027-06-28" },
    genre: ["indie", "alternative", "electronic", "hip-hop", "r&b"],
    artists: [
      "Nova Bloom",
      "The Velvet Machines",
      "Shea Solaris",
      "Electric Daisy",
      "Crew 77",
      "Late Night Drive",
    ],
    price: { dayPass: 60, weekend: 145, vip: 320, currency: "GBP" },
    capacity: 50000,
    description:
      "The UK's most beloved multi-genre festival returns to the Somerset meadows with the biggest lineup in its history.",
    highlights: [
      "8 diverse genre stages",
      "4-night camping",
      "Comedy & arts village",
      "Local craft beer festival",
    ],
    image: "🌸",
    rating: 4.9,
    website: "electricmeadow.uk.demo",
  },
];

// Helper: Get unique genres from all festivals
export function getAllGenres(): string[] {
  const genres = new Set<string>();
  FESTIVALS.forEach((f) => f.genre.forEach((g) => genres.add(g)));
  return Array.from(genres).sort();
}

// Helper: Get unique countries from all festivals
export function getAllCountries(): string[] {
  const countries = new Set<string>();
  FESTIVALS.forEach((f) => countries.add(f.location.country));
  return Array.from(countries).sort();
}

// Helper: Get unique regions from all festivals
export function getAllRegions(): string[] {
  const regions = new Set<string>();
  FESTIVALS.forEach((f) => regions.add(f.location.region));
  return Array.from(regions).sort();
}

// Helper: Get unique artists from all festivals
export function getAllArtists(): string[] {
  const artists = new Set<string>();
  FESTIVALS.forEach((f) => f.artists.forEach((a) => artists.add(a)));
  return Array.from(artists).sort();
}
