import { Festival, FESTIVALS } from "@/data/festivals";

export interface SearchResult {
  festival: Festival;
  score: number;
  matchReason: string;
}

export interface ChatResponse {
  message: string;
  festivals: Festival[];
  suggestions?: string[];
}

// Normalize text for comparison
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

// Month definition map
interface MonthInfo {
  num: number;
  name: string;
  aliases: string[];
}

const MONTHS: MonthInfo[] = [
  { num: 1, name: "January", aliases: ["january", "jan"] },
  { num: 2, name: "February", aliases: ["february", "feb"] },
  { num: 3, name: "March", aliases: ["march", "mar"] },
  { num: 4, name: "April", aliases: ["april", "apr"] },
  { num: 5, name: "May", aliases: ["may"] },
  { num: 6, name: "June", aliases: ["june", "jun"] },
  { num: 7, name: "July", aliases: ["july", "jul"] },
  { num: 8, name: "August", aliases: ["august", "aug"] },
  { num: 9, name: "September", aliases: ["september", "sep", "sept"] },
  { num: 10, name: "October", aliases: ["october", "oct"] },
  { num: 11, name: "November", aliases: ["november", "nov"] },
  { num: 12, name: "December", aliases: ["december", "dec"] },
];

// Helper to detect if a specific month is explicitly mentioned in the query
function extractTargetMonth(query: string): MonthInfo | null {
  const q = normalize(query);
  for (const m of MONTHS) {
    // Check full name first
    const fullNameRegex = new RegExp(`\\b${m.name.toLowerCase()}\\b`, "i");
    if (fullNameRegex.test(q)) {
      return m;
    }
  }

  // Check aliases with context (e.g., "in jul", "jul 2027", "festivals in may")
  for (const m of MONTHS) {
    for (const alias of m.aliases) {
      if (alias === "may") {
        // "may" requires context like "in may", "may 2027", "may festivals", "month of may"
        const mayRegex = /\b(in\s+may|may\s+2027|may\s+festivals?|month\s+of\s+may)\b/i;
        if (mayRegex.test(q)) return m;
      } else {
        const aliasRegex = new RegExp(`\\b${alias}\\b`, "i");
        if (aliasRegex.test(q)) return m;
      }
    }
  }

  return null;
}

// Region & Continent mappings
const REGION_MAP: Record<string, { label: string; filter: (f: Festival) => boolean }> = {
  europe: {
    label: "Europe",
    filter: (f) => f.location.region === "Europe" || ["germany", "spain", "norway", "netherlands", "uk"].includes(normalize(f.location.country)),
  },
  european: {
    label: "Europe",
    filter: (f) => f.location.region === "Europe" || ["germany", "spain", "norway", "netherlands", "uk"].includes(normalize(f.location.country)),
  },
  uk: {
    label: "United Kingdom",
    filter: (f) => normalize(f.location.country) === "uk" || normalize(f.location.country) === "united kingdom",
  },
  britain: {
    label: "United Kingdom",
    filter: (f) => normalize(f.location.country) === "uk",
  },
  usa: {
    label: "USA",
    filter: (f) => normalize(f.location.country) === "usa",
  },
  america: {
    label: "USA",
    filter: (f) => normalize(f.location.country) === "usa",
  },
  "north america": {
    label: "North America",
    filter: (f) => f.location.region === "North America",
  },
  asia: {
    label: "Asia",
    filter: (f) => f.location.region === "Asia",
  },
  asian: {
    label: "Asia",
    filter: (f) => f.location.region === "Asia",
  },
  africa: {
    label: "Africa",
    filter: (f) => f.location.region === "Africa",
  },
  african: {
    label: "Africa",
    filter: (f) => f.location.region === "Africa",
  },
};

// Check if query is targeting a specific region
function extractRegion(query: string): { label: string; filter: (f: Festival) => boolean } | null {
  const q = normalize(query);
  for (const [key, config] of Object.entries(REGION_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(q)) {
      return config;
    }
  }
  return null;
}

