import type { Book, RoomMeta, RoomId } from './types';
import { wisdomBooks } from './wisdom';
import { becomingBooks } from './becoming';
import { millennialTao } from './millennial';
import { visionaryBooks } from './visionary';
import { patternsBooks } from './patterns';

export const SOUL_HUB_ROUTE = '/soul-hub';
export const LIBRARY_VERSION = '0.1.0-prototype';
export const CHANGELOG = [
  { v: '0.1.0', date: 'Prototype', notes: 'Grand Atrium, four rooms, Living Tome reader, Essence layers, 3+ Living Pages, Millennial Tao (3 ch), public-domain selections with full commentary, persistence, atmosphere modes.' },
];

export const rooms: RoomMeta[] = [
  {
    id: 'wisdom',
    name: 'The Wisdom Archive',
    subtitle: 'Sacred Texts, Spirituality & Ancient Wisdom',
    description:
      'A luminous sanctuary of humanity’s sacred literature — Daoist, Hindu, Buddhist, Hebrew, Sufi, and Hermetic voices gathered under golden light. Each tradition presented in its own integrity, never flattened into one.',
    image: 'images/wisdom-archive.jpg',
    accent: '#e8b45a',
    glow: 'rgba(232,180,90,.35)',
    motto: 'Many rivers, one thirst — each spring honored as itself.',
    subjects: ['Daoism', 'Hinduism', 'Buddhism', 'Biblical Wisdom', 'Sufism', 'Hermeticism'],
  },
  {
    id: 'becoming',
    name: 'The Chamber of Becoming',
    subtitle: 'Personal Growth, Philosophy & Self-Discovery',
    description:
      'A living garden of transformation beneath the great luminous Tree — Stoic philosophy, modern practice, and the original Millennial Tao. Reflection questions and exercises throughout, designed for future Your Journey integration.',
    image: 'images/chamber-becoming.jpg',
    accent: '#8fd6a0',
    glow: 'rgba(143,214,160,.3)',
    motto: 'You are not finished. Neither is the garden.',
    subjects: ['Stoicism', 'Practice', 'Daoism', 'Creativity', 'Resilience', 'Modern Life'],
  },
  {
    id: 'visionary',
    name: 'The Visionary Archive',
    subtitle: 'Consciousness, Visionary Art & Altered Perspectives',
    description:
      'An iridescent observatory of inner space — the science of consciousness, the psychology of mysticism, dreams, and a strictly educational history of sacred plants. Science, history, philosophy, and spiritual interpretation always distinguished.',
    image: 'images/visionary-archive.jpg',
    accent: '#c9a8ff',
    glow: 'rgba(201,168,255,.35)',
    motto: 'Look within — carefully, honestly, lawfully.',
    subjects: ['Consciousness', 'Psychology', 'Mysticism', 'Dreams', 'History', 'Perception'],
  },
  {
    id: 'patterns',
    name: 'The Hall of Hidden Patterns',
    subtitle: 'Sacred Geometry, Symbolism & Esoteric Traditions',
    description:
      'A symmetrical temple of form — Platonic solids, golden spirals, mandalas, archetypes, and alchemical emblems. Rotate the solids, grow the spirals, breathe with the mandalas. Mathematics and meaning, rigorously distinguished.',
    image: 'images/hall-patterns.jpg',
    accent: '#7fb8ff',
    glow: 'rgba(127,184,255,.35)',
    motto: 'Number dreams, and the dream takes shape.',
    subjects: ['Sacred Geometry', 'Mathematics', 'Symbolism', 'Archetypes', 'Alchemy', 'Mythology'],
  },
];

export const allBooks: Book[] = [...wisdomBooks, ...becomingBooks, millennialTao, ...visionaryBooks, ...patternsBooks];

export const getBook = (id: string) => allBooks.find((b) => b.id === id);
export const getRoom = (id: RoomId) => rooms.find((r) => r.id === id)!;
export const booksInRoom = (roomId: RoomId) => allBooks.filter((b) => b.roomId === roomId);
export const readableBooks = () => allBooks.filter((b) => b.chapters.length > 0);
export const featuredBooks = () => allBooks.filter((b) => b.featured);

export function searchLibrary(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { books: [] as Book[], chapters: [] as { book: Book; chapterId: string; title: string; snippet: string }[] };
  const books = allBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.tradition.toLowerCase().includes(q) ||
      b.subjects.some((s) => s.toLowerCase().includes(q)) ||
      b.themes.some((t) => t.toLowerCase().includes(q)) ||
      b.description.toLowerCase().includes(q)
  );
  const chapters: { book: Book; chapterId: string; title: string; snippet: string }[] = [];
  for (const b of allBooks) {
    for (const c of b.chapters) {
      const hay = (c.title + ' ' + c.essence + ' ' + c.verses.map((v) => v.lines.join(' ')).join(' ')).toLowerCase();
      const idx = hay.indexOf(q);
      if (idx >= 0) {
        const raw = c.title + ' — ' + c.essence;
        chapters.push({ book: b, chapterId: c.id, title: c.title, snippet: raw.slice(0, 160) + '…' });
      }
      if (chapters.length > 24) break;
    }
  }
  return { books, chapters };
}

export const INTEGRATION_GUIDE = `INNER ORBIT INTEGRATION GUIDE (prototype v0.1)
• Soul Hub return: configurable constant SOUL_HUB_ROUTE in src/data/library.ts (default "${SOUL_HUB_ROUTE}"). The Atrium "Return to Soul Hub" control navigates there; in standalone builds it shows an elegant notice.
• Persistence keys (localStorage, namespace "inner-orbit-library-v1"): reading progress, bookmarks, reflection notes, recently-visited, atmosphere, reader prefs. Replace the storage adapter in src/hooks/useLibraryStore.ts with API calls to sync to Soul Hub / user profile.
• Your Journey hooks: every chapter's reflection.journeyHook names a future practice (streaks, rituals). Notes saved per chapter are export-shaped {bookId, chapterId, text, updated}.
• Catalog is data-driven: add books by appending to room data files (src/data/*.ts) following the Book type — no app rewrites needed. Rooms likewise from the rooms array.
• Living Pages registry: LIVING_PAGES in src/components/LivingPages.tsx maps livingPage ids to components; add new demos by registering here.
• Static build: npm run build → dist/ (index.html at root). Suitable for Netlify Drop. No backend, no auth, no paid APIs.`;