// Score festival against general queries
function scoreFestival(festival: Festival, query: string): { score: number; reason: string } {
  const q = normalize(query);
  let score = 0;
  const reasons: string[] = [];

  // Genre match
  const genreMatches = festival.genre.filter((g) =>
    q.includes(normalize(g)) || normalize(g).includes(q.split(" ")[0])
  );
  if (genreMatches.length > 0) {
    score += 40 * genreMatches.length;
    reasons.push(`genre: ${genreMatches.join(", ")}`);
  }

  // Location match (city, country, venue, region)
  if (
    q.includes(normalize(festival.location.city)) ||
    q.includes(normalize(festival.location.country)) ||
    q.includes(normalize(festival.location.venue)) ||
    (festival.location.region && q.includes(normalize(festival.location.region)))
  ) {
    score += 50;
    reasons.push(`location: ${festival.location.city}, ${festival.location.country}`);
  }

  // Artist match
  const artistMatches = festival.artists.filter((a) =>
    q.includes(normalize(a)) || normalize(a).split(" ").some((part) => q.includes(part) && part.length > 3)
  );
  if (artistMatches.length > 0) {
    score += 45 * artistMatches.length;
    reasons.push(`artist: ${artistMatches.join(", ")}`);
  }

  // Festival name match
  if (q.includes(normalize(festival.name)) || normalize(festival.name).split(" ").some((w) => q.includes(w) && w.length > 4)) {
    score += 40;
    reasons.push(`festival name match`);
  }

  // Genre categories keyword matching
  const categoryMap: { keywords: string[]; genres: string[] }[] = [
    { keywords: ["techno", "electronic", "rave", "underground", "trance", "hard techno", "industrial"], genres: ["techno", "electronic", "rave", "trance", "industrial", "hard techno"] },
    { keywords: ["bass", "dubstep", "drum and bass", "dnb", "d&b", "riddim", "trap"], genres: ["bass music", "dubstep", "drum & bass", "trap", "riddim"] },
    { keywords: ["house", "deep house", "disco", "afro house"], genres: ["house", "deep house", "disco", "afro house"] },
    { keywords: ["indie", "alternative", "rock", "folk", "psychedelic"], genres: ["indie rock", "alternative", "folk", "indie", "psychedelic"] },
    { keywords: ["ambient", "chill", "downtempo", "meditation", "calm", "ethereal", "drone"], genres: ["ambient", "downtempo", "drone", "neo-classical", "experimental"] },
    { keywords: ["world", "reggae", "afrobeats", "amapiano", "tribal", "cultural", "kwaito"], genres: ["world music", "afrobeats", "amapiano", "kwaito", "reggae", "tribal"] },
    { keywords: ["synthwave", "retrowave", "80s", "retro", "new wave", "vaporwave"], genres: ["synthwave", "retrowave", "new wave", "darksynth", "vaporwave"] },
  ];

  for (const { keywords, genres } of categoryMap) {
    if (keywords.some((kw) => q.includes(kw))) {
      const festGenres = festival.genre.map(normalize);
      const match = genres.some((g) => festGenres.includes(normalize(g)));
      if (match) {
        score += 30;
        reasons.push(`category match`);
      }
    }
  }

  // Budget/price intent
  if ((q.includes("cheap") || q.includes("budget") || q.includes("affordable")) && festival.price.weekend <= 155) {
    score += 25;
    reasons.push("budget-friendly");
  }
  if ((q.includes("premium") || q.includes("luxury") || q.includes("vip")) && festival.price.vip >= 320) {
    score += 20;
    reasons.push("premium experience");
  }

  // Season matching
  const startMonth = new Date(festival.dates.start).getMonth() + 1;
  if (q.includes("summer") && startMonth >= 6 && startMonth <= 8) { score += 25; reasons.push("summer 2027 season"); }
  if (q.includes("winter") && (startMonth === 12 || startMonth <= 2)) { score += 25; reasons.push("winter 2027 season"); }
  if (q.includes("spring") && startMonth >= 3 && startMonth <= 5) { score += 25; reasons.push("spring 2027 season"); }
  if ((q.includes("autumn") || q.includes("fall")) && startMonth >= 9 && startMonth <= 11) { score += 25; reasons.push("autumn 2027 season"); }

  return { score, reason: reasons.join(" | ") || "general match" };
}

// Search festivals with scoring
export function searchFestivals(query: string, limit = 6): SearchResult[] {
  const results: SearchResult[] = FESTIVALS.map((festival) => {
    const { score, reason } = scoreFestival(festival, query);
    return { festival, score, matchReason: reason };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Main AI Assistant query resolver
export function generateResponse(query: string): ChatResponse {
  const q = normalize(query);

  // ==========================================
  // 1. Casual Greetings & Check-ins (Urdu / Hindi / English)
  // ==========================================

  // Roman Urdu / Hindi casual greetings: "kya haal hai jan", "kya haal hai", "kaise ho", etc.
  const urduGreetingRegex = /\b(kya\s+h[a|e]al(\s+hai)?(\s+j[a|u]n)?|kaise\s+ho|kese\s+ho|kya\s+hal|theek\s+ho|sab\s+theek|kya\s+chal\s+raha\s+hai)\b/i;
  if (urduGreetingRegex.test(q)) {
    return {
      message: "Main bilkul theek hoon jan! 😊 Bohat shukriya poochne ke liye.\n\nMain aapka Festival AI Assistant hoon. Main hamare **2027 ke 12 fictional demo festivals** me se aapke pasandeeda events dhoondh sakta hoon. Aap kis tarah ka festival explore karna chahenge? Jaise ke Europe ke techno events ya summer beach festivals?",
      festivals: [],
      suggestions: [
        "Festivals in Europe",
        "Explore techno festivals",
        "Festivals in July 2027",
        "Cheapest festivals",
      ],
    };
  }

  // English casual check-in: "how are you", "how are you doing", "how's it going", "what's up", etc.
  const englishCheckInRegex = /\b(how\s+are\s+you(\s+doing)?|how\s+r\s+u|how\'?s\s+it\s+going|how\s+is\s+it\s+going|how\s+do\s+you\s+do|what\'?s\s+up|wassup|whats\s+up)\b/i;
  if (englishCheckInRegex.test(q)) {
    return {
      message: "I'm doing fantastic, thank you for asking! 😊\n\nI'm your Festival AI Assistant. I can help you search and compare our fictional demo dataset of **12 made-up music festivals scheduled for 2027**.\n\nWhat are you in the mood for? Techno undergrounds, sunny Ibiza beach parties, or mountain ambient vibes?",
      festivals: [],
      suggestions: [
        "Festivals in Europe",
        "Explore techno festivals",
        "Festivals in July 2027",
        "Compare festivals",
      ],
    };
  }

  // Who are you / Identity check
  if (q.includes("who are you") || q.includes("what are you") || q.includes("who r u")) {
    return {
      message: "I'm the **Festival AI Assistant** demo! 🎪\n\nI help music fans search and explore our fictional demo dataset of 12 festivals across Europe, North America, Asia, and Africa for the 2027 season.\n\n*(Note: All data, lineups, and prices are entirely fictional for demonstration purposes)*",
      festivals: [],
      suggestions: [
        "Show all festivals",
        "Festivals in Europe",
        "Explore techno festivals",
        "Best rated festivals",
      ],
    };
  }

  // Simple Hello / Hi / Good day greetings
  if (q.match(/^(hi|hello|hey|howdy|sup|hiya|yo|greetings|good\s+morning|good\s+afternoon|good\s+evening)(\s|$|[!?.])/i)) {
    return {
      message: "Hey there! 👋 I'm your Festival AI Assistant.\n\nI can help you discover and compare our **fictional demo dataset of 12 music festivals scheduled for 2027**. You can search by genre, location, month in 2027, or budget!",
      festivals: [],
      suggestions: [
        "Festivals in Europe",
        "Explore techno festivals",
        "Festivals in July 2027",
        "Cheapest festivals",
      ],
    };
  }

  // Help inquiry
  if (q.includes("help") || q.includes("what can you do") || q.includes("features")) {
    return {
      message: "I can help you explore our fictional demo festival dataset! 🎪 Try asking:\n\n• **By Region**: \"Festivals in Europe\" or \"Festivals in the USA\"\n• **By Month (2027)**: \"Festivals in July\", \"August festivals\", \"June 2027\"\n• **By Genre**: \"Show me techno festivals\" or \"Indie rock festivals\"\n• **By Lineup**: \"Who is playing at Neon Pulse?\"\n• **Compare**: \"Compare Voltage and Neon Pulse\"\n• **By Budget**: \"Cheapest weekend festivals\"",
      festivals: [],
      suggestions: ["Festivals in Europe", "Festivals in July 2027", "Explore techno festivals", "Compare festivals"],
    };
  }

  // ==========================================
  // 2. Strict Month & Date Filtering (Requirement 2 & 3)
  // ==========================================
  const targetMonth = extractTargetMonth(query);
  if (targetMonth) {
    // Filter STRICTLY by the requested month
    const monthFestivals = FESTIVALS.filter((f) => {
      const s = new Date(f.dates.start);
      const e = new Date(f.dates.end);
      const startMonth = s.getMonth() + 1;
      const endMonth = e.getMonth() + 1;
      return startMonth === targetMonth.num || endMonth === targetMonth.num;
    });

    if (monthFestivals.length === 0) {
      // Month has no festivals in our 2027 dataset
      return {
        message: `We don't have any fictional demo festivals scheduled in **${targetMonth.name} 2027** 🤔\n\nOur fictional 2027 festival calendar includes:\n• **February 2027**: Aurora Borealis Festival (Norway)\n• **April 2027**: Crimson Dust (USA)\n• **May 2027**: Jungle Beats Bali (Indonesia)\n• **June 2027**: Voltage Festival (Netherlands) & Electric Meadow (UK)\n• **July 2027**: Neon Pulse Festival (Germany)\n• **August 2027**: Solar Bloom (Spain) & Bass Canyon (USA)\n• **September 2027**: Velvet Underground Fest (UK)\n• **October 2027**: Jade River Festival (Japan)\n• **November 2027**: Synthwave Summit (Canada)\n• **December 2027**: Rainbow Coast Festival (South Africa)\n\n*(Note: All festivals and dates are completely fictional demo data)*`,
        festivals: [],
        suggestions: [
          "Festivals in July 2027",
          "Festivals in August 2027",
          "Festivals in June 2027",
          "Show all festivals",
        ],
      };
    }

    // If query has additional filters (like genre or location) along with the month
    let filtered = monthFestivals;
    const region = extractRegion(query);
    if (region) {
      const regionFiltered = filtered.filter(region.filter);
      if (regionFiltered.length > 0) filtered = regionFiltered;
    }

    const genreKeywords = ["techno", "house", "bass", "indie", "ambient", "trance"];
    const requestedGenre = genreKeywords.find((g) => q.includes(g));
    if (requestedGenre) {
      const genreFiltered = filtered.filter((f) => f.genre.some((g) => g.toLowerCase().includes(requestedGenre)));
      if (genreFiltered.length > 0) filtered = genreFiltered;
    }

    return {
      message: `Here are the **${filtered.length} fictional demo festivals** scheduled for **${targetMonth.name} 2027**! 📅\n\n*(Note: All event dates, lineups, and venues are entirely fictional for demonstration purposes)*`,
      festivals: filtered,
      suggestions: [
        "Festivals in August 2027",
        "Festivals in June 2027",
        "Festivals in Europe",
        "Compare festivals",
      ],
    };
  }

  // ==========================================
  // 3. Europe & Regional Filtering (Requirement 1)
  // ==========================================
  const targetRegion = extractRegion(query);
  if (targetRegion) {
    const matchingFestivals = FESTIVALS.filter(targetRegion.filter);

    // Check if there is an additional genre filter (e.g. "techno festivals in Europe")
    const genreKeywords = ["techno", "house", "bass", "ambient", "indie", "world", "synthwave"];
    const matchedGenre = genreKeywords.find((g) => q.includes(g));
    let displayFestivals = matchingFestivals;
    if (matchedGenre) {
      const genreMatches = matchingFestivals.filter((f) =>
        f.genre.some((g) => g.toLowerCase().includes(matchedGenre))
      );
      if (genreMatches.length > 0) {
        displayFestivals = genreMatches;
      }
    }

    let msg = `Here are the **${displayFestivals.length} fictional demo festivals in ${targetRegion.label}** for the 2027 season!`;
    if (matchedGenre) {
      msg = `Here are the **${displayFestivals.length} fictional demo ${matchedGenre} festivals in ${targetRegion.label}** for 2027!`;
    }
    msg += ` 🌍\n\n*(Note: All festival listings, dates, and lineups are entirely fictional demo records)*`;

    return {
      message: msg,
      festivals: displayFestivals,
      suggestions: [
        "Techno festivals in Europe",
        "Festivals in July 2027",
        "Compare Neon Pulse and Voltage",
        "Festivals in the USA",
      ],
    };
  }

  // ==========================================
  // 4. Show All Festivals
  // ==========================================
  if (q.includes("show all") || q.includes("list all") || q.includes("all festivals") || q === "browse" || q.includes("all 12")) {
    return {
      message: `Here are all **${FESTIVALS.length} fictional demo festivals** in our 2027 dataset! 🎉\n\n*(Note: All events, locations, prices, and lineups are entirely fictional demo listings)*`,
      festivals: FESTIVALS,
      suggestions: [
        "Festivals in Europe",
        "Explore techno festivals",
        "Festivals in July 2027",
        "Cheapest festivals",
      ],
    };
  }

  // ==========================================
  // 5. Compare Festivals
  // ==========================================
  if (q.includes("compare") || q.includes(" vs ") || q.includes("versus")) {
    const compared = searchFestivals(query, 2);
    if (compared.length >= 2) {
      const [a, b] = compared;
      const aFest = a.festival;
      const bFest = b.festival;
      return {
        message: `Here's a side-by-side comparison between **${aFest.name}** and **${bFest.name}** (fictional 2027 demo):\n\n` +
          `| Detail | ${aFest.name} | ${bFest.name} |\n` +
          `|---|---|---|\n` +
          `| 📍 Location | ${aFest.location.city}, ${aFest.location.country} (${aFest.location.region}) | ${bFest.location.city}, ${bFest.location.country} (${bFest.location.region}) |\n` +
          `| 📅 2027 Dates | ${aFest.dates.start} to ${aFest.dates.end} | ${bFest.dates.start} to ${bFest.dates.end} |\n` +
          `| 🎵 Genre | ${aFest.genre.slice(0, 2).join(", ")} | ${bFest.genre.slice(0, 2).join(", ")} |\n` +
          `| 💰 Weekend Pass | ${aFest.price.currency} ${aFest.price.weekend} | ${bFest.price.currency} ${bFest.price.weekend} |\n` +
          `| ⭐ Rating | ${aFest.rating}/5 | ${bFest.rating}/5 |\n` +
          `| 👥 Capacity | ${aFest.capacity.toLocaleString()} | ${bFest.capacity.toLocaleString()} |\n\n` +
          `*(Both festivals are entirely fictional demonstration listings)*`,
        festivals: [aFest, bFest],
        suggestions: [
          `Tell me more about ${aFest.name}`,
          `Tell me more about ${bFest.name}`,
          "Festivals in Europe",
          "Show all festivals",
        ],
      };
    }
  }

  // ==========================================
  // 6. Near Me / Location Discovery
  // ==========================================
  if (q.includes("near me") || q.includes("nearby")) {
    return {
      message: "Since this is a client-side demo, I can't read your physical location 📍 But here are featured festivals across major regions! You can ask for \"Festivals in Europe\", \"Festivals in the UK\", or \"Festivals in the USA\".",
      festivals: FESTIVALS.slice(0, 4),
      suggestions: [
        "Festivals in Europe",
        "Festivals in the UK",
        "Festivals in the USA",
        "Festivals in Asia",
      ],
    };
  }

  // ==========================================
  // 7. Best / Top Rated
  // ==========================================
  if (q.includes("best") || q.includes("top rated") || q.includes("highest rated") || q.includes("recommended")) {
    const sorted = [...FESTIVALS].sort((a, b) => b.rating - a.rating).slice(0, 4);
    return {
      message: "Here are the **top-rated fictional festivals** in our 2027 demo dataset! ⭐\n\n*(Ratings and reviews are fictional demonstration data)*",
      festivals: sorted,
      suggestions: [
        "Festivals in Europe",
        "Tell me about Solar Bloom",
        "Cheapest festivals",
        "Compare festivals",
      ],
    };
  }

  // ==========================================
  // 8. Cheapest / Budget
  // ==========================================
  if (q.includes("cheap") || q.includes("budget") || q.includes("affordable") || q.includes("under")) {
    // Sort normalized to roughly comparable weekend passes
    const sorted = [...FESTIVALS].sort((a, b) => a.price.weekend - b.price.weekend).slice(0, 4);
    return {
      message: "Looking for budget-friendly festival passes? Here are the most affordable fictional festivals in our 2027 demo dataset! 💸",
      festivals: sorted,
      suggestions: [
        "Festivals in Europe",
        "Explore techno festivals",
        "Festivals in July 2027",
        "Show all festivals",
      ],
    };
  }

  // ==========================================
  // 9. Lineup & Artist Queries
  // ==========================================
  if (q.includes("lineup") || q.includes("artist") || q.includes("who is playing") || q.includes("who plays") || q.includes("performing")) {
    const results = searchFestivals(query, 2);
    if (results.length > 0) {
      const fest = results[0].festival;
      return {
        message: `Here is the fictional 2027 lineup for **${fest.name}** in ${fest.location.city}, ${fest.location.country}:\n\n${fest.artists.map((a) => `• 🎤 ${a}`).join("\n")}\n\n*(Note: All artist names and lineups are entirely fictional demo listings)*`,
        festivals: [fest],
        suggestions: [
          `Compare ${fest.name} with another festival`,
          "Festivals in Europe",
          "Explore techno festivals",
          "Show all festivals",
        ],
      };
    }
  }

  // ==========================================
  // 10. General Search with Score Fallback
  // ==========================================
  const results = searchFestivals(query, 5);

  if (results.length === 0) {
    // Requirement 5: Suggest useful example queries when no match
    return {
      message: `Hmm, I couldn't find any fictional festivals matching **"${query}"** in our 2027 demo dataset 🤔\n\nTry exploring with one of these search ideas:\n• **By Region**: "Festivals in Europe", "Festivals in the UK", "Festivals in the USA"\n• **By Genre**: "Techno festivals", "House music", "Bass & Dubstep", "Indie rock"\n• **By Month in 2027**: "Festivals in July", "August festivals", "June 2027"\n• **By Artist or Budget**: "Who plays at Neon Pulse?", "Cheapest weekend festivals"\n\n*(Note: All data in this demo is completely fictional)*`,
      festivals: [],
      suggestions: [
        "Show all 12 festivals",
        "Festivals in Europe",
        "Explore techno festivals",
        "Festivals in July 2027",
        "Cheapest festivals",
      ],
    };
  }

  if (results.length === 1) {
    const fest = results[0].festival;
    return {
      message: `Found a match in our 2027 demo dataset! Here is **${fest.name}** in ${fest.location.city}, ${fest.location.country} 🎪\n\n*(Fictional demo record)*`,
      festivals: [fest],
      suggestions: [
        `Who plays at ${fest.name}?`,
        "Festivals in Europe",
        "Festivals in July 2027",
        "Show all festivals",
      ],
    };
  }

  return {
    message: `Found **${results.length} fictional demo festivals** matching your search for the 2027 season! 🎶\n\n*(Note: All listings, dates, and lineups are fictional demo data)*`,
    festivals: results.map((r) => r.festival),
    suggestions: [
      "Festivals in Europe",
      "Festivals in July 2027",
      "Compare festivals",
      "Cheapest festivals",
    ],
  };
}

// Predefined suggestion responses
export const QUICK_SUGGESTIONS: Record<string, () => ChatResponse> = {
  "Find festivals near me": () => generateResponse("near me"),
  "Explore techno festivals": () => generateResponse("techno festivals in Europe"),
  "Find festivals by artist": () => ({
    message: "Here are some of the fictional headlining artists in our 2027 demo dataset! 🎤\n\n• **Zara Volt** & **KRØM** — Neon Pulse Festival (Berlin, Germany)\n• **Luna Marquez** & **Roberto Vibe** — Solar Bloom (Ibiza, Spain)\n• **Frostwave** — Aurora Borealis Festival (Norway)\n• **The Sandwalkers** — Crimson Dust (USA)\n• **Volt Protocol** — Voltage Festival (Amsterdam, Netherlands)\n• **Subsonic Ray** — Bass Canyon (USA)\n\nTry asking: *\"Who is playing at Neon Pulse?\"* or *\"Who plays at Voltage Festival?\"*\n\n*(All artist names are fictional demo data)*",
    festivals: [],
    suggestions: [
      "Who plays at Neon Pulse?",
      "Voltage Festival lineup",
      "Festivals in Europe",
      "Explore techno festivals",
    ],
  }),
  "Compare festivals": () => generateResponse("Compare Neon Pulse and Voltage"),
};
