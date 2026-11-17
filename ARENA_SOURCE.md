# Celestial Library — complete prototype source

Original application source for model retrieval. Image assets are stored separately in `public/images/`. `package-lock.json` is available at repository root.

## package.json

```json
{
  "name": "react-vite-tailwind",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "2.1.1",
    "framer-motion": "^14.14.0",
    "lucide-react": "^1.73.0",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "tailwind-merge": "3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.17",
    "@types/node": "22.19.17",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "5.1.1",
    "tailwindcss": "4.1.17",
    "typescript": "5.9.3",
    "vite": "7.3.7",
    "vite-plugin-singlefile": "2.3.0"
  }
}

```

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Inner Orbit — The Celestial Library &amp; Living Tome</title>
    <meta name="description" content="An impossible library among the stars. Sacred wisdom, philosophy, consciousness and hidden patterns — illuminated by the Living Tome. Boldly go where you've always been." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

## vite.config.ts

```ts
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "types": ["node"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "vite.config.ts"]
}

```

## src/App.tsx

```tsx
import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLibraryStore } from './hooks/useLibraryStore';
import { getBook, getRoom, CHANGELOG, INTEGRATION_GUIDE, LIBRARY_VERSION } from './data/library';
import type { RoomId } from './data/types';
import Chrome, { SoulHubNotice } from './components/Chrome';
import Atrium from './components/Atrium';
import RoomView from './components/RoomView';
import BookDetail from './components/BookDetail';
import LivingTome from './components/LivingTome';
import SearchOverlay from './components/SearchOverlay';
import Starfield from './components/Starfield';

type View = { name: 'atrium' } | { name: 'room'; roomId: RoomId } | { name: 'reader'; bookId: string; chapterId: string };

export default function App() {
  const store = useLibraryStore();
  const [view, setView] = useState<View>({ name: 'atrium' });
  const [detailBook, setDetailBook] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [soulOpen, setSoulOpen] = useState(false);
  const [codexOpen, setCodexOpen] = useState(false);
  const [veil, setVeil] = useState<{ text: string; sub: string } | null>(null);

  const motionOff = store.store.readerPrefs.motionSafe || store.store.atmosphere === 'minimal';

  const traverse = useCallback((text: string, sub: string, fn: () => void, cinematic: boolean) => {
    if (!cinematic || motionOff) { fn(); window.scrollTo(0, 0); return; }
    setVeil({ text, sub });
    setTimeout(() => { fn(); window.scrollTo(0, 0); }, 450);
    setTimeout(() => setVeil(null), 950);
  }, [motionOff]);

  const goHome = useCallback((cinematic = false) => traverse('The Grand Atrium', 'All portals await', () => setView({ name: 'atrium' }), cinematic), [traverse]);
  const goRoom = useCallback((roomId: RoomId, cinematic = true) => {
    const r = getRoom(roomId);
    traverse(r.name, r.subtitle, () => setView({ name: 'room', roomId }), cinematic);
  }, [traverse]);

  const [readerPage, setReaderPage] = useState(0);
  const openChapter = useCallback((bookId: string, chapterId: string, page = 0) => {
    const b = getBook(bookId);
    if (!b || b.chapters.length === 0) { setDetailBook(bookId); return; }
    const ch = b.chapters.find((c) => c.id === chapterId) ?? b.chapters[0];
    setDetailBook(null); setSearchOpen(false);
    setReaderPage(page);
    setView({ name: 'reader', bookId, chapterId: ch.id });
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => { if (!store.store.onboardingSeen) store.markOnboarded(); }, [store]);

  const roomId = view.name === 'reader' ? getBook(view.bookId)?.roomId ?? null : view.name === 'room' ? view.roomId : null;

  return (
    <div className="min-h-screen bg-[#060312]">
      {view.name !== 'reader' && (
        <Chrome
          view={view.name}
          roomId={roomId}
          atmosphere={store.store.atmosphere}
          setAtmosphere={store.setAtmosphere}
          onHome={() => goHome(false)}
          onRoom={(r) => goRoom(r, false)}
          onSearch={() => setSearchOpen(true)}
          onSoulHub={() => setSoulOpen(true)}
          onCodex={() => setCodexOpen(true)}
        />
      )}

      {view.name === 'atrium' && (
        <Atrium store={store} onRoom={(r) => goRoom(r, true)} onOpenBook={setDetailBook} onOpenChapter={openChapter} onSearch={() => setSearchOpen(true)} />
      )}
      {view.name === 'room' && (
        <RoomView roomId={view.roomId} store={store} onBack={() => goHome(true)} onOpenBook={setDetailBook} onOpenChapter={openChapter} />
      )}
      {view.name === 'reader' && (
        <LivingTome
          key={view.bookId + view.chapterId + readerPage}
          bookId={view.bookId}
          chapterId={view.chapterId}
          initialPage={readerPage}
          store={store}
          onClose={() => {
            const b = getBook(view.bookId);
            if (b) setView({ name: 'room', roomId: b.roomId });
            else setView({ name: 'atrium' });
          }}
          onNavigate={openChapter}
        />
      )}

      {detailBook && (
        <BookDetail bookId={detailBook} store={store} onClose={() => setDetailBook(null)} onRead={openChapter} onOpenBook={setDetailBook} />
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpenBook={(id) => { setSearchOpen(false); setDetailBook(id); }} onOpenChapter={openChapter} />
      {soulOpen && <SoulHubNotice route={store.store.soulHubRoute} onClose={() => setSoulOpen(false)} onEdit={store.setSoulHubRoute} />}
      {codexOpen && <CodexModal onClose={() => setCodexOpen(false)} />}

      {/* cinematic traversal veil */}
      {veil && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#060312]">
          <Starfield atmosphere="full" />
          <div className="relative px-6 text-center" style={{ animation: 'riseIn .5s ease both' }}>
            <div className="text-[11px] uppercase tracking-[0.4em] text-[#e8c476]">Traversing the Library</div>
            <div className="font-display mt-2 text-4xl font-semibold text-[#fdf6e3] sm:text-5xl">{veil.text}</div>
            <div className="font-display mt-1 text-lg italic text-[#a89a7c]">{veil.sub}</div>
            <div className="gold-rule mx-auto mt-4 w-48" />
          </div>
        </div>
      )}
    </div>
  );
}

function CodexModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass ornate-frame max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e8c476]">Builder’s Codex</div>
            <h3 className="font-display text-2xl font-semibold text-[#fdf6e3]">Integration Guide & Changelog</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/15 p-1.5 text-[#a89a7c]" aria-label="Close"><X size={15} /></button>
        </div>
        <div className="mt-3 text-xs text-[#8a7c5c]">Library prototype {LIBRARY_VERSION} · React + Tailwind · Static build (index.html at root) · No backend, auth, or paid APIs.</div>
        <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[11.5px] leading-relaxed text-[#d8cdb4]">{INTEGRATION_GUIDE}</pre>
        <h4 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8c476]">Changelog</h4>
        <ul className="mt-2 space-y-2">
          {CHANGELOG.map((c) => (
            <li key={c.v} className="rounded-lg border border-white/10 bg-black/25 p-3 text-xs text-[#c9bda0]">
              <span className="font-semibold text-[#f7dd9a]">v{c.v}</span> <span className="text-[#8a7c5c]">· {c.date}</span>
              <span className="mt-1 block leading-relaxed">{c.notes}</span>
            </li>
          ))}
        </ul>
        <h4 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8c476]">Honest limits of this prototype</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-[#a89a7c]">
          <li>Forthcoming volumes are honest placeholders — no fake “read” buttons; unavailable books never pretend to be complete.</li>
          <li>All persistence is browser-local (localStorage). Soul Hub / Your Journey / account sync are integration hooks, not live backends.</li>
          <li>Public-domain texts are identified selections (translator, edition, source); modern copyrighted translations are excluded by design.</li>
          <li>Living Page illustrations are interpretive art with annotations — never presented as scripture or authentic dialogue.</li>
        </ul>
      </div>
    </div>
  );
}

```

## src/components/Atrium.tsx

```tsx
import { ArrowRight, Bookmark as BookmarkIcon, Clock, Play, Search, Sparkles, ScrollText } from 'lucide-react';
import { rooms, featuredBooks, getBook, readableBooks } from '../data/library';
import type { LibraryStore } from '../hooks/useLibraryStore';
import type { RoomId } from '../data/types';
import Starfield from './Starfield';
import BookCover from './BookCover';

interface Props {
  store: LibraryStore;
  onRoom: (r: RoomId) => void;
  onOpenBook: (bookId: string) => void;
  onOpenChapter: (bookId: string, chapterId: string, page?: number) => void;
  onSearch: () => void;
}

export default function Atrium({ store, onRoom, onOpenBook, onOpenChapter, onSearch }: Props) {
  const { store: s, continueReading } = store;
  const featured = featuredBooks();
  const readable = readableBooks();

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* environment */}
      <div className="fixed inset-0 -z-10">
        <img src="images/atrium.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060312]/72 via-[#060312]/55 to-[#060312]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,.28), transparent 60%)' }} />
      </div>
      <Starfield atmosphere={s.atmosphere} density={1.15} />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
        {/* hero */}
        <section className="animate-rise mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c476]/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[#e8c476]">
            <Sparkles size={12} /> Inner Orbit presents
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            <span className="gold-text">The Celestial Library</span>
          </h1>
          <p className="font-display mt-3 text-xl italic text-[#d8cdb4] sm:text-2xl">“Boldly go where you’ve always been.”</p>
          <p className="text-balance mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#c9bda0] sm:text-[15px]">
            An impossible repository among the stars — sacred texts, philosophy, consciousness, and hidden patterns —
            gathered for wonder, tranquility, and return. Choose a portal below. Every room tells you plainly what it holds.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <button onClick={onSearch} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8a5a1c] to-[#c99a3f] px-6 py-2.5 text-sm font-semibold text-[#120b2e] shadow-[0_0_30px_rgba(232,196,118,.45)] transition hover:brightness-110">
              <Search size={15} /> Search the entire library
            </button>
            {continueReading && (
              <button onClick={() => onOpenChapter(continueReading.bookId, continueReading.chapterId)} className="glass flex items-center gap-2 rounded-full px-6 py-2.5 text-sm text-[#f7dd9a] transition hover:bg-[#e8c476]/15">
                <Play size={15} /> Continue: {continueReading.bookTitle}
              </button>
            )}
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-[#8a7c5c]">{readable.length} readable works · {readable.reduce((n, b) => n + b.chapters.length, 0)} illuminated readings</div>
        </section>

        {/* portals */}
        <section className="mt-12" aria-label="Library rooms">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {rooms.map((r, i) => {
              const count = readableBooks().filter((b) => b.roomId === r.id).reduce((n, b) => n + b.chapters.length, 0);
              return (
                <article
                  key={r.id}
                  className="animate-rise group relative cursor-pointer overflow-hidden rounded-2xl border border-[#e8c476]/25 transition duration-300 hover:-translate-y-1.5 hover:border-[#e8c476]/60 hover:shadow-[0_20px_60px_rgba(0,0,0,.6)]"
                  style={{ animationDelay: `${i * 90}ms`, boxShadow: `0 0 40px ${r.glow}` }}
                  onClick={() => onRoom(r.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onRoom(r.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Enter ${r.name}: ${r.subtitle}`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={r.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0722] via-[#0b0722]/30 to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/50 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: r.accent, borderColor: r.accent + '66', background: 'rgba(0,0,0,.5)' }}>
                      {count} readings
                    </span>
                  </div>
                  <div className="relative bg-gradient-to-b from-[#0b0722] to-[#060312] p-5 pt-3">
                    <h2 className="font-display text-[22px] font-semibold leading-tight text-[#fdf6e3]">{r.name}</h2>
                    <p className="mt-1 text-[12.5px] font-medium" style={{ color: r.accent }}>{r.subtitle}</p>
                    <p className="mt-2 line-clamp-2 font-display text-[14px] italic leading-snug text-[#a89a7c]">“{r.motto}”</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#f7dd9a] transition group-hover:gap-3">
                      Enter the room <ArrowRight size={15} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* dashboard */}
        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {/* continue / recent */}
          <div className="glass rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8c476]"><Clock size={13} /> Continue reading</h3>
            {continueReading ? (
              <button onClick={() => onOpenChapter(continueReading.bookId, continueReading.chapterId)} className="mt-3 w-full rounded-xl border border-[#e8c476]/25 bg-black/30 p-4 text-left transition hover:bg-[#e8c476]/10">
                <div className="font-display text-lg font-semibold text-[#fdf6e3]">{continueReading.bookTitle}</div>
                <div className="text-xs text-[#a89a7c]">{continueReading.chapterTitle} · page {continueReading.page + 1} of {continueReading.totalPages}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#8a5a1c] to-[#f7dd9a]" style={{ width: `${Math.round(continueReading.percent * 100)}%` }} />
                </div>
              </button>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[#a89a7c]">Your journey hasn’t begun. Open any reading — the Library will keep your place among the stars.</p>
            )}
            {s.recent.length > 0 && (
              <div className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7c5c]">Recently visited</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.recent.slice(0, 6).map((r, i) => {
                    const b = getBook(r.bookId);
                    if (!b) return null;
                    return (
                      <button key={i} onClick={() => (r.chapterId ? onOpenChapter(r.bookId, r.chapterId) : onOpenBook(r.bookId))} className="max-w-full truncate rounded-full border border-white/12 px-3 py-1 text-xs text-[#c9bda0] transition hover:border-[#e8c476]/50 hover:text-[#f7dd9a]">
                        {b.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* bookmarks */}
          <div className="glass rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8c476]"><BookmarkIcon size={13} /> Personal bookmarks · {s.bookmarks.length}</h3>
            {s.bookmarks.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-[#a89a7c]">Mark any page with the ribbon while reading and it will wait for you here — kept privately in this browser.</p>
            ) : (
              <ul className="mt-3 max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {s.bookmarks.slice(0, 8).map((bm) => (
                  <li key={bm.id}>
                    <button onClick={() => onOpenChapter(bm.bookId, bm.chapterId, bm.page)} className="flex w-full items-center gap-2 rounded-lg border border-white/8 bg-black/25 px-3 py-2 text-left text-xs transition hover:border-[#e8c476]/40">
                      <BookmarkIcon size={12} className="shrink-0 text-[#e8c476]" />
                      <span className="min-w-0 truncate text-[#d8cdb4]">{bm.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 border-t border-white/8 pt-2 text-[11px] italic text-[#8a7c5c]">Stored locally in this prototype — never implied to be a server account.</p>
          </div>

          {/* about tome */}
          <div className="glass rounded-2xl border-[#c9a8ff]/25 p-5" style={{ boxShadow: '0 0 40px rgba(124,58,237,.2)' }}>
            <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c9a8ff]"><ScrollText size={13} /> The Living Tome</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#c9bda0]">
              Every reading opens as a handcrafted tome — real pages that turn, Essence layers that illuminate without cluttering, and Living Pages where illustrations wake at your touch.
            </p>
            <button onClick={() => onOpenChapter('tao-te-ching', 'ttc-8')} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#f7dd9a] hover:gap-3 transition-all">
              Open a first reading: Water <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* featured */}
        <section className="mt-10" aria-label="Featured works">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#fdf6e3]">Featured Works</h2>
              <div className="gold-rule mt-2 w-40" />
            </div>
            <span className="text-xs text-[#8a7c5c]">Public-domain sources & original companions</span>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pb-4">
            {featured.map((b) => (
              <button key={b.id} onClick={() => onOpenBook(b.id)} className="group flex shrink-0 flex-col items-center gap-2.5 text-center transition hover:-translate-y-1.5" aria-label={`View ${b.title}`}>
                <div className="transition group-hover:drop-shadow-[0_0_25px_rgba(232,196,118,.45)]">
                  <BookCover cover={b.cover} title={b.title} author={b.author} size="md" />
                </div>
                <span className="w-40">
                  <span className="font-display block text-[15px] font-semibold leading-tight text-[#fdf6e3]">{b.title}</span>
                  <span className="mt-0.5 block text-[11px] text-[#a89a7c]">{b.status === 'forthcoming' ? 'Awaiting' : `${b.chapters.length} readings`} · {rooms.find((r) => r.id === b.roomId)?.name.replace('The ', '')}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-[#e8c476]/15 pt-6 text-center text-[11px] leading-relaxed text-[#8a7c5c]">
          <p className="font-display text-sm italic text-[#a89a7c]">“Boldly go where you’ve always been.”</p>
          <p className="mt-2">The Celestial Library · prototype {`v0.1`} · Public-domain texts with attribution · Inner Orbit commentary is original · Progress stays in your browser.</p>
        </footer>
      </main>
    </div>
  );
}

```

## src/components/BookCover.tsx

```tsx
import type { ReactElement } from 'react';
import type { CoverSpec } from '../data/types';

const MOTIFS: Record<string, ReactElement> = {
  tao: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M32 10a22 22 0 010 44 11 11 0 010-22 11 11 0 000-22z" fill="currentColor" opacity=".85"/><circle cx="32" cy="21" r="3" fill="var(--cover-base,#0f2b26)"/><circle cx="32" cy="43" r="3" fill="currentColor"/></svg>
  ),
  gita: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="1.4"/>{Array.from({length:8}).map((_,i)=>(<line key={i} x1="32" y1="32" x2={32+20*Math.cos(i*Math.PI/4)} y2={32+20*Math.sin(i*Math.PI/4)} stroke="currentColor" strokeWidth="1"/>))}<circle cx="32" cy="32" r="3.5" fill="currentColor"/></svg>
  ),
  dharma: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2.4"/>{Array.from({length:8}).map((_,i)=>(<line key={i} x1="32" y1="32" x2={32+20*Math.cos(i*Math.PI/4)} y2={32+20*Math.sin(i*Math.PI/4)} stroke="currentColor" strokeWidth="1.6"/>))}<circle cx="32" cy="32" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
  ),
  tree: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M32 54V28M32 28C26 24 20 22 14 22c6-2 12-1 18 3 6-4 12-5 18-3-6 0-12 2-18 6zM32 40c-5-1-9 0-12 3 4 0 8 0 12-1 4 1 8 1 12 1-3-3-7-4-12-3z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="32" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M24 54c3-2 5-2 8 0 3-2 5-2 8 0" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
  ),
  stoic: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M14 54V30l6-4v-6l6-4 6 4 6-4 6 4v6l6 4v24" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M14 54h36M20 54V32m8 22V26m8 28V26m8 28V32" stroke="currentColor" strokeWidth="1.4"/></svg>
  ),
  eye: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M8 32s10-14 24-14 24 14 24 14-10 14-24 14S8 32 8 32z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="32" r="7" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="32" cy="32" r="2.6" fill="currentColor"/></svg>
  ),
  geometry: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1.4"/>{[0,60,120].map(a=>(<ellipse key={a} cx="32" cy="32" rx="20" ry="8" fill="none" stroke="currentColor" strokeWidth="1.1" transform={`rotate(${a} 32 32)`}/>))}<circle cx="32" cy="32" r="3" fill="currentColor"/></svg>
  ),
  mandala: (
    <svg viewBox="0 0 64 64" className="h-full w-full">{[20,14,8].map(r=>(<circle key={r} cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="1.2"/>))}{Array.from({length:12}).map((_,i)=>(<circle key={i} cx={32+14*Math.cos(i*Math.PI/6)} cy={32+14*Math.sin(i*Math.PI/6)} r="2" fill="none" stroke="currentColor" strokeWidth="1"/>))}<circle cx="32" cy="32" r="2.4" fill="currentColor"/></svg>
  ),
  spiral: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M32 32c0-1 2-1 2 0 0 3-4 4-6 2-3-3 0-9 5-9 7 0 10 8 7 14-4 8-15 8-20 1-6-8-1-19 9-21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="32" cy="32" r="1.8" fill="currentColor"/></svg>
  ),
  scroll: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M18 12h28a6 6 0 016 6v28a6 6 0 01-6 6H18a6 6 0 01-6-6V18a6 6 0 016-6z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M22 24h20M22 30h20M22 36h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ),
  flame: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M32 8s12 12 12 24a12 12 0 01-24 0c0-6 3-9 5-13 1 3 3 5 5 5-.5-6 0-11 2-16z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="36" r="4" fill="currentColor" opacity=".8"/></svg>
  ),
  lotus: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M32 12s5 8 5 15a5 5 0 01-10 0c0-7 5-15 5-15zM14 26s8 1 14 7M50 26s-8 1-14 7M18 44s6 6 14 6 8 0 14-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M32 20v22" stroke="currentColor" strokeWidth="1.2"/></svg>
  ),
  millennial: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><rect x="16" y="10" width="32" height="44" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="32" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M32 23v18M23 32h18" stroke="currentColor" strokeWidth="1.2"/><circle cx="32" cy="48" r="1.6" fill="currentColor"/></svg>
  ),
  dream: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M40 10a20 20 0 100 44 16 16 0 110-44z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M44 22l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="currentColor"/></svg>
  ),
  alch: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><path d="M32 10l16 28H16z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M32 54L16 26h32z" fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".7"/><circle cx="32" cy="32" r="5" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>
  ),
  star: (
    <svg viewBox="0 0 64 64" className="h-full w-full"><circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M32 12v40M12 32h40M18 18l28 28M46 18L18 46" stroke="currentColor" strokeWidth="1"/><circle cx="32" cy="32" r="4" fill="currentColor"/></svg>
  ),
};

interface Props {
  cover: CoverSpec;
  title: string;
  author: string;
  size?: 'sm' | 'md' | 'lg';
  status?: string;
}

const SIZES = {
  sm: 'w-28 h-40 text-[9px]',
  md: 'w-40 h-60 text-[11px]',
  lg: 'w-56 h-80 text-[13px]',
};

export default function BookCover({ cover, title, author, size = 'md', status }: Props) {
  const [c1, c2] = cover.base.split(',');
  const texture =
    cover.material === 'leather'
      ? 'repeating-linear-gradient(100deg, rgba(0,0,0,.14) 0 2px, transparent 2px 5px)'
      : cover.material === 'metal'
        ? 'linear-gradient(115deg, rgba(255,255,255,.16), transparent 40%, rgba(0,0,0,.25) 60%, rgba(255,255,255,.1))'
        : cover.material === 'silk'
          ? 'repeating-linear-gradient(175deg, rgba(255,255,255,.05) 0 3px, transparent 3px 8px)'
          : cover.material === 'crystal'
            ? 'linear-gradient(140deg, rgba(255,255,255,.22), transparent 45%, rgba(255,255,255,.08))'
            : 'repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 1px, transparent 1px 4px)';

  return (
    <div
      className={`cover-sheen relative flex shrink-0 flex-col justify-between overflow-hidden rounded-r-md rounded-l-[2px] p-3 ${SIZES[size]}`}
      style={{
        background: `${texture}, linear-gradient(150deg, ${c1}, ${c2})`,
        border: '1px solid rgba(0,0,0,.6)',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,.45), 8px 14px 30px rgba(0,0,0,.55)',
        ['--cover-base' as string]: c1,
        color: cover.accent,
      }}
    >
      {/* spine */}
      <div className="absolute inset-y-0 left-0 w-[10px]" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,.55), rgba(255,255,255,.12) 60%, rgba(0,0,0,.4))' }} />
      <div className="absolute inset-y-0 left-[10px] w-px bg-black/50" />
      {/* gilt frame */}
      <div className="pointer-events-none absolute inset-2 left-4 rounded-[3px] border opacity-70" style={{ borderColor: cover.accent }} />
      <div className="pointer-events-none absolute inset-3 left-5 rounded-[2px] border opacity-30" style={{ borderColor: cover.accent }} />

      <div className="relative ml-3 text-center">
        <div className="mx-auto mb-1 h-8 w-8 opacity-95" style={{ color: cover.accent, filter: 'drop-shadow(0 0 6px rgba(0,0,0,.6))' }}>
          {MOTIFS[cover.motif] ?? MOTIFS.star}
        </div>
        {cover.gem && (
          <div className="mx-auto h-2 w-2 rotate-45" style={{ background: cover.gem, boxShadow: `0 0 8px ${cover.gem}` }} />
        )}
      </div>
      <div className="relative ml-3 text-center">
        <div className="font-display font-semibold leading-tight" style={{ color: '#fdf6e3', textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>{title}</div>
        <div className="mt-1 truncate text-[0.72em] uppercase tracking-[0.14em] opacity-80">{author}</div>
        {status === 'forthcoming' && (
          <div className="mx-auto mt-2 inline-block rounded-full border border-current px-2 py-px text-[0.68em] uppercase tracking-widest opacity-80">Awaiting</div>
        )}
      </div>
      {/* page edges */}
      <div className="absolute inset-y-1 right-0 w-[3px] rounded-r bg-gradient-to-b from-[#e8dcc0] via-[#cbb98f] to-[#e8dcc0] opacity-90" />
    </div>
  );
}

```

## src/components/BookDetail.tsx

```tsx
import { X, Play, BookOpen, ScrollText, Link2, ShieldCheck, Clock } from 'lucide-react';
import { getBook, getRoom } from '../data/library';
import type { LibraryStore } from '../hooks/useLibraryStore';
import BookCover from './BookCover';

interface Props {
  bookId: string;
  store: LibraryStore;
  onClose: () => void;
  onRead: (bookId: string, chapterId: string) => void;
  onOpenBook: (bookId: string) => void;
}

export default function BookDetail({ bookId, store, onClose, onRead, onOpenBook }: Props) {
  const book = getBook(bookId);
  const { store: s } = store;
  if (!book) return null;
  const room = getRoom(book.roomId);
  const prog = s.progress[book.id];
  const readable = book.chapters.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="glass ornate-frame flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-28 shrink-0 overflow-hidden sm:h-36">
          <img src={room.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0722] via-[#0b0722]/60 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur" aria-label="Close book details"><X size={16} /></button>
          <div className="absolute bottom-2 left-5 text-[11px] uppercase tracking-[0.25em]" style={{ color: room.accent }}>{room.name} · {room.subtitle}</div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-3">
              <BookCover cover={book.cover} title={book.title} author={book.author} size="lg" status={book.status} />
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${book.status === 'forthcoming' ? 'border border-white/20 text-[#a89a7c]' : book.status === 'complete' ? 'bg-[#8fd6a0]/20 text-[#8fd6a0]' : 'bg-[#e8c476]/20 text-[#f7dd9a]'}`}>
                {book.status === 'forthcoming' ? 'Awaiting content' : book.status === 'complete' ? '● Complete' : '◐ Curated selection'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-3xl font-semibold leading-tight text-[#fdf6e3] sm:text-4xl">{book.title}</h2>
              <p className="mt-1 text-sm text-[#a89a7c]">{book.author}</p>
              <p className="mt-1 text-xs italic text-[#8a7c5c]">{book.tradition}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#d8cdb4]">{book.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {book.subjects.map((t) => (<span key={t} className="rounded-full border border-[#e8c476]/30 px-2.5 py-0.5 text-[11px] text-[#e8c476]">{t}</span>))}
                {book.themes.slice(0, 4).map((t) => (<span key={t} className="rounded-full border border-white/12 px-2.5 py-0.5 text-[11px] text-[#a89a7c]">{t}</span>))}
              </div>
              {prog && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#a89a7c]">
                  <Clock size={13} /> Resume: {prog.chapterTitle} · {Math.round(prog.percent * 100)}%
                  <button onClick={() => onRead(book.id, prog.chapterId)} className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#e8c476]/20 px-3 py-1 font-medium text-[#f7dd9a] transition hover:bg-[#e8c476]/35"><Play size={12} /> Resume</button>
                </div>
              )}
            </div>
          </div>

          {/* TOC */}
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8c476]"><ScrollText size={13} /> {readable ? `Contents · ${book.chapters.length} readings` : 'Contents'} {book.pagesEstimate && <span className="font-normal normal-case text-[#8a7c5c]">— {book.pagesEstimate}</span>}</h3>
            {readable ? (
              <div className="mt-2.5 space-y-2">
                {book.chapters.map((c, i) => {
                  const isCurrent = prog?.chapterId === c.id;
                  return (
                    <button key={c.id} onClick={() => onRead(book.id, c.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${isCurrent ? 'border-[#e8c476]/60 bg-[#e8c476]/10' : 'border-white/8 bg-black/25 hover:border-[#e8c476]/40 hover:bg-[#e8c476]/5'}`}>
                      <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8c476]/40 text-sm text-[#f7dd9a]">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block truncate text-[16px] font-semibold text-[#fdf6e3]">{c.title}</span>
                        <span className="block truncate text-xs text-[#a89a7c]">{c.subtitle ?? c.sourceLabel}{c.livingPage ? ' · ✦ Living Page' : ''}</span>
                      </span>
                      <BookOpen size={16} className="shrink-0 text-[#e8c476]" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2.5 rounded-xl border border-dashed border-white/15 bg-black/25 p-5 text-center">
                <p className="font-display text-lg italic text-[#a89a7c]">This volume still sleeps in the vaults.</p>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#8a7c5c]">No readable content yet — this entry is an honest placeholder, never a false promise. Verified public-domain or original text will appear here with full Essence layers. Explore the related works below meanwhile.</p>
              </div>
            )}
          </div>

          {/* rights registry */}
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
            <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8a7c5c]"><ShieldCheck size={13} /> Content rights registry</h3>
            <dl className="mt-2.5 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
              <div><dt className="text-[#8a7c5c]">Work</dt><dd className="text-[#d8cdb4]">{book.title} — {book.author}</dd></div>
              {book.edition.translator && <div><dt className="text-[#8a7c5c]">Translator</dt><dd className="text-[#d8cdb4]">{book.edition.translator}</dd></div>}
              <div><dt className="text-[#8a7c5c]">Edition</dt><dd className="text-[#d8cdb4]">{book.edition.edition}</dd></div>
              <div><dt className="text-[#8a7c5c]">Source</dt><dd className="text-[#d8cdb4]">{book.edition.source}</dd></div>
              <div><dt className="text-[#8a7c5c]">Rights</dt><dd className="text-[#d8cdb4]">{book.edition.rights}</dd></div>
              <div><dt className="text-[#8a7c5c]">Completeness</dt><dd className="text-[#d8cdb4]">{book.edition.completeness}</dd></div>
            </dl>
          </div>

          {/* related */}
          {book.related.length > 0 && (
            <div className="mt-6">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8c476]"><Link2 size={13} /> Cross-library connections</h3>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {book.related.map((r) => {
                  const rb = getBook(r.bookId);
                  if (!rb) return null;
                  return (
                    <button key={r.bookId} onClick={() => onOpenBook(r.bookId)} className="rounded-xl border border-white/8 bg-black/25 p-3 text-left transition hover:border-[#e8c476]/40 hover:bg-[#e8c476]/5">
                      <div className="font-display text-[15px] font-semibold text-[#fdf6e3]">{rb.title}</div>
                      <div className="mt-0.5 text-[11px] text-[#a89a7c]">{rb.author}</div>
                      <div className="mt-1.5 text-xs italic leading-snug text-[#8a7c5c]">Why: {r.reason}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

```

## src/components/Chrome.tsx

```tsx
import { useState } from 'react';
import { Search, Sparkles, ChevronDown, Home, BookOpen, Leaf, Eye, Shapes, ArrowLeft, Settings2, X } from 'lucide-react';
import { rooms } from '../data/library';
import type { Atmosphere, RoomId } from '../data/types';

const ROOM_ICONS: Record<RoomId, React.ReactNode> = {
  wisdom: <BookOpen size={14} />,
  becoming: <Leaf size={14} />,
  visionary: <Eye size={14} />,
  patterns: <Shapes size={14} />,
};

interface Props {
  view: string;
  roomId: RoomId | null;
  atmosphere: Atmosphere;
  setAtmosphere: (a: Atmosphere) => void;
  onHome: () => void;
  onRoom: (r: RoomId) => void;
  onSearch: () => void;
  onSoulHub: () => void;
  onCodex: () => void;
}

export default function Chrome({ view, roomId, atmosphere, setAtmosphere, onHome, onRoom, onSearch, onSoulHub, onCodex }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [atmOpen, setAtmOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#e8c476]/20 bg-[#060312]/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-5">
        {view !== 'atrium' ? (
          <button onClick={onHome} className="flex items-center gap-1.5 rounded-full border border-[#e8c476]/30 px-3 py-1.5 text-xs text-[#e8c476] transition hover:bg-[#e8c476]/10" aria-label="Return to Grand Atrium">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Atrium</span>
          </button>
        ) : (
          <button onClick={onHome} className="flex items-center gap-2" aria-label="Inner Orbit home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8c476]/60 bg-gradient-to-br from-[#3b2566] to-[#120b2e] text-[#f7dd9a]">
              <Sparkles size={16} />
            </span>
            <span className="hidden text-left leading-none md:block">
              <span className="font-display block text-[17px] font-semibold tracking-wide text-[#fdf6e3]">INNER ORBIT</span>
              <span className="block text-[9px] uppercase tracking-[0.28em] text-[#a89a7c]">Celestial Library</span>
            </span>
          </button>
        )}

        {/* fast nav */}
        <nav className="ml-1 flex items-center gap-1" aria-label="Fast navigation">
          <button onClick={onHome} className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition sm:flex ${view === 'atrium' ? 'bg-[#e8c476]/20 text-[#f7dd9a]' : 'text-[#c9bda0] hover:bg-white/5'}`}>
            <Home size={13} /> Atrium
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${view === 'room' || view === 'reader' ? 'bg-[#e8c476]/20 text-[#f7dd9a]' : 'text-[#c9bda0] hover:bg-white/5'}`} aria-expanded={menuOpen}>
              {roomId ? ROOM_ICONS[roomId] : <BookOpen size={13} />}
              <span className="max-w-[110px] truncate sm:max-w-none">{roomId ? rooms.find((r) => r.id === roomId)?.name : 'Rooms'}</span>
              <ChevronDown size={12} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="glass absolute left-0 z-20 mt-2 w-72 overflow-hidden rounded-xl p-1.5 shadow-2xl">
                  {rooms.map((r) => (
                    <button key={r.id} onClick={() => { onRoom(r.id); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#e8c476]/10">
                      <span style={{ color: r.accent }}>{ROOM_ICONS[r.id]}</span>
                      <span>
                        <span className="font-display block text-[15px] font-semibold text-[#fdf6e3]">{r.name}</span>
                        <span className="block text-[11px] text-[#a89a7c]">{r.subtitle}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button onClick={onSearch} className="flex items-center gap-1.5 rounded-full border border-[#e8c476]/30 bg-[#e8c476]/5 px-3 py-1.5 text-xs text-[#e8c476] transition hover:bg-[#e8c476]/15" aria-label="Search the entire library">
            <Search size={14} /> <span className="hidden md:inline">Search all</span>
            <kbd className="hidden rounded border border-[#e8c476]/30 px-1 text-[10px] opacity-70 lg:inline">/</kbd>
          </button>
          <div className="relative">
            <button onClick={() => setAtmOpen(!atmOpen)} className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#c9bda0] transition hover:bg-white/5" aria-label="Atmosphere settings" aria-expanded={atmOpen}>
              <Settings2 size={14} /> <span className="hidden capitalize sm:inline">{atmosphere}</span>
            </button>
            {atmOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAtmOpen(false)} />
                <div className="glass absolute right-0 z-20 mt-2 w-60 rounded-xl p-2 shadow-2xl">
                  <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a89a7c]">Atmosphere</div>
                  {(['full', 'subtle', 'minimal'] as Atmosphere[]).map((a) => (
                    <button key={a} onClick={() => { setAtmosphere(a); setAtmOpen(false); }} className={`flex w-full flex-col rounded-lg px-3 py-2 text-left transition hover:bg-[#e8c476]/10 ${atmosphere === a ? 'bg-[#e8c476]/15' : ''}`}>
                      <span className="text-sm capitalize text-[#fdf6e3]">{a} {atmosphere === a && '✓'}</span>
                      <span className="text-[11px] text-[#a89a7c]">{a === 'full' ? 'Rich particles, drift & cinematic motion' : a === 'subtle' ? 'Beauty kept, motion softened' : 'Still, lightweight, calm'}</span>
                    </button>
                  ))}
                  <button onClick={() => { onCodex(); setAtmOpen(false); }} className="mt-1 flex w-full items-center justify-between rounded-lg border-t border-[#e8c476]/20 px-3 py-2 text-left text-xs text-[#a89a7c] transition hover:bg-white/5">
                    Integration guide & changelog <span>→</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <button onClick={onSoulHub} className="rounded-full bg-gradient-to-r from-[#8a5a1c] to-[#c99a3f] px-3 py-1.5 text-xs font-semibold text-[#120b2e] shadow-[0_0_18px_rgba(232,196,118,.4)] transition hover:brightness-110" title="Return to Soul Hub">
            ✦ Soul Hub
          </button>
        </div>
      </div>
    </header>
  );
}

export function SoulHubNotice({ route, onClose, onEdit }: { route: string; onClose: () => void; onEdit: (r: string) => void }) {
  const [val, setVal] = useState(route);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass ornate-frame ornate-corner w-full max-w-md rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h3 className="font-display text-2xl font-semibold text-[#fdf6e3]">Return to Soul Hub</h3>
          <button onClick={onClose} className="rounded-full border border-white/15 p-1.5 text-[#a89a7c]" aria-label="Close"><X size={15} /></button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#c9bda0]">
          In the full Inner Orbit universe this control returns you to the <em>Soul Hub</em>. This prototype is standalone, so the route below is configurable — set it to your Soul Hub path now, and the button will navigate there when integrated.
        </p>
        <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a89a7c]">Integration route</label>
        <div className="mt-1.5 flex gap-2">
          <input value={val} onChange={(e) => setVal(e.target.value)} className="flex-1 rounded-lg border border-[#e8c476]/30 bg-black/40 px-3 py-2 font-mono text-sm text-[#f7dd9a] outline-none focus:border-[#e8c476]" aria-label="Soul Hub route" />
          <button onClick={() => { onEdit(val); onClose(); }} className="rounded-lg bg-[#e8c476] px-4 py-2 text-sm font-semibold text-[#1a1030]">Save</button>
        </div>
        <a href={val} onClick={(e) => e.stopPropagation()} className="mt-3 inline-block text-xs text-[#7fb8ff] underline">Try navigating to {val} →</a>
        <p className="mt-3 border-t border-[#e8c476]/20 pt-3 text-[11px] text-[#8a7c5c]">Prototype data (progress, bookmarks, notes) lives only in this browser — nothing here implies a server account.</p>
      </div>
    </div>
  );
}

```

## src/components/LivingPages.tsx

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Info, RotateCcw, Eye, EyeOff, VolumeX } from 'lucide-react';
import type { LivingPageId } from '../data/types';

/* ---------------------------------- shell ---------------------------------- */
function Shell({ title, caption, alt, children, onClose }: { title: string; caption: string; alt: string; children: React.ReactNode; onClose?: () => void }) {
  const [showAlt, setShowAlt] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-[#e8c476]/40 bg-[#0b0722]/95 shadow-[0_0_60px_rgba(124,58,237,.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#e8c476]/25 bg-gradient-to-r from-[#241645] to-[#120b2e] px-4 py-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e8c476]">✦ Living Page ✦</div>
          <h4 className="font-display text-xl font-semibold text-[#fdf6e3]">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAlt(!showAlt)} className="rounded-full border border-[#e8c476]/40 p-2 text-[#e8c476] transition hover:bg-[#e8c476]/15" aria-label="Toggle accessible description" title="Accessible description">
            {showAlt ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {onClose && <button onClick={onClose} className="rounded-full border border-[#e8c476]/40 px-3 py-1.5 text-xs text-[#e8c476] transition hover:bg-[#e8c476]/15">Close</button>}
        </div>
      </div>
      {showAlt ? (
        <div className="max-h-72 overflow-y-auto p-5 text-sm leading-relaxed text-[#d8cdb4]"><span className="font-semibold text-[#e8c476]">Accessible description: </span>{alt}</div>
      ) : children}
      <div className="border-t border-[#e8c476]/20 px-4 py-2.5 text-xs italic text-[#a89a7c]">{caption}</div>
    </div>
  );
}

function ActivateGate({ onActivate, label, hint }: { onActivate: () => void; label: string; hint: string }) {
  return (
    <button onClick={onActivate} className="group flex w-full flex-col items-center gap-3 px-6 py-10 text-center transition hover:bg-white/[0.03]">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e8c476]/60 bg-[#e8c476]/10 text-[#f7dd9a] transition group-hover:scale-110 group-hover:bg-[#e8c476]/25" style={{ animation: 'portalGlow 3s ease-in-out infinite' }}>
        <Play size={22} className="ml-1" />
      </span>
      <span className="font-display text-lg text-[#fdf6e3]">{label}</span>
      <span className="max-w-md text-xs text-[#a89a7c]">{hint}</span>
    </button>
  );
}

/* -------------------------------- Tao Water -------------------------------- */
function TaoWater() {
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [notes, setNotes] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!active || !playing) return;
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight;
    const W = canvas.width, H = canvas.height;
    const drops = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      s: 0.6 + Math.random() * 1.8, o: Math.random() * Math.PI * 2,
      lane: Math.random(),
    }));
    // stones (avoid zones) as fractions
    const stones = [{ x: 0.32, y: 0.62, r: 0.09 }, { x: 0.58, y: 0.45, r: 0.07 }, { x: 0.74, y: 0.68, r: 0.11 }];
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const d of drops) {
        d.y -= d.s; d.x += Math.sin(d.o += 0.01) * 0.6;
        // flow around stones
        for (const st of stones) {
          const sx = st.x * W, sy = st.y * H, sr = st.r * W;
          const dx = d.x - sx, dy = d.y - sy, dist = Math.hypot(dx, dy);
          if (dist < sr + 26 && dist > 1) { d.x += (dx / dist) * 2.2; d.y += (dy / dist) * 0.8; }
        }
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,235,255,${0.25 + d.lane * 0.4})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    if (!reduced) draw();
    return () => cancelAnimationFrame(raf);
  }, [active, playing, reduced]);

  const annotations = [
    { x: '32%', y: '62%', t: 'The stones', d: 'Obstacles are not argued with. Water neither resents nor surrenders to stone — it relates to it, and passes.' },
    { x: '58%', y: '38%', t: 'The current', d: 'Wu wei: action without forcing. The stream is extremely active — nourishing everything — yet never contentious.' },
    { x: '76%', y: '24%', t: 'The mist', d: 'The unnamed source. Mountains fade into mystery — the Tao that cannot be told, from which all flowing comes.' },
  ];

  return (
    <Shell title="Water Around Stones" caption="After Tao Te Ching 8 · An interactive meditation on wu wei — action without unnecessary forcing. Illustration is interpretive, not scripture."
      alt="A misty mountain stream flows downward around three smooth dark stones. Animated light particles drift with the current, parting around the stones and rejoining below them. Three annotations mark the stones (obstacles met without contention), the current (wu wei), and the mountain mist (the unnamed source).">
      {!active ? (
        <ActivateGate onActivate={() => { setActive(true); setPlaying(!reduced); }} label="Awaken the stream" hint="Reader-controlled · no autoplay · motion respects your system settings. Activating starts a gentle flowing-water animation." />
      ) : (
        <div>
          <div ref={wrapRef} className="relative h-72 overflow-hidden sm:h-80">
            <img src="images/living-tao.jpg" alt="Mountain stream flowing around stones" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060312]/60 via-transparent to-transparent" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
            {notes && annotations.map((a, i) => (
              <div key={i} className="absolute z-10 w-48 -translate-x-1/2 rounded-lg border border-[#e8c476]/50 bg-[#060312]/90 p-2.5 text-left shadow-xl backdrop-blur" style={{ left: a.x, top: a.y }}>
                <div className="text-xs font-semibold text-[#f7dd9a]">{a.t}</div>
                <div className="mt-1 text-[11px] leading-snug text-[#d8cdb4]">{a.d}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <button onClick={() => setPlaying(!playing)} className="flex items-center gap-2 rounded-full bg-[#e8c476]/15 px-4 py-2 text-sm text-[#f7dd9a] transition hover:bg-[#e8c476]/30">
              {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? 'Still the water' : 'Set it flowing'}
            </button>
            <button onClick={() => setNotes(!notes)} className="flex items-center gap-2 rounded-full border border-[#e8c476]/40 px-4 py-2 text-sm text-[#e8c476] transition hover:bg-[#e8c476]/10">
              <Info size={15} /> {notes ? 'Hide annotations' : 'Reveal annotations'}
            </button>
            <span className="ml-auto hidden text-[11px] italic text-[#8a7c5c] sm:inline">Wu wei is not passivity — notice how active the water is.</span>
          </div>
        </div>
      )}
    </Shell>
  );
}

/* ------------------------------- Gita scene ------------------------------- */
function GitaChariot() {
  const [active, setActive] = useState(false);
  const [notes, setNotes] = useState(false);
  const [glow, setGlow] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const annotations = [
    { x: '42%', y: '42%', t: 'Krishna, the charioteer', d: 'The Divine as servant and friend — holding the reins. In later readings: the Self that steadies the mind’s horses.' },
    { x: '60%', y: '46%', t: 'Arjuna', d: 'The warrior in collapse — bow slipped from his hand. The teaching is given to despair, not to triumph.' },
    { x: '50%', y: '72%', t: 'The horses (senses)', d: 'Tradition reads the horses as senses, reins as mind, driver as intellect. Without Krishna, they bolt; with him, they fly straight.' },
    { x: '80%', y: '22%', t: 'Kurukshetra at dawn', d: 'The field of action — literal battlefield in the epic, inner field of duty and conscience for many interpreters.' },
  ];

  return (
    <Shell title="The Chariot at Kurukshetra" caption="After Bhagavad Gita 1–2 · A reverent interactive illumination. All animation is interpretive art; nothing animated here is scripture."
      alt="An illuminated painting of Krishna (blue-skinned, golden robes) holding the reins of four white horses, with Prince Arjuna beside him holding his bow, on a golden chariot at dawn. Armies stretch tiny into the distance. Annotations identify Krishna, Arjuna, the horses as senses, and the dawn field.">
      {!active ? (
        <ActivateGate onActivate={() => setActive(true)} label="Enter the illumination" hint="Reader-controlled · reveals the scene with optional dawn-light animation and contextual annotations." />
      ) : (
        <div>
          <div className="relative h-72 overflow-hidden sm:h-96">
            <img src="images/living-gita.jpg" alt="Krishna and Arjuna on the chariot at Kurukshetra" className="absolute inset-0 h-full w-full object-cover" style={glow && !reduced ? { animation: 'glowPulse 6s ease-in-out infinite' } : undefined} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060312]/70 via-transparent to-[#ff9d45]/10" />
            {glow && !reduced && <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,180,100,.25), transparent 60%)' }} />}
            {notes && annotations.map((a, i) => (
              <div key={i} className="absolute z-10 w-44 -translate-x-1/2 rounded-lg border border-[#e8c476]/50 bg-[#060312]/90 p-2.5 text-left shadow-xl backdrop-blur sm:w-52" style={{ left: a.x, top: a.y }}>
                <div className="text-xs font-semibold text-[#f7dd9a]">{a.t}</div>
                <div className="mt-1 text-[11px] leading-snug text-[#d8cdb4]">{a.d}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <button onClick={() => setGlow(!glow)} className="flex items-center gap-2 rounded-full bg-[#e8c476]/15 px-4 py-2 text-sm text-[#f7dd9a] transition hover:bg-[#e8c476]/30">
              <Play size={15} /> {glow ? 'Calm the dawn light' : 'Kindle dawn light'}
            </button>
            <button onClick={() => setNotes(!notes)} className="flex items-center gap-2 rounded-full border border-[#e8c476]/40 px-4 py-2 text-sm text-[#e8c476] transition hover:bg-[#e8c476]/10">
              <Info size={15} /> {notes ? 'Hide annotations' : 'Reveal annotations'}
            </button>
          </div>
          <p className="px-4 pb-4 text-[11px] leading-relaxed text-[#8a7c5c]">Treated with reverence: sacred figures are presented in traditional iconography (blue-skinned Krishna, princely Arjuna). No dialogue is invented; annotations offer context only.</p>
        </div>
      )}
    </Shell>
  );
}

/* ----------------------------- Geometry solids ---------------------------- */
type V3 = [number, number, number];
const SOLIDS: Record<string, { name: string; verts: V3[]; edges: [number, number][]; faces: number; element: string; note: string }> = {
  tetra: {
    name: 'Tetrahedron', faces: 4, element: 'Fire (Platonic association — interpretive)',
    note: '4 triangular faces · 4 vertices · 6 edges. Dual: itself.',
    verts: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
    edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
  },
  cube: {
    name: 'Cube (Hexahedron)', faces: 6, element: 'Earth (Platonic association — interpretive)',
    note: '6 square faces · 8 vertices · 12 edges. Dual: octahedron.',
    verts: [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]],
    edges: [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]],
  },
  octa: {
    name: 'Octahedron', faces: 8, element: 'Air (Platonic association — interpretive)',
    note: '8 triangular faces · 6 vertices · 12 edges. Dual: cube.',
    verts: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
    edges: [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]],
  },
  icosa: {
    name: 'Icosahedron', faces: 20, element: 'Water (Platonic association — interpretive)',
    note: '20 triangular faces · 12 vertices · 30 edges. Dual: dodecahedron.',
    verts: (() => { const t = (1 + Math.sqrt(5)) / 2; return [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]] as V3[]; })(),
    edges: [[0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],[2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],[4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11]],
  },
  dodeca: {
    name: 'Dodecahedron', faces: 12, element: 'Cosmos (Platonic association — interpretive)',
    note: '12 pentagonal faces · 20 vertices · 30 edges. Dual: icosahedron.',
    verts: (() => { const t = (1 + Math.sqrt(5)) / 2, it = 1 / t; return [[-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1],[1,-1,-1],[1,-1,1],[1,1,-1],[1,1,1],[0,-it,-t],[0,-it,t],[0,it,-t],[0,it,t],[-it,-t,0],[-it,t,0],[it,-t,0],[it,t,0],[-t,0,-it],[t,0,-it],[t,0,it],[-t,0,it]] as V3[]; })(),
    edges: [[0,8],[0,12],[0,16],[1,9],[1,12],[1,19],[2,10],[2,13],[2,16],[3,11],[3,13],[3,19],[4,8],[4,14],[4,17],[5,9],[5,14],[5,18],[6,10],[6,15],[6,17],[7,11],[7,15],[7,18],[8,17],[9,18],[10,16],[11,19],[12,14],[13,15]] as [number, number][],
  },
};

function GeometrySolids() {
  const [solidKey, setSolidKey] = useState('icosa');
  const [spin, setSpin] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const rot = useRef({ x: 0.6, y: 0.8 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width = canvas.clientWidth * 2, H = canvas.height = 400;
    const solid = SOLIDS[solidKey];
    const { x: rx, y: ry } = rot.current;
    const proj = (v: V3): [number, number, number] => {
      let [x, y, z] = v;
      let y1 = y * Math.cos(rx) - z * Math.sin(rx), z1 = y * Math.sin(rx) + z * Math.cos(rx);
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry), z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      const s = Math.min(W, H) * 0.26;
      const persp = 1 / (3.2 - z2 * 0.28);
      return [W / 2 + x2 * s * persp * 2.2, H / 2 - y1 * s * persp * 2.2, z2];
    };
    ctx.clearRect(0, 0, W, H);
    // backdrop rings
    ctx.strokeStyle = 'rgba(127,184,255,.15)'; ctx.lineWidth = 2;
    [0.32, 0.42].forEach((r) => { ctx.beginPath(); ctx.ellipse(W/2, H/2, Math.min(W,H)*r, Math.min(W,H)*r*0.36, 0, 0, Math.PI*2); ctx.stroke(); });
    const pts = solid.verts.map(proj);
    for (const [a, b] of solid.edges) {
      const [x1, y1, z1] = pts[a], [x2, y2, z2] = pts[b];
      const depth = (z1 + z2) / 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(232,196,118,${0.35 + (depth + 2) * 0.14})`;
      ctx.lineWidth = depth > 0 ? 3 : 1.5;
      ctx.stroke();
    }
    pts.forEach(([x, y, z]) => {
      ctx.beginPath(); ctx.arc(x, y, z > 0 ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = z > 0 ? '#f7dd9a' : 'rgba(127,184,255,.8)';
      ctx.shadowColor = '#e8c476'; ctx.shadowBlur = z > 0 ? 14 : 0;
      ctx.fill(); ctx.shadowBlur = 0;
    });
  }, [solidKey]);

  useEffect(() => {
    render();
    if (!spin || reduced) return;
    let raf = 0;
    const loop = () => { rot.current.y += 0.008; rot.current.x += 0.003; render(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, spin, reduced]);

  const solid = SOLIDS[solidKey];

  return (
    <Shell title="The Five Perfect Solids" caption="Established mathematics: exactly five exist (Euclid XIII). Elemental names are Platonic associations — interpretive, not mathematical."
      alt="An interactive wireframe viewer showing one of the five Platonic solids in glowing gold lines on deep blue, rotatable by dragging, with buttons to switch between tetrahedron, cube, octahedron, dodecahedron, and icosahedron.">
      <div className="flex flex-wrap gap-1.5 px-4 pt-4">
        {Object.entries(SOLIDS).map(([k, s]) => (
          <button key={k} onClick={() => setSolidKey(k)} className={`rounded-full px-3 py-1.5 text-xs transition ${k === solidKey ? 'bg-[#e8c476] font-semibold text-[#1a1030]' : 'border border-[#e8c476]/40 text-[#e8c476] hover:bg-[#e8c476]/10'}`}>{s.name}</button>
        ))}
      </div>
      <canvas
        ref={canvasRef} className="h-[200px] w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setDrag({ x: e.clientX, y: e.clientY }); }}
        onPointerMove={(e) => { if (!drag) return; rot.current.y += (e.clientX - drag.x) * 0.01; rot.current.x += (e.clientY - drag.y) * 0.01; setDrag({ x: e.clientX, y: e.clientY }); render(); }}
        onPointerUp={() => setDrag(null)}
        role="img" aria-label={`${solid.name} wireframe. Drag to rotate.`}
      />
      <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
        <button onClick={() => setSpin(!spin)} className="flex items-center gap-2 rounded-full bg-[#e8c476]/15 px-4 py-2 text-sm text-[#f7dd9a] transition hover:bg-[#e8c476]/30">
          {spin ? <Pause size={15} /> : <RotateCcw size={15} />} {spin ? 'Stop rotation' : 'Rotate'}
        </button>
        <div className="text-xs text-[#d8cdb4]"><span className="font-display text-base text-[#fdf6e3]">{solid.name}</span> · {solid.note}<br /><span className="italic text-[#8a7c5c]">{solid.element}</span></div>
      </div>
    </Shell>
  );
}

/* ---------------------------- Fibonacci spiral ---------------------------- */
function FibonacciSpiral() {
  const [stage, setStage] = useState(6);
  const [compare, setCompare] = useState(false);
  // Verified tiling of an 8×13 rectangle by squares 1,1,2,3,5,8 (areas sum to 104 ✓).
  // Ordered small→large for growth reveal. Grid: x 0..8, y 0..13.
  const squares: { x: number; y: number; s: number; n: number; arc: string }[] = [
    { x: 5, y: 3, s: 1, n: 1, arc: 'M 110 88 Q 119 79 130 86' },
    { x: 5, y: 4, s: 1, n: 1, arc: 'M 132 110 A 22 22 0 0 0 110 88' },
    { x: 6, y: 3, s: 2, n: 2, arc: 'M 176 66 A 44 44 0 0 1 132 110' },
    { x: 5, y: 0, s: 3, n: 3, arc: 'M 110 0 A 66 66 0 0 1 176 66' },
    { x: 0, y: 0, s: 5, n: 5, arc: 'M 0 110 A 110 110 0 0 0 110 0' },
    { x: 0, y: 5, s: 8, n: 8, arc: 'M 176 286 A 176 176 0 0 0 0 110' },
  ];
  const shown = squares.slice(0, Math.min(stage, 6));
  const u = 22;
  const fibs = [1, 1, 2, 3, 5, 8];
  const ratio = stage >= 2 ? (fibs[Math.min(stage, 6) - 1] / fibs[Math.min(stage, 6) - 2]).toFixed(5) : '—';

  return (
    <Shell title="Growing the Spiral" caption="Drag the stages: each square’s side is a Fibonacci number; the quarter-circle arcs approach — but only approach — a true golden spiral."
      alt={`Step-by-step Fibonacci tiling at stage ${stage} of 6. Squares of side 1,1,2,3,5,8 tile an 8 by 13 rectangle; quarter-circle arcs through them form an approximate golden spiral. Current ratio ${ratio}, converging toward phi 1.61803.`}>
      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_220px]">
        <div className="flex items-center justify-center rounded-lg bg-[#060312] p-4">
          <svg viewBox="-8 -8 192 302" className="h-72 w-full max-w-[240px]" role="img" aria-label="Fibonacci squares and spiral">
            {shown.map((sq, i) => (
              <g key={i}>
                <rect x={sq.x * u + 1} y={sq.y * u + 1} width={sq.s * u - 2} height={sq.s * u - 2} fill="rgba(232,196,118,.08)" stroke="#e8c476" strokeWidth="1.5" />
                <text x={sq.x * u + (sq.s * u) / 2} y={sq.y * u + (sq.s * u) / 2} fill="#f7dd9a" fontSize={sq.s >= 3 ? 13 : 9} textAnchor="middle" dominantBaseline="middle">{sq.n}</text>
              </g>
            ))}
            {shown.map((sq, i) => (
              <path key={'a' + i} d={sq.arc} fill="none" stroke="#7fe0ff" strokeWidth="2.5" strokeLinecap="round" />
            ))}
            {compare && <path d="M 176 286 A 150 150 0 0 0 20 130" fill="none" stroke="#ff7fb0" strokeWidth="2" strokeDasharray="6 4" />}
          </svg>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <label className="text-[#d8cdb4]">Construction stage: <span className="font-display text-2xl text-[#f7dd9a]">{stage}</span> / 6
            <input type="range" min={1} max={6} value={stage} onChange={(e) => setStage(+e.target.value)} className="mt-2 w-full accent-[#e8c476]" aria-label="Construction stage" />
          </label>
          <div className="rounded-lg border border-[#e8c476]/30 bg-[#060312] p-3 text-xs leading-relaxed text-[#d8cdb4]">
            <div>Ratio F<sub>n</sub>/F<sub>n−1</sub>: <span className="font-semibold text-[#f7dd9a]">{ratio}</span></div>
            <div>φ (phi): <span className="text-[#7fe0ff]">1.61803…</span></div>
            <div className="mt-1 italic text-[#8a7c5c]">Watch the ratio converge as stages grow. Next squares (13, 21…) would continue the tiling outward.</div>
          </div>
          <button onClick={() => setCompare(!compare)} className="rounded-full border border-[#ff7fb0]/50 px-4 py-2 text-xs text-[#ffb0cd] transition hover:bg-[#ff7fb0]/10">
            {compare ? 'Hide nautilus comparison' : 'Compare: nautilus-style curve'}
          </button>
          {compare && <p className="text-[11px] leading-relaxed text-[#8a7c5c]">The dashed curve sketches a nautilus-like growth spiral — logarithmic like the golden spiral, but a different growth factor. Cousins, not twins. Honest wonder survives scrutiny.</p>}
        </div>
      </div>
    </Shell>
  );
}

/* ----------------------------- Breath mandala ----------------------------- */
function BreathMandala() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!running) return;
    const lens = { inhale: 4, hold: 4, exhale: 6, rest: 2 };
    setCount(lens[phase]);
    const iv = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setPhase((p) => {
          if (p === 'inhale') return 'hold';
          if (p === 'hold') return 'exhale';
          if (p === 'exhale') { setCycles((x) => x + 1); return 'rest'; }
          return 'inhale';
        });
        return c;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running, phase]);

  const scale = phase === 'inhale' ? 0.75 + (0.25 * (4 - count)) / 4 : phase === 'hold' ? 1 : phase === 'exhale' ? 1 - (0.25 * (6 - count)) / 6 : 0.75;
  const label = { inhale: 'Breathe in', hold: 'Hold gently', exhale: 'Release slowly', rest: 'Rest' }[phase];

  return (
    <Shell title="The Breathing Mandala" caption="A contemplative instrument, not a medical device. Breathe comfortably — never strain. Rates: in 4 · hold 4 · out 6."
      alt="A golden geometric mandala that slowly expands as you inhale for four counts, holds, contracts as you exhale for six, and rests. Phase labels and counts guide the breath; completed cycles are tallied.">
      <div className="flex flex-col items-center gap-3 p-5">
        {!running ? (
          <ActivateGate onActivate={() => { setRunning(true); setPhase('inhale'); }} label="Begin breathing with the mandala" hint="Reader-controlled · gentle animation only while running · stops instantly on command." />
        ) : (
          <>
            <div className="relative flex h-56 w-56 items-center justify-center">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={reduced ? undefined : { transform: `scale(${scale})`, transition: 'transform 1s linear' }}>
                {[90, 70, 50, 30].map((r) => (<circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#e8c476" strokeWidth="1.2" opacity={r === 90 ? 0.5 : 0.8} />))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                    <ellipse cx="100" cy="45" rx="12" ry="26" fill="none" stroke="#c9a8ff" strokeWidth="1.1" opacity=".8" />
                  </g>
                ))}
                <circle cx="100" cy="100" r="8" fill="#f7dd9a" opacity=".9" />
              </svg>
              <div className="z-10 text-center">
                <div className="font-display text-2xl text-[#fdf6e3]">{label}</div>
                <div className="font-display text-5xl text-[#f7dd9a]">{count}</div>
              </div>
            </div>
            <div className="text-xs text-[#a89a7c]">Completed breaths: <span className="font-semibold text-[#f7dd9a]">{cycles}</span></div>
            <button onClick={() => setRunning(false)} className="flex items-center gap-2 rounded-full border border-[#e8c476]/40 px-5 py-2 text-sm text-[#e8c476] transition hover:bg-[#e8c476]/10">
              <VolumeX size={15} /> Rest the mandala
            </button>
          </>
        )}
      </div>
    </Shell>
  );
}

/* ---------------------------- Stoic dichotomy ----------------------------- */
const DICHOTOMY_ITEMS = [
  { t: 'My judgments about events', mine: true },
  { t: 'Other people’s opinions of me', mine: false },
  { t: 'The effort I put in', mine: true },
  { t: 'Whether it rains today', mine: false },
  { t: 'My response to criticism', mine: true },
  { t: 'The outcome of the match', mine: false },
  { t: 'What I attend to now', mine: true },
  { t: 'My reputation', mine: false },
];

function StoicDichotomy() {
  const [placed, setPlaced] = useState<Record<number, 'mine' | 'other'>>({});
  const [checked, setChecked] = useState(false);
  const score = Object.entries(placed).filter(([i, v]) => (v === 'mine') === DICHOTOMY_ITEMS[+i].mine).length;

  return (
    <Shell title="The Two Baskets" caption="After Epictetus, Enchiridion 1 · Sort each item: yours (free) or not yours (to be released). There are no tricks — only honesty."
      alt="An interactive sorting exercise with eight items such as judgments, effort, opinions, weather, outcomes, each assigned by the reader to either the basket of things in our power or the basket of things not in our power, with gentle scoring and explanation.">
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <div className="rounded-lg border border-dashed border-[#8fd6a0]/50 bg-[#8fd6a0]/5 p-3">
          <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-[#8fd6a0]">Mine · free</div>
          {Object.entries(placed).filter(([, v]) => v === 'mine').map(([i]) => (
            <button key={i} onClick={() => { const p = { ...placed }; delete p[+i]; setPlaced(p); setChecked(false); }} className="mb-1.5 w-full rounded-md bg-[#8fd6a0]/15 px-2 py-1.5 text-xs text-[#d9f2e2] transition hover:bg-[#8fd6a0]/25">{DICHOTOMY_ITEMS[+i].t}</button>
          ))}
          {Object.values(placed).filter((v) => v === 'mine').length === 0 && <div className="py-4 text-center text-[11px] italic text-[#5c6b5e]">Tap items below to place them here</div>}
        </div>
        <div className="rounded-lg border border-[#e8c476]/30 bg-[#060312] p-3">
          <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-[#e8c476]">To be sorted</div>
          {DICHOTOMY_ITEMS.map((it, i) => placed[i] === undefined && (
            <div key={i} className="mb-1.5 flex gap-1">
              <span className="flex-1 rounded-md border border-white/10 px-2 py-1.5 text-xs text-[#d8cdb4]">{it.t}</span>
              <button onClick={() => { setPlaced({ ...placed, [i]: 'mine' }); setChecked(false); }} className="rounded-md bg-[#8fd6a0]/20 px-2 text-[11px] text-[#8fd6a0]" aria-label={`Place "${it.t}" in Mine`} title="Mine">◀</button>
              <button onClick={() => { setPlaced({ ...placed, [i]: 'other' }); setChecked(false); }} className="rounded-md bg-[#7fb8ff]/20 px-2 text-[11px] text-[#7fb8ff]" aria-label={`Place "${it.t}" in Not mine`} title="Not mine">▶</button>
            </div>
          ))}
          {Object.keys(placed).length === DICHOTOMY_ITEMS.length && <div className="py-2 text-center text-xs text-[#8a7c5c]">All sorted. Check your baskets ↓</div>}
        </div>
        <div className="rounded-lg border border-dashed border-[#7fb8ff]/50 bg-[#7fb8ff]/5 p-3">
          <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-[#7fb8ff]">Not mine · release</div>
          {Object.entries(placed).filter(([, v]) => v === 'other').map(([i]) => (
            <button key={i} onClick={() => { const p = { ...placed }; delete p[+i]; setPlaced(p); setChecked(false); }} className="mb-1.5 w-full rounded-md bg-[#7fb8ff]/15 px-2 py-1.5 text-xs text-[#d6e6ff] transition hover:bg-[#7fb8ff]/25">{DICHOTOMY_ITEMS[+i].t}</button>
          ))}
          {Object.values(placed).filter((v) => v === 'other').length === 0 && <div className="py-4 text-center text-[11px] italic text-[#5c6470]">Tap ▶ on items to release them here</div>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
        <button onClick={() => setChecked(true)} disabled={Object.keys(placed).length < DICHOTOMY_ITEMS.length} className="rounded-full bg-[#e8c476]/15 px-5 py-2 text-sm text-[#f7dd9a] transition hover:bg-[#e8c476]/30 disabled:opacity-40">Examine the baskets</button>
        <button onClick={() => { setPlaced({}); setChecked(false); }} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs text-[#a89a7c]"><RotateCcw size={13} /> Reset</button>
        {checked && <span className="text-sm text-[#d8cdb4]">{score === 8 ? 'Perfect — the line is bright. Now live it: want only from your own basket today.' : `${score} of 8 in their true baskets. Recall: opinions, effort, responses — yours. Bodies, outcomes, reputations — not yours.`}</span>}
      </div>
    </Shell>
  );
}

/* -------------------------------- registry -------------------------------- */
export const LIVING_PAGES: Record<LivingPageId, { title: string; blurb: string; el: () => React.ReactElement }> = {
  'tao-water': { title: 'Water Around Stones', blurb: 'An animated mountain stream on wu wei', el: TaoWater },
  'gita-chariot': { title: 'The Chariot at Kurukshetra', blurb: 'An illuminated scene with annotations', el: GitaChariot },
  'geometry-solids': { title: 'The Five Perfect Solids', blurb: 'Rotate the Platonic solids', el: GeometrySolids },
  'fibonacci-spiral': { title: 'Growing the Spiral', blurb: 'Build Fibonacci growth stage by stage', el: FibonacciSpiral },
  'breath-mandala': { title: 'The Breathing Mandala', blurb: 'A guided contemplative instrument', el: BreathMandala },
  'stoic-dichotomy': { title: 'The Two Baskets', blurb: 'Sort what is yours from what is not', el: StoicDichotomy },
};

export function LivingPage({ id }: { id: LivingPageId }) {
  const C = LIVING_PAGES[id].el;
  return <C />;
}

```

## src/components/LivingTome.tsx

```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, BookOpen, Search, Bookmark as BookmarkIcon, Sun, Moon, Sunrise,
  Type, Rows3, Sparkles, ListOrdered, Maximize, Link2, PenLine, Lamp, VolumeX, Info,
} from 'lucide-react';
import { getBook, getRoom } from '../data/library';
import type { LibraryStore } from '../hooks/useLibraryStore';
import type { Chapter } from '../data/types';
import BookCover from './BookCover';
import Starfield from './Starfield';
import { LivingPage, LIVING_PAGES } from './LivingPages';

/* ------------------------------- pagination ------------------------------ */
interface PageBlock { heading?: string; lines: string[]; }
interface TomePage { blocks: PageBlock[]; }

function buildPages(ch: Chapter, fontSize: number): TomePage[] {
  const perPage = fontSize <= 17 ? 9 : fontSize <= 20 ? 7 : 5;
  const pages: TomePage[] = [];
  let cur: PageBlock[] = [];
  let count = 0;
  const push = () => { if (cur.length) { pages.push({ blocks: cur }); cur = []; count = 0; } };
  for (const v of ch.verses) {
    // heading starts fresh-ish
    if (v.heading && count > perPage - 2 && count > 0) push();
    let block: PageBlock = { heading: v.heading, lines: [] };
    for (const line of v.lines) {
      block.lines.push(line);
      count++;
      if (count >= perPage) { cur.push(block); push(); block = { lines: [] }; }
    }
    if (block.lines.length || block.heading) {
      if (block.lines.length || cur.length === 0) cur.push(block);
      else if (cur.length) cur.push(block);
    }
  }
  push();
  return pages.length ? pages : [{ blocks: [] }];
}

interface Props {
  bookId: string;
  chapterId: string;
  initialPage?: number;
  store: LibraryStore;
  onClose: () => void;
  onNavigate: (bookId: string, chapterId: string, page?: number) => void;
}

type EssenceTab = 'essence' | 'deeper' | 'views' | 'life' | 'reflect' | 'notes';

// Books already unveiled this session skip the cover ceremony on remount.
const OPENED = new Set<string>();

export default function LivingTome({ bookId, chapterId, initialPage, store, onClose, onNavigate }: Props) {
  const book = getBook(bookId)!;
  const room = getRoom(book.roomId);
  const { store: s, updateProgress, toggleBookmark, saveNote, pushRecent, setReaderPrefs } = store;
  const prefs = s.readerPrefs;
  const motionOff = prefs.motionSafe || s.atmosphere === 'minimal';

  const chIndex = Math.max(0, book.chapters.findIndex((c) => c.id === chapterId));
  const chapter = book.chapters[chIndex];
  const saved = s.progress[book.id];
  const [page, setPage] = useState(() => {
    if (typeof initialPage === 'number' && initialPage > 0) return initialPage;
    if (saved && saved.chapterId === chapter.id) return saved.page;
    return 0;
  });
  const [dir, setDir] = useState<'next' | 'prev' | null>(null);
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [stage, setStage] = useState<'cover' | 'reading'>(motionOff || OPENED.has(bookId) ? 'reading' : 'cover');
  const [panel, setPanel] = useState<null | EssenceTab>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [find, setFind] = useState('');
  const [livingOpen, setLivingOpen] = useState(false);
  const [, setIsFullscreen] = useState(false);
  const touchX = useRef<number | null>(null);
  const noteKey = `${book.id}:${chapter.id}`;
  const [noteDraft, setNoteDraft] = useState(s.notes[noteKey]?.text ?? '');

  const pages = useMemo(() => buildPages(chapter, prefs.fontSize), [chapter, prefs.fontSize]);
  const step = wide ? 2 : 1;
  const maxStart = wide ? Math.max(0, (Math.ceil(pages.length / 2) - 1) * 2) : pages.length - 1;
  const start = Math.min(page, maxStart);
  const visible = wide ? [pages[start], pages[start + 1]].filter(Boolean) : [pages[start]];

  useEffect(() => {
    const h = () => setWide(window.innerWidth >= 1024);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  useEffect(() => { setDir(null); pushRecent(book.id, chapter.id); /* eslint-disable-next-line */ }, [chapter.id]);
  useEffect(() => {
    if (stage !== 'reading') return;
    const total = pages.length;
    updateProgress({ bookId: book.id, bookTitle: book.title, chapterId: chapter.id, chapterTitle: chapter.title, page: start, totalPages: total, percent: (start + step) / total > 1 ? 1 : (start + step) / total, updated: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, stage]);

  // opening animation (once per book per session)
  useEffect(() => {
    if (motionOff || OPENED.has(book.id)) { setStage('reading'); return; }
    setStage('cover');
    OPENED.add(book.id);
    const t = setTimeout(() => setStage('reading'), 1900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id]);

  const goPage = useCallback((p: number, d: 'next' | 'prev') => {
    setDir(motionOff ? null : d);
    setPage(Math.max(0, Math.min(maxStart, p)));
  }, [maxStart, motionOff]);

  const next = useCallback(() => {
    if (start + step <= maxStart) goPage(start + step, 'next');
    else if (chIndex < book.chapters.length - 1) onNavigate(book.id, book.chapters[chIndex + 1].id);
  }, [start, step, maxStart, chIndex, book, onNavigate, goPage]);

  const prev = useCallback(() => {
    if (start - step >= 0) goPage(start - step, 'prev');
    else if (chIndex > 0) onNavigate(book.id, book.chapters[chIndex - 1].id);
  }, [start, step, chIndex, book, onNavigate, goPage]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      if (e.key === 'Escape') { if (livingOpen) setLivingOpen(false); else if (panel) setPanel(null); else if (tocOpen) setTocOpen(false); else onClose(); }
      if (e.key === 'b') toggleBookmark({ bookId: book.id, chapterId: chapter.id, page: start, label: `${book.title} — ${chapter.title} · p.${start + 1}` });
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev, livingOpen, panel, tocOpen, onClose, book, chapter, start, toggleBookmark]);

  const isBookmarked = s.bookmarks.some((b) => b.bookId === book.id && b.chapterId === chapter.id && b.page === start);

  const findResults = useMemo(() => {
    const q = find.trim().toLowerCase();
    if (!q) return [];
    const out: { chId: string; chTitle: string; pageIdx: number; snippet: string }[] = [];
    for (const c of book.chapters) {
      const pg = buildPages(c, prefs.fontSize);
      pg.forEach((p, pi) => {
        const text = p.blocks.flatMap((b) => b.lines).join(' ');
        const idx = text.toLowerCase().indexOf(q);
        if (idx >= 0) out.push({ chId: c.id, chTitle: c.title, pageIdx: pi, snippet: '…' + text.slice(Math.max(0, idx - 40), idx + 90) + '…' });
      });
    }
    return out.slice(0, 20);
  }, [find, book, prefs.fontSize]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    else document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
  };

  const themeCls = prefs.theme === 'night' ? 'page-paper-night' : prefs.theme === 'dawn' ? 'page-paper-dawn' : 'page-paper';
  const shadowL = prefs.theme === 'night' ? 'page-left-shadow-night' : 'page-left-shadow';
  const shadowR = prefs.theme === 'night' ? 'page-right-shadow-night' : 'page-right-shadow';
  const night = prefs.theme === 'night';
  const turnAnim = !motionOff && dir ? (dir === 'next' ? 'pageTurnRight' : 'pageTurnLeft') : 'pageEnter';

  /* ------------------------------ cover stage ----------------------------- */
  if (stage === 'cover') {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#060312]">
        <img src={room.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060312]/60 to-[#060312]" />
        <Starfield atmosphere="full" />
        <div className="relative flex flex-col items-center px-6 text-center" style={{ animation: 'riseIn 1.6s cubic-bezier(.22,1,.36,1) both' }}>
          <div style={{ animation: 'floaty 3s ease-in-out infinite' }}>
            <BookCover cover={book.cover} title={book.title} author={book.author} size="lg" />
          </div>
          <h2 className="font-display mt-6 text-3xl font-semibold text-[#fdf6e3] sm:text-4xl">{book.title}</h2>
          <p className="mt-1 text-sm text-[#a89a7c]">{chapter.title}</p>
          <p className="font-display mt-3 text-lg italic text-[#e8c476]" style={{ animation: 'glowPulse 1.6s ease-in-out infinite' }}>The tome opens…</p>
          <button onClick={() => setStage('reading')} className="mt-4 rounded-full border border-[#e8c476]/40 px-5 py-2 text-xs text-[#e8c476]">Skip opening</button>
        </div>
      </div>
    );
  }

  const TABS: { id: EssenceTab; label: string; icon: React.ReactNode }[] = [
    { id: 'essence', label: 'The Essence', icon: <Sparkles size={13} /> },
    { id: 'deeper', label: 'Deeper Meaning', icon: <BookOpen size={13} /> },
    { id: 'views', label: 'Perspectives', icon: <Info size={13} /> },
    { id: 'life', label: 'Into Life', icon: <Sun size={13} /> },
    { id: 'reflect', label: 'Reflection', icon: <PenLine size={13} /> },
    { id: 'notes', label: 'My Notes', icon: <BookmarkIcon size={13} /> },
  ];

  return (
    <div className="fixed inset-0 z-[55] flex flex-col overflow-hidden bg-[#060312]">
      {/* backdrop */}
      <div className="absolute inset-0">
        <img src={room.image} alt="" className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060312]/70 via-[#060312]/80 to-[#060312]" />
      </div>
      <Starfield atmosphere={s.atmosphere === 'full' ? 'subtle' : 'minimal'} density={0.6} />

      {/* top bar */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 border-b border-[#e8c476]/20 bg-[#060312]/80 px-2 py-2 backdrop-blur-md sm:gap-2 sm:px-4">
        <button onClick={onClose} className="flex items-center gap-1.5 rounded-full border border-[#e8c476]/30 px-3 py-1.5 text-xs text-[#e8c476] transition hover:bg-[#e8c476]/10" aria-label="Return to library">
          <X size={14} /> <span className="hidden sm:inline">Library</span>
        </button>
        <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
          <span className="truncate font-display text-[17px] font-semibold text-[#fdf6e3]">{book.title}</span>
          <span className="shrink-0 text-[#8a7c5c]">·</span>
          <button onClick={() => setTocOpen(!tocOpen)} className="flex min-w-0 items-center gap-1.5 truncate rounded-full border border-white/10 px-3 py-1 text-xs text-[#c9bda0] transition hover:border-[#e8c476]/40">
            <ListOrdered size={13} /> <span className="truncate">{chapter.title}</span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <button onClick={() => setFindOpen(!findOpen)} className="rounded-full border border-white/10 p-2 text-[#c9bda0] transition hover:border-[#e8c476]/40 hover:text-[#f7dd9a]" title="Search within this book" aria-label="Search within this book"><Search size={15} /></button>
          <button onClick={() => setReaderPrefs({ fontSize: Math.max(15, prefs.fontSize - 1) })} className="rounded-full border border-white/10 p-2 text-[#c9bda0]" title="Smaller text" aria-label="Smaller text"><Type size={13} /></button>
          <span className="hidden text-[11px] tabular-nums text-[#8a7c5c] sm:inline">{prefs.fontSize}</span>
          <button onClick={() => setReaderPrefs({ fontSize: Math.min(26, prefs.fontSize + 1) })} className="rounded-full border border-white/10 p-2 text-[#c9bda0]" title="Larger text" aria-label="Larger text"><Type size={17} /></button>
          <button onClick={() => setReaderPrefs({ lineSpacing: prefs.lineSpacing >= 2 ? 1.5 : +(prefs.lineSpacing + 0.15).toFixed(2) })} className="rounded-full border border-white/10 p-2 text-[#c9bda0]" title={`Line spacing ${prefs.lineSpacing}`} aria-label="Adjust line spacing"><Rows3 size={15} /></button>
          <button onClick={() => setReaderPrefs({ theme: prefs.theme === 'parchment' ? 'night' : prefs.theme === 'night' ? 'dawn' : 'parchment' })} className="rounded-full border border-white/10 p-2 text-[#c9bda0]" title={`Theme: ${prefs.theme}`} aria-label="Change reading theme">
            {prefs.theme === 'parchment' ? <Sun size={15} /> : prefs.theme === 'night' ? <Moon size={15} /> : <Sunrise size={15} />}
          </button>
          <button onClick={() => setReaderPrefs({ motionSafe: !prefs.motionSafe })} className={`flex items-center gap-1 rounded-full border p-2 ${prefs.motionSafe ? 'border-[#8fd6a0]/60 text-[#8fd6a0]' : 'border-white/10 text-[#c9bda0]'}`} title="Animation-free reading mode" aria-label="Toggle animation-free mode"><VolumeX size={15} /></button>
          <button onClick={toggleFullscreen} className="hidden rounded-full border border-white/10 p-2 text-[#c9bda0] sm:block" title="Full-screen reading" aria-label="Toggle fullscreen"><Maximize size={15} /></button>
          <button onClick={() => toggleBookmark({ bookId: book.id, chapterId: chapter.id, page: start, label: `${book.title} — ${chapter.title} · p.${start + 1}` })} className={`rounded-full border p-2 ${isBookmarked ? 'border-[#e8c476] bg-[#e8c476]/20 text-[#f7dd9a]' : 'border-white/10 text-[#c9bda0]'}`} title="Bookmark this page (B)" aria-label="Bookmark this page"><BookmarkIcon size={15} fill={isBookmarked ? 'currentColor' : 'none'} /></button>
          <button onClick={() => setPanel(panel ? null : 'essence')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${panel ? 'bg-[#e8c476] text-[#1a1030]' : 'bg-gradient-to-r from-[#8a5a1c] to-[#c99a3f] text-[#120b2e]'}`} aria-expanded={!!panel}>
            <Lamp size={14} /> Illuminate
          </button>
        </div>
        {/* mobile title */}
        <div className="flex w-full items-center gap-2 px-2 pb-1 md:hidden">
          <button onClick={() => setTocOpen(!tocOpen)} className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-lg border border-white/10 px-2.5 py-1.5 text-left text-xs text-[#c9bda0]">
            <ListOrdered size={13} className="shrink-0" /> <span className="truncate">{chapter.title}</span>
          </button>
        </div>
      </div>

      {/* TOC drawer */}
      {tocOpen && (
        <div className="relative z-20 border-b border-[#e8c476]/20 bg-[#0b0722]/95 p-3 backdrop-blur">
          <div className="mx-auto grid max-w-4xl gap-1.5 sm:grid-cols-2">
            {book.chapters.map((c, i) => (
              <button key={c.id} onClick={() => { onNavigate(book.id, c.id); setTocOpen(false); }} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition ${c.id === chapter.id ? 'bg-[#e8c476]/20 text-[#f7dd9a]' : 'text-[#c9bda0] hover:bg-white/5'}`}>
                <span className="font-display text-[#8a7c5c]">{i + 1}.</span>
                <span className="min-w-0 flex-1 truncate">{c.title}{c.livingPage ? ' ✦' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* find drawer */}
      {findOpen && (
        <div className="relative z-20 border-b border-[#e8c476]/20 bg-[#0b0722]/95 p-3 backdrop-blur">
          <div className="mx-auto max-w-2xl">
            <input value={find} onChange={(e) => setFind(e.target.value)} placeholder={`Search within ${book.title}…`} className="w-full rounded-lg border border-[#e8c476]/30 bg-black/40 px-3.5 py-2 text-sm text-[#fdf6e3] outline-none" aria-label="Search within this book" autoFocus />
            <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
              {findResults.map((r, i) => (
                <button key={i} onClick={() => { setFindOpen(false); onNavigate(book.id, r.chId, r.pageIdx); }} className="w-full rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-left text-xs transition hover:border-[#e8c476]/40">
                  <span className="font-medium text-[#f7dd9a]">{r.chTitle} · p.{r.pageIdx + 1}</span>
                  <span className="block truncate text-[#a89a7c]">{r.snippet}</span>
                </button>
              ))}
              {find.trim() && findResults.length === 0 && <p className="py-2 text-center text-xs text-[#8a7c5c]">No matches in this volume.</p>}
            </div>
          </div>
        </div>
      )}

      {/* stage */}
      <div className="relative z-10 flex min-h-0 flex-1">
        <div
          className={`tome-stage flex min-h-0 flex-1 items-stretch justify-center gap-0 overflow-y-auto p-3 transition-all sm:items-center sm:p-6 ${panel ? 'lg:mr-[400px]' : ''}`}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 60) { if (dx < 0) next(); else prev(); }
            touchX.current = null;
          }}
        >
          {/* prev */}
          <button onClick={prev} disabled={start === 0 && chIndex === 0} className="z-10 mr-1 hidden h-12 w-12 shrink-0 items-center justify-center self-center rounded-full border border-[#e8c476]/40 bg-black/50 text-[#e8c476] backdrop-blur transition hover:bg-[#e8c476]/20 disabled:opacity-25 lg:flex" aria-label="Previous page"><ChevronLeft size={20} /></button>

          <div
            key={`${chapter.id}-${start}-${wide}`}
            className="tome-book flex w-full max-w-5xl overflow-hidden rounded-lg"
            style={motionOff ? undefined : { animation: `${turnAnim} .45s ease both`, transformOrigin: dir === 'prev' ? 'left center' : 'right center' }}
          >
            {visible.map((pg, vi) => {
              const pageNo = start + vi;
              const isLeft = wide ? vi === 0 : false;
              return (
                <div key={vi} className={`relative flex-1 ${themeCls} ${wide ? (isLeft ? shadowL : shadowR) : ''} px-6 py-7 sm:px-10 sm:py-9 ${wide && vi === 0 ? 'border-r border-[#8a5a1c]/30' : ''}`} style={{ minHeight: wide ? 560 : undefined }}>
                  <div className={`page-curl ${wide ? (isLeft ? 'curl-left' : 'curl-right') : 'hidden'}`} />
                  {pageNo === 0 && (
                    <header className="mb-5 text-center">
                      <div className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${night ? 'text-[#e8c476]' : 'text-[#8a5a1c]'}`}>{book.title}</div>
                      <h2 className={`font-display mt-1.5 text-2xl font-semibold leading-tight sm:text-[28px] ${night ? 'text-[#fdf6e3]' : 'text-[#2b1d0e]'}`}>{chapter.title}</h2>
                      {chapter.subtitle && <p className={`font-display mt-1 text-[16px] italic ${night ? 'text-[#c9bda0]' : 'text-[#6b5322]'}`}>{chapter.subtitle}</p>}
                      <div className={`mx-auto mt-3 h-px w-32 ${night ? 'bg-[#e8c476]/40' : 'bg-[#8a5a1c]/40'}`} />
                      <p className={`mt-2 text-[11px] italic ${night ? 'text-[#8a7c5c]' : 'text-[#8a6f3e]'}`}>{chapter.sourceLabel}</p>
                    </header>
                  )}
                  <div className="reader-body font-reading" style={{ fontSize: prefs.fontSize, lineHeight: prefs.lineSpacing }}>
                    {pg.blocks.map((b, bi) => (
                      <div key={bi} className="mb-4">
                        {b.heading && <h3 className={`font-display mb-2 text-[1.15em] font-semibold ${night ? 'text-[#f7dd9a]' : 'text-[#5c3d12]'}`}>{b.heading}</h3>}
                        {b.lines.map((ln, li) => (
                          <p key={li} className={`verse-line ${pageNo === 0 && bi === 0 && li === 0 ? (night ? 'drop-cap-night' : 'drop-cap') : ''}`}>{ln}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* living page banner at chapter end */}
                  {chapter.livingPage && pageNo === pages.length - 1 && (
                    <button onClick={() => setLivingOpen(true)} className={`mt-4 flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition ${night ? 'border-[#e8c476]/60 bg-[#e8c476]/5 hover:bg-[#e8c476]/15' : 'border-[#8a5a1c]/60 bg-[#8a5a1c]/5 hover:bg-[#8a5a1c]/10'}`}>
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${night ? 'bg-[#e8c476]/20 text-[#f7dd9a]' : 'bg-[#8a5a1c]/15 text-[#8a5a1c]'}`}><Sparkles size={18} /></span>
                      <span>
                        <span className={`font-display block text-[17px] font-semibold ${night ? 'text-[#f7dd9a]' : 'text-[#5c3d12]'}`}>✦ A Living Page sleeps here: {LIVING_PAGES[chapter.livingPage].title}</span>
                        <span className={`block text-xs ${night ? 'text-[#a89a7c]' : 'text-[#8a6f3e]'}`}>{LIVING_PAGES[chapter.livingPage].blurb} — tap to awaken it (reader-controlled, never autoplay).</span>
                      </span>
                    </button>
                  )}
                  <footer className={`mt-auto flex items-center justify-between pt-5 text-[11px] ${night ? 'text-[#8a7c5c]' : 'text-[#8a6f3e]'}`}>
                    <span>{chapter.attribution}</span>
                    <span className="tabular-nums">p. {pageNo + 1} / {pages.length}</span>
                  </footer>
                </div>
              );
            })}
          </div>

          {/* next */}
          <button onClick={next} disabled={start + step > maxStart && chIndex === book.chapters.length - 1} className="z-10 ml-1 hidden h-12 w-12 shrink-0 items-center justify-center self-center rounded-full border border-[#e8c476]/40 bg-black/50 text-[#e8c476] backdrop-blur transition hover:bg-[#e8c476]/20 disabled:opacity-25 lg:flex" aria-label="Next page"><ChevronRight size={20} /></button>
        </div>

        {/* essence panel */}
        {panel && (
          <aside className="relative z-20 flex max-h-[46vh] w-full shrink-0 flex-col border-t border-[#e8c476]/25 bg-[#0b0722]/95 backdrop-blur-xl lg:absolute lg:inset-y-0 lg:right-0 lg:max-h-none lg:w-[400px] lg:border-l lg:border-t-0" role="complementary" aria-label="Inner Orbit interpretation layers">
            <div className="flex items-center justify-between border-b border-[#e8c476]/20 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8c476]"><Lamp size={13} /> Illuminations · {chapter.title}</span>
              <button onClick={() => setPanel(null)} className="rounded-full border border-white/15 p-1.5 text-[#a89a7c]" aria-label="Close illuminations"><X size={14} /></button>
            </div>
            <div className="flex gap-1 overflow-x-auto border-b border-[#e8c476]/15 p-2 no-scrollbar" role="tablist">
              {TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={panel === t.id} onClick={() => setPanel(t.id)} className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${panel === t.id ? 'bg-[#e8c476] text-[#1a1030]' : 'border border-white/10 text-[#c9bda0] hover:border-[#e8c476]/40'}`}>{t.icon} {t.label}</button>
              ))}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 text-[13.5px] leading-relaxed">
              {panel === 'essence' && (
                <div>
                  <Badge>Inner Orbit commentary — not the author’s text</Badge>
                  <h4 className="font-display mt-2 text-xl font-semibold text-[#f7dd9a]">The Essence</h4>
                  <p className="mt-2 text-[#e8dcc0]">{chapter.essence}</p>
                  <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-[#a89a7c]">Source: <span className="italic">{chapter.sourceLabel}</span>. The passage on the page is the source (or identified translation); everything in this panel is Inner Orbit’s modern illumination.</div>
                </div>
              )}
              {panel === 'deeper' && (
                <div>
                  <Badge>Inner Orbit commentary</Badge>
                  <h4 className="font-display mt-2 text-xl font-semibold text-[#f7dd9a]">Deeper Meaning</h4>
                  <ul className="mt-2 space-y-2.5">{chapter.deeper.map((d, i) => (<li key={i} className="border-l-2 border-[#e8c476]/40 pl-3 text-[#d8cdb4]">{d}</li>))}</ul>
                </div>
              )}
              {panel === 'views' && (
                <div>
                  <Badge>Multiple legitimate readings — no single orthodoxy imposed</Badge>
                  <h4 className="font-display mt-2 text-xl font-semibold text-[#f7dd9a]">Different Perspectives</h4>
                  <div className="mt-2 space-y-2.5">{chapter.perspectives.map((p, i) => (<div key={i} className="rounded-lg border border-white/10 bg-black/25 p-3"><div className="text-xs font-semibold uppercase tracking-widest text-[#e8c476]">{p.label}</div><div className="mt-1 text-[#d8cdb4]">{p.text}</div></div>))}</div>
                </div>
              )}
              {panel === 'life' && (
                <div>
                  <Badge>Inner Orbit commentary</Badge>
                  <h4 className="font-display mt-2 text-xl font-semibold text-[#f7dd9a]">Bring It Into Your Life</h4>
                  <div className="mt-2 space-y-2.5">{chapter.bringToLife.map((e, i) => (<div key={i} className="rounded-lg border border-white/10 bg-black/25 p-3"><div className="font-display text-[16px] font-semibold text-[#fdf6e3]">{e.title}</div><div className="mt-1 text-[#d8cdb4]">{e.text}</div></div>))}</div>
                </div>
              )}
              {panel === 'reflect' && (
                <div>
                  <Badge>Optional · private · never shared</Badge>
                  <h4 className="font-display mt-2 text-xl font-semibold text-[#f7dd9a]">A Moment of Reflection</h4>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-[#d8cdb4]">{chapter.reflection.questions.map((q, i) => (<li key={i}>{q}</li>))}</ol>
                  {chapter.reflection.exercise && <div className="mt-3 rounded-lg border border-[#8fd6a0]/30 bg-[#8fd6a0]/5 p-3"><div className="text-xs font-semibold uppercase tracking-widest text-[#8fd6a0]">Practice</div><div className="mt-1 text-[#d8cdb4]">{chapter.reflection.exercise}</div></div>}
                  {chapter.reflection.journeyHook && <div className="mt-2 text-xs italic text-[#8a7c5c]">Future Your Journey hook: {chapter.reflection.journeyHook}</div>}
                  {chapter.connections.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#7fb8ff]"><Link2 size={12} /> Follow the thread</div>
                      <div className="mt-2 space-y-1.5">{chapter.connections.map((c, i) => (
                        <button key={i} onClick={() => { const b = getBook(c.bookId); if (b) onNavigate(c.bookId, c.chapterId ?? b.chapters[0]?.id ?? ''); }} className="w-full rounded-lg border border-[#7fb8ff]/25 bg-black/25 p-2.5 text-left transition hover:bg-[#7fb8ff]/10">
                          <span className="text-[13px] font-medium text-[#d6e6ff]">{getBook(c.bookId)?.title}</span>
                          <span className="block text-xs italic text-[#8a7c5c]">Why: {c.reason}</span>
                        </button>
                      ))}</div>
                    </div>
                  )}
                </div>
              )}
              {panel === 'notes' && (
                <div>
                  <Badge>Private reflection notes · stored only in this browser</Badge>
                  <h4 className="font-display mt-2 text-xl font-semibold text-[#f7dd9a]">My Notes</h4>
                  <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={8} placeholder="What stirs in you as you read? Questions, resolutions, lines to remember…" className="mt-2 w-full rounded-lg border border-[#e8c476]/30 bg-black/40 p-3 text-sm text-[#fdf6e3] outline-none placeholder:text-[#8a7c5c] focus:border-[#e8c476]" aria-label="Private reflection notes" />
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => saveNote(noteKey, noteDraft)} className="rounded-full bg-[#e8c476] px-4 py-1.5 text-xs font-semibold text-[#1a1030]">Save privately</button>
                    {s.notes[noteKey] && <span className="text-[11px] text-[#8a7c5c]">Saved in this browser · {new Date(s.notes[noteKey].updated).toLocaleDateString()}</span>}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* bottom bar */}
      <div className="relative z-10 flex items-center gap-2 border-t border-[#e8c476]/20 bg-[#060312]/85 px-3 py-2.5 backdrop-blur-md sm:px-5">
        <button onClick={prev} disabled={start === 0 && chIndex === 0} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8c476]/40 text-[#e8c476] transition hover:bg-[#e8c476]/15 disabled:opacity-25 lg:hidden" aria-label="Previous page"><ChevronLeft size={18} /></button>
        <button onClick={() => chIndex > 0 && onNavigate(book.id, book.chapters[chIndex - 1].id)} disabled={chIndex === 0} className="hidden max-w-[180px] truncate rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#a89a7c] transition hover:border-[#e8c476]/40 disabled:opacity-30 sm:block">
          ← {chIndex > 0 ? book.chapters[chIndex - 1].title : 'First reading'}
        </button>
        <div className="flex flex-1 flex-col items-center gap-1 px-1">
          <div className="text-[11px] tabular-nums text-[#a89a7c]">{wide ? `Pages ${start + 1}${pages[start + 1] ? `–${start + 2}` : ''} of ${pages.length}` : `Page ${start + 1} of ${pages.length}`} · Reading {chIndex + 1} of {book.chapters.length}</div>
          <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={Math.round(((start + step) / pages.length) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
            <div className="h-full rounded-full bg-gradient-to-r from-[#8a5a1c] via-[#e8c476] to-[#f7dd9a]" style={{ width: `${Math.min(100, ((start + step) / pages.length) * 100)}%` }} />
          </div>
        </div>
        <button onClick={() => chIndex < book.chapters.length - 1 && onNavigate(book.id, book.chapters[chIndex + 1].id)} disabled={chIndex === book.chapters.length - 1} className="hidden max-w-[180px] truncate rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#a89a7c] transition hover:border-[#e8c476]/40 disabled:opacity-30 sm:block">
          {chIndex < book.chapters.length - 1 ? book.chapters[chIndex + 1].title : 'Last reading'} →
        </button>
        {chapter.livingPage && (
          <button onClick={() => setLivingOpen(true)} className="hidden items-center gap-1.5 rounded-full border border-[#c9a8ff]/50 bg-[#c9a8ff]/10 px-3.5 py-1.5 text-xs text-[#c9a8ff] transition hover:bg-[#c9a8ff]/25 sm:flex" title="Open Living Page">
            <Sparkles size={13} /> Living Page
          </button>
        )}
        <button onClick={next} disabled={start + step > maxStart && chIndex === book.chapters.length - 1} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#8a5a1c] to-[#c99a3f] text-[#120b2e] transition hover:brightness-110 disabled:opacity-30 lg:hidden" aria-label="Next page"><ChevronRight size={18} /></button>
      </div>

      {/* living page overlay */}
      {livingOpen && chapter.livingPage && (
        <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={() => setLivingOpen(false)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={() => setLivingOpen(false)} className="flex items-center gap-1.5 rounded-full border border-[#e8c476]/40 bg-black/60 px-4 py-1.5 text-xs text-[#e8c476]"><X size={13} /> Return to the page</button>
            </div>
            <LivingPage id={chapter.livingPage} />
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border border-[#c9a8ff]/40 bg-[#c9a8ff]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a8ff]">{children}</span>;
}

```

## src/components/RoomView.tsx

```tsx
import { useMemo, useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { booksInRoom, getRoom } from '../data/library';
import type { LibraryStore } from '../hooks/useLibraryStore';
import type { RoomId } from '../data/types';
import Starfield from './Starfield';
import BookCover from './BookCover';

interface Props {
  roomId: RoomId;
  store: LibraryStore;
  onBack: () => void;
  onOpenBook: (bookId: string) => void;
  onOpenChapter: (bookId: string, chapterId: string) => void;
}

export default function RoomView({ roomId, store, onBack, onOpenBook, onOpenChapter }: Props) {
  const room = getRoom(roomId);
  const { store: s } = store;
  const books = booksInRoom(roomId);
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState<string>('all');
  const [status, setStatus] = useState<'all' | 'readable' | 'forthcoming'>('all');

  const subjects = useMemo(() => ['all', ...Array.from(new Set(books.flatMap((b) => b.subjects)))], [books]);
  const filtered = books.filter((b) => {
    if (subject !== 'all' && !b.subjects.includes(subject)) return false;
    if (status === 'readable' && b.chapters.length === 0) return false;
    if (status === 'forthcoming' && b.chapters.length > 0) return false;
    if (q.trim()) {
      const t = (b.title + b.author + b.tradition + b.description + b.themes.join(' ')).toLowerCase();
      if (!t.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <img src={room.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060312]/78 via-[#060312]/62 to-[#060312]" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 20%, ${room.glow}, transparent 60%)` }} />
      </div>
      <Starfield atmosphere={s.atmosphere} density={0.9} />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-24">
        <button onClick={onBack} className="glass flex items-center gap-1.5 rounded-full px-4 py-2 text-xs text-[#e8c476] transition hover:bg-[#e8c476]/10">
          <ArrowLeft size={14} /> Grand Atrium
        </button>

        <section className="animate-rise mt-6 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: room.accent }}>Inner Orbit · Celestial Library</div>
          <h1 className="font-display mt-2 text-4xl font-semibold leading-tight text-[#fdf6e3] sm:text-6xl">{room.name}</h1>
          <p className="font-display mt-1 text-xl italic" style={{ color: room.accent }}>{room.subtitle}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#d8cdb4] sm:text-[15px]">{room.description}</p>
          <p className="font-display mt-2 text-[15px] italic text-[#a89a7c]">“{room.motto}”</p>
        </section>

        {/* catalog controls */}
        <section className="glass mt-8 rounded-2xl p-3 sm:p-4" aria-label="Catalog controls">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#e8c476]/25 bg-black/40 px-3.5 py-2.5">
              <Search size={16} className="shrink-0 text-[#e8c476]" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search within ${room.name}…`} className="w-full bg-transparent text-sm text-[#fdf6e3] outline-none placeholder:text-[#8a7c5c]" aria-label={`Search within ${room.name}`} />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8a7c5c]"><SlidersHorizontal size={13} /> Subject</span>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-white/12 bg-black/50 px-2.5 py-2 text-xs text-[#d8cdb4] outline-none" aria-label="Filter by subject">
                {subjects.map((t) => (<option key={t} value={t}>{t === 'all' ? 'All subjects' : t}</option>))}
              </select>
              <div className="flex overflow-hidden rounded-lg border border-white/12" role="group" aria-label="Filter by availability">
                {(['all', 'readable', 'forthcoming'] as const).map((v) => (
                  <button key={v} onClick={() => setStatus(v)} className={`px-3 py-2 text-xs capitalize transition ${status === v ? 'bg-[#e8c476]/25 text-[#f7dd9a]' : 'text-[#a89a7c] hover:bg-white/5'}`}>{v === 'all' ? 'All' : v}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 px-1 text-[11px] text-[#8a7c5c]">{filtered.length} of {books.length} volumes · {filtered.reduce((n, b) => n + b.chapters.length, 0)} readings shown</div>
        </section>

        {/* shelves */}
        <section className="mt-6 space-y-4" aria-label="Catalog">
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="font-display text-xl italic text-[#a89a7c]">No volumes answer to that seeking.</p>
              <button onClick={() => { setQ(''); setSubject('all'); setStatus('all'); }} className="mt-3 rounded-full border border-[#e8c476]/40 px-4 py-1.5 text-xs text-[#e8c476]">Clear filters</button>
            </div>
          )}
          {filtered.map((b, i) => {
            const prog = s.progress[b.id];
            const readable = b.chapters.length > 0;
            return (
              <article key={b.id} className="animate-rise glass group flex flex-col gap-4 rounded-2xl p-4 transition hover:border-[#e8c476]/50 sm:flex-row sm:gap-6 sm:p-5" style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
                <button onClick={() => onOpenBook(b.id)} className="mx-auto shrink-0 transition group-hover:-translate-y-1 sm:mx-0" aria-label={`View details of ${b.title}`}>
                  <BookCover cover={b.cover} title={b.title} author={b.author} size="md" status={b.status} />
                </button>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${readable ? 'bg-[#8fd6a0]/15 text-[#8fd6a0]' : 'border border-white/15 text-[#8a7c5c]'}`}>
                      {readable ? `${b.chapters.length} readings` : 'Awaiting content'}
                    </span>
                    {b.edition.contentType === 'original' && <span className="rounded-full bg-[#c9a8ff]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#c9a8ff]">Inner Orbit original</span>}
                    {b.edition.contentType === 'public-domain' && <span className="rounded-full bg-[#7fb8ff]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#7fb8ff]">Public domain</span>}
                  </div>
                  <h2 className="font-display mt-1.5 text-2xl font-semibold text-[#fdf6e3] sm:text-[26px]">{b.title}</h2>
                  <p className="text-xs text-[#a89a7c]">{b.author} · {b.tradition}</p>
                  <p className="mx-auto mt-2 line-clamp-3 max-w-2xl text-[13px] leading-relaxed text-[#c9bda0] sm:mx-0">{b.description}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                    {b.subjects.map((t) => (<span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-[#a89a7c]">{t}</span>))}
                  </div>
                  {prog && readable && (
                    <div className="mx-auto mt-2 h-1 max-w-md overflow-hidden rounded-full bg-white/10 sm:mx-0">
                      <div className="h-full bg-gradient-to-r from-[#8a5a1c] to-[#f7dd9a]" style={{ width: `${Math.round(prog.percent * 100)}%` }} />
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {readable ? (
                      <>
                        <button onClick={() => onOpenChapter(b.id, prog?.chapterId ?? b.chapters[0].id)} className="rounded-full bg-gradient-to-r from-[#8a5a1c] to-[#c99a3f] px-5 py-2 text-[13px] font-semibold text-[#120b2e] transition hover:brightness-110">
                          {prog ? `Resume · ${prog.chapterTitle}` : `Begin · ${b.chapters[0].title}`}
                        </button>
                        <button onClick={() => onOpenBook(b.id)} className="rounded-full border border-[#e8c476]/40 px-5 py-2 text-[13px] text-[#e8c476] transition hover:bg-[#e8c476]/10">Details & contents</button>
                      </>
                    ) : (
                      <button onClick={() => onOpenBook(b.id)} className="rounded-full border border-white/20 px-5 py-2 text-[13px] text-[#c9bda0] transition hover:border-[#e8c476]/40 hover:text-[#f7dd9a]">Preview entry (no text yet)</button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

```

## src/components/SearchOverlay.tsx

```tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, BookOpen, ScrollText } from 'lucide-react';
import { searchLibrary, rooms } from '../data/library';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenBook: (bookId: string) => void;
  onOpenChapter: (bookId: string, chapterId: string) => void;
}

export default function SearchOverlay({ open, onClose, onOpenBook, onOpenChapter }: Props) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLibrary(q), [q]);

  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open ]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center overflow-y-auto bg-black/75 p-4 pt-20 backdrop-blur-sm" onClick={onClose}>
      <div className="glass ornate-frame w-full max-w-2xl rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[#e8c476]/20 p-4">
          <Search size={18} className="shrink-0 text-[#e8c476]" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search works, authors, traditions, themes, passages…" className="w-full bg-transparent text-[15px] text-[#fdf6e3] outline-none placeholder:text-[#8a7c5c]" aria-label="Search the entire library" />
          <button onClick={onClose} className="rounded-full border border-white/15 p-1.5 text-[#a89a7c]" aria-label="Close search"><X size={15} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!q.trim() && (
            <div className="px-2 py-4 text-center">
              <p className="font-display text-lg italic text-[#a89a7c]">“Ask, and the shelves will answer.”</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {['wu wei', 'Stoicism', 'mandala', 'water', 'dreams', 'golden ratio', 'compassion', 'time'].map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="rounded-full border border-[#e8c476]/30 px-3 py-1 text-xs text-[#e8c476] transition hover:bg-[#e8c476]/10">{s}</button>
                ))}
              </div>
            </div>
          )}
          {q.trim() && results.books.length === 0 && results.chapters.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-[#a89a7c]">No matches in the stacks. Try “water,” “Stoic,” “mandala,” or “dreams.”</p>
          )}
          {results.books.length > 0 && (
            <>
              <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a89a7c]">Works ({results.books.length})</div>
              {results.books.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId);
                return (
                  <button key={b.id} onClick={() => onOpenBook(b.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#e8c476]/10">
                    <BookOpen size={16} className="shrink-0" style={{ color: room?.accent }} />
                    <span className="min-w-0">
                      <span className="font-display block truncate text-[16px] font-semibold text-[#fdf6e3]">{b.title}</span>
                      <span className="block truncate text-[11px] text-[#a89a7c]">{b.author} · {room?.name} · {b.status === 'forthcoming' ? 'Awaiting content' : `${b.chapters.length} readings`}</span>
                    </span>
                  </button>
                );
              })}
            </>
          )}
          {results.chapters.length > 0 && (
            <>
              <div className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a89a7c]">Passages & readings ({results.chapters.length})</div>
              {results.chapters.slice(0, 12).map((c, i) => (
                <button key={i} onClick={() => onOpenChapter(c.book.id, c.chapterId)} className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#e8c476]/10">
                  <ScrollText size={16} className="mt-0.5 shrink-0 text-[#e8c476]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[#fdf6e3]">{c.title} <span className="font-normal text-[#a89a7c]">— {c.book.title}</span></span>
                    <span className="block truncate text-xs text-[#8a7c5c]">{c.snippet}</span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

```

## src/components/Starfield.tsx

```tsx
import { useEffect, useRef } from 'react';
import type { Atmosphere } from '../data/types';

interface Props {
  atmosphere: Atmosphere;
  density?: number;
  className?: string;
  goldRatio?: number;
}

export default function Starfield({ atmosphere, density = 1, className = '', goldRatio = 0.25 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = Math.round(((w * h) / 9000) * density * (atmosphere === 'full' ? 1 : atmosphere === 'subtle' ? 0.55 : 0.25));
    const stars = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      gold: Math.random() < goldRatio,
      tw: Math.random() * Math.PI * 2,
      sp: 0.2 + Math.random() * 0.8,
      drift: Math.random() * 0.00012 + 0.00002,
    }));
    const motes = atmosphere === 'full'
      ? Array.from({ length: Math.round(N / 6) }, () => ({
          x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3,
          a: Math.random() * Math.PI * 2, sp: 0.0004 + Math.random() * 0.0012,
        }))
      : [];

    let t = 0;
    const reduced = atmosphere === 'minimal';
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        if (!reduced) {
          s.tw += 0.02 * s.sp;
          s.y -= s.drift;
          if (s.y < -0.02) { s.y = 1.02; s.x = Math.random(); }
        }
        const tw = reduced ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(247,221,154,${0.85 * tw})` : `rgba(214,208,255,${0.8 * tw})`;
        ctx.fill();
        if (s.r > 1.4 && !reduced) {
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = s.gold ? `rgba(232,196,118,${0.08 * tw})` : `rgba(150,140,255,${0.08 * tw})`;
          ctx.fill();
        }
      }
      for (const m of motes) {
        m.a += m.sp * 4; m.y -= m.sp; m.x += Math.sin(m.a) * 0.0004;
        if (m.y < -0.05) { m.y = 1.05; m.x = Math.random(); }
        const g = ctx.createRadialGradient(m.x * w, m.y * h, 0, m.x * w, m.y * h, m.r * 4);
        g.addColorStop(0, 'rgba(247,221,154,.5)');
        g.addColorStop(1, 'rgba(247,221,154,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x * w, m.y * h, m.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [atmosphere, density, goldRatio]);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}

```

## src/data/becoming.ts

```ts
import type { Book } from './types';

export const becomingBooks: Book[] = [
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    roomId: 'becoming',
    tradition: 'Stoicism · Rome, c. 170–180 CE',
    subjects: ['Stoicism', 'Philosophy', 'Resilience'],
    themes: ['acceptance', 'duty', 'impermanence', 'mind', 'purpose'],
    status: 'selection',
    featured: true,
    pagesEstimate: 'Selection · 3 readings',
    cover: { material: 'stone', base: '#2b2b33,#4a4a55', accent: '#e8c476', motif: 'stoic', gem: '#cfd4ff' },
    description:
      'The private notebook of a Roman emperor at war — never meant for publication, never flinching. Stoic philosophy as a daily practice of perception, action, and will. Presented in George Long’s 1862 translation (public domain).',
    edition: {
      translator: 'George Long (1800–1879)',
      edition: 'The Meditations of Marcus Aurelius Antoninus (1862)',
      source: 'Public-domain edition; verified against Project Gutenberg transcription.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Curated selection from Books II and IV. Excerpts clearly marked.',
    },
    related: [
      { bookId: 'enchiridion', reason: 'The emperor and the freed slave: two voices, one Stoa.' },
      { bookId: 'bhagavad-gita', reason: 'Two warriors on duty — detached action East and West.' },
      { bookId: 'millennial-tao', reason: 'Stoic acceptance and Daoist flow as twin tools for modern pressure.' },
    ],
    chapters: [
      {
        id: 'med-2',
        title: 'Book II — The Morning Preparation',
        subtitle: 'Meeting the day as it is',
        sourceLabel: 'Meditations · Book II, opening · Long (1862)',
        attribution: 'Translated by George Long. Public domain.',
        verses: [
          {
            lines: [
              'Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial.',
              'All these things happen to them by reason of their ignorance of what is good and evil.',
              'But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me —',
              'not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity —',
              'I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him.',
              'For we are made for co-operation, like feet, like hands, like eyelids, like the rows of the upper and lower teeth.',
              'To act against one another then is contrary to nature; and it is acting against one another to be vexed and to turn away.',
            ],
          },
        ],
        essence:
          'Before the world disappoints you, decide in advance that it will — and that none of it can touch your true good. Difficult people act from ignorance, not malice; they are your kin, and you were made to work with them like hands with feet. Offense becomes impossible once expectation becomes honest.',
        deeper: [
          'This is the premeditatio malorum — the “pre-meditation of troubles” — a core Stoic exercise: rehearse the day’s frictions in advance so they arrive as expected weather, not personal attacks.',
          '“No one can fix on me what is ugly” states the Stoic doctrine of the inner citadel: your character is the only good truly yours, and no insult can alter it without your consent.',
          'The body imagery (feet, hands, eyelids, teeth) renders the Stoic doctrine of oikeiosis — natural affiliation. To hate a fellow human is as absurd as the teeth biting each other.',
        ],
        perspectives: [
          { label: 'Therapeutic', text: 'Cognitive reframing avant la lettre: change the appraisal (“ignorance, not malice”) and the anger dissolves.' },
          { label: 'Ethical', text: 'A universal kinship ethic — striking from an absolute monarch who could have chosen contempt.' },
          { label: 'Political', text: 'Written by an emperor on campaign: leadership as practiced patience with the ungrateful and arrogant.' },
        ],
        bringToLife: [
          { title: 'The inbox meditation', text: 'Before opening email, recite your version: “I shall meet with the terse, the demanding, the passive-aggressive…” Watch how pre-acceptance defuses the sting.' },
          { title: 'Family gatherings', text: 'The uncle who provokes, the sibling who competes — arrive having already granted them their ignorance, and keep your eyelids’ cooperation with your eyes.' },
        ],
        reflection: {
          questions: [
            'Who are your “busy-bodies and ungrateful” — and what ignorance (fear? pain? habit?) might actually drive them?',
            'What would change if you truly believed no one could “fix on you what is ugly”?',
          ],
          exercise: 'Write tomorrow’s morning preparation tonight: name three frictions you will likely meet and the kinship-response you choose. Read it before your phone.',
          journeyHook: 'A “Morning Stoa” ritual for Your Journey — streakable daily preparation.',
        },
        connections: [
          { bookId: 'dhammapada', chapterId: 'dhp-1', reason: '“Hatred ceases by love” and “made for co-operation” — one ethic, two rivers.' },
        ],
      },
      {
        id: 'med-4',
        title: 'Book IV — The Soul Dyed by Thought',
        subtitle: 'Retreat into yourself',
        sourceLabel: 'Meditations · Book IV (selections) · Long (1862)',
        attribution: 'Translated by George Long. Public domain.',
        verses: [
          {
            heading: 'The Country Retreat Within',
            lines: [
              'Men seek retreats for themselves, houses in the country, sea-shores, and mountains; and thou too art wont to desire such things very much.',
              'But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.',
              'For nowhere either with more quiet or more freedom from trouble does a man retire than into his own soul.',
            ],
          },
          {
            heading: 'The Dye of Thought',
            lines: [
              'The universe is transformation: life is opinion.',
              'If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgment about it. And it is in thy power to wipe out this judgment now.',
              'The soul becomes dyed with the color of its thoughts.',
              'Constantly then give to thyself this retreat, and renew thyself.',
            ],
          },
          {
            heading: 'The Present Moment',
            lines: [
              'He who lives in harmony with himself lives in harmony with the universe.',
              'Remember that man lives only in the present, in this fleeting instant: all the rest of his life is either past and gone, or not yet revealed.',
              'Short then is the time which every man lives, and small the nook of the earth where he lives.',
            ],
          },
        ],
        essence:
          'Stop searching for peace in places — the quietest retreat is the one you carry. Your pain comes not from events but from your judgments about them, and judgments can be wiped away like writing from a wax tablet. Your soul takes the color of whatever you repeatedly think; choose the dye, and keep returning to the present, which is the only time you ever actually live.',
        deeper: [
          '“Life is opinion” (hypolēpsis) is the epistemological core of Stoicism: between event and emotion stands assent — and assent is yours.',
          'The “retreat into thyself” was written on the Danube frontier, amid war and plague. Its credibility comes from its address: not a monastery but a military tent.',
          '“Short the time… small the nook” is the View from Above in miniature — cosmic perspective as therapy for rumination.',
        ],
        perspectives: [
          { label: 'Cognitive', text: 'The founding text of what became cognitive-behavioral therapy: disturb yourself with judgments, heal yourself by revising them.' },
          { label: 'Contemplative', text: 'A Western parallel to Buddhist mindfulness: return to the present, observe judgments, renew.' },
          { label: 'Existential', text: 'Radical responsibility: if life is opinion, then your inner life is your own craftsmanship — no excuses remain.' },
        ],
        bringToLife: [
          { title: 'The delayed train', text: 'The delay is external; the fury is judgment. Wipe it: “I am delayed; I will read.” Same platform, different soul-color.' },
          { title: 'Sunday dread', text: 'The weekend is present; the dread is opinion about Monday. Return to the nook of now.' },
        ],
        reflection: {
          questions: [
            'What “external thing” is paining you most right now? Write the event in one sentence, then your judgment about it in another. Can you wipe the second?',
            'What color is your soul being dyed this month — and is it the color you would choose?',
          ],
          exercise: 'Take a 60-second inner retreat: close your eyes, release one judgment deliberately, and notice what remains. That remainder is the citadel.',
          journeyHook: '“Inner Retreat” micro-practice — one minute, three times daily.',
        },
        livingPage: 'stoic-dichotomy',
        connections: [
          { bookId: 'dhammapada', chapterId: 'dhp-1', reason: 'The dyed soul and the forerunning mind — identical diagnosis, twin prescriptions.' },
          { bookId: 'consciousness-primer', reason: 'Modern psychology on appraisal, attention, and the constructed mind.' },
        ],
      },
      {
        id: 'med-5',
        title: 'Book V — The Work of a Human Being',
        subtitle: 'Rise to the common good',
        sourceLabel: 'Meditations · Book V, opening (selection) · Long (1862)',
        attribution: 'Translated by George Long. Public domain.',
        verses: [
          {
            lines: [
              'In the morning when thou risest unwillingly, let this thought be present — I am rising to the work of a human being.',
              'Why then am I dissatisfied if I am doing the things for which I exist and for which I was brought into the world?',
              'Or have I been made for this, to lie in the bed-clothes and keep myself warm?',
              'But this is more pleasing. Dost thou exist then to take thy pleasure, and not at all for action or exertion?',
              'Dost thou not see the little plants, the little birds, the ants, the spiders, the bees working together to put in order their several parts of the universe?',
              'And art thou unwilling to do the work of a human being, and dost thou not make haste to do that which is according to thy nature?',
            ],
          },
        ],
        essence:
          'When the bed holds you, remember what you are for. Every creature rises to its work — ants, bees, birds — and yours is the work of a rational, social being: to act for the common good. Pleasure is a side-effect of nature, never its purpose. Get up; the universe has assigned you a part.',
        deeper: [
          'The passage defines human nature functionally: a human is for rational, prosocial action as the eye is for seeing. “According to thy nature” is Stoicism’s entire ethic in one phrase.',
          'Note the gentleness beneath the sternness — Marcus writes to himself, not to shame but to rally. Self-address (“thou”) is the Meditations’ characteristic tenderness.',
          'The catalogue of nature (plants, birds, ants, spiders, bees) invokes the Stoic cosmopolis: all beings as fellow-workers in one ordered whole.',
        ],
        perspectives: [
          { label: 'Motivational', text: 'Antiquity’s great alarm clock — purpose as the antidote to comfort.' },
          { label: 'Ecological', text: 'Humanity as one working part among many: duty to the whole, not dominion over it.' },
          { label: 'Gentle critique (modern)', text: 'Readers with depression or burnout should hear the rallying tone as aspirational, not condemning — Marcus also counsels rest “according to nature.”' },
        ],
        bringToLife: [
          { title: 'The snooze debate', text: 'Tomorrow’s argument with the alarm is this passage in miniature. Try Marcus’s line verbatim: “I am rising to the work of a human being.”' },
          { title: 'Meaning at work', text: 'Boring tasks transform when framed as parts of the whole — the ant does not find the crumb meaningless.' },
        ],
        reflection: {
          questions: [
            'What is “the work of a human being” for you, concretely, this week?',
            'Where does comfort currently outvote nature in your mornings?',
          ],
          exercise: 'Place Marcus’s opening line by your bed tonight. Tomorrow, rise on the first alarm as an experiment in nature — and note the day’s texture.',
        },
        connections: [
          { bookId: 'bhagavad-gita', chapterId: 'gita-2', reason: 'Rise and act without clinging to fruits — emperor and archer agree.' },
        ],
      },
    ],
  },
  {
    id: 'enchiridion',
    title: 'Enchiridion',
    author: 'Epictetus (compiled by Arrian)',
    roomId: 'becoming',
    tradition: 'Stoicism · Nicopolis, c. 125 CE',
    subjects: ['Stoicism', 'Philosophy', 'Freedom'],
    themes: ['control', 'freedom', 'judgment', 'resilience'],
    status: 'selection',
    pagesEstimate: 'Selection · 2 readings',
    cover: { material: 'leather', base: '#3a2415,#6b4423', accent: '#e8c476', motif: 'stoic' },
    description:
      'The “handbook” of a freed slave who taught emperors: fifty-three short chapters that draw one bright line — between what is yours and what is not — and show how freedom lives entirely on your side of it. Presented in Elizabeth Carter’s 1758 translation (public domain).',
    edition: {
      translator: 'Elizabeth Carter (1717–1806)',
      edition: 'All the Works of Epictetus (1758)',
      source: 'Public-domain edition; verified against archive.org scan.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Selection: Chapters 1, 5, 8. Excerpts clearly marked.',
    },
    related: [
      { bookId: 'meditations', reason: 'The handbook and the journal: study Epictetus, then watch Marcus practice him.' },
      { bookId: 'dhammapada', reason: '“Men are disturbed not by things, but by opinions” — beside the Buddha on intention.' },
    ],
    chapters: [
      {
        id: 'ench-1',
        title: 'Of Things in Our Power',
        subtitle: 'The dichotomy of control',
        sourceLabel: 'Enchiridion · Chapters 1–2 (selection) · Carter (1758)',
        attribution: 'Translated by Elizabeth Carter. Public domain.',
        verses: [
          {
            lines: [
              'Of things, some are in our power, and others are not.',
              'In our power are opinion, pursuit, desire, aversion — and, in one word, whatever are our own actions.',
              'Not in our power are body, property, reputation, command, and, in one word, whatever are not our own actions.',
              'And the things in our power are by nature free, unrestrained, unhindered; but those not in our power are weak, slavish, restrained, belonging to others.',
              'Remember then, that if you suppose things by nature slavish to be free, and what belongs to others to be your own, you will be hindered, you will lament, you will be disturbed, you will find fault both with gods and men.',
              'But if you suppose that only to be your own which is your own, and what belongs to others such as it really is, then no one will ever compel you, no one will restrain you, you will find fault with no one, you will accuse no one, you will do no one thing against your will, you will have no enemy, and no one will harm you — for no harm can happen to you.',
            ],
          },
        ],
        essence:
          'Everything you suffer can be sorted into two baskets: yours (judgments, intentions, responses) and not yours (bodies, outcomes, reputations, events). Freedom is simply the discipline of wanting only from your own basket. Confuse the baskets and you enslave yourself; keep them straight and no one can ever compel you.',
        deeper: [
          'This opening is the most influential paragraph in Stoicism — the “dichotomy of control” that shaped everyone from Marcus to modern cognitive therapy to the Serenity Prayer.',
          'Note the radical claim: your body is “not in your power.” Epictetus means it is not fully yours to command — illness and accident prove it. Only your use of impressions is unconditionally free.',
          '“You will have no enemy” follows logically: enemies require that another can harm your true good — which, on this account, they cannot.',
        ],
        perspectives: [
          { label: 'Liberating', text: 'A total theory of freedom available even to a slave — as Epictetus himself had been.' },
          { label: 'Challenging', text: 'Critics ask: is the dichotomy too sharp? Modern Stoics often add a third basket — things we can influence but not control.' },
          { label: 'Therapeutic', text: 'The direct ancestor of CBT’s focus on appraisals and of acceptance-based approaches to anxiety.' },
        ],
        bringToLife: [
          { title: 'The performance review', text: 'Your preparation: yours. Their mood, the budget, the rating: not yours. Excellence in the first basket; equanimity toward the second.' },
          { title: 'Health anxiety', text: 'Your habits: yours. The outcome: not entirely. The dichotomy prescribes full care with zero demanded guarantees.' },
        ],
        reflection: {
          questions: [
            'Write your current biggest worry. Draw the line: which parts are opinion, pursuit, desire, aversion — and which belong to others?',
            'Where have you been supposing “what belongs to others to be your own”?',
          ],
          exercise: 'The two-basket journal: each evening for a week, sort the day’s events into “mine” and “not mine.” Watch the second basket lose its power.',
          journeyHook: '“Two Baskets” evening review for Your Journey.',
        },
        livingPage: 'stoic-dichotomy',
        connections: [
          { bookId: 'bhagavad-gita', chapterId: 'gita-2', reason: 'Yours: the work. Not yours: the fruit. Same line, drawn in Sanskrit.' },
        ],
      },
      {
        id: 'ench-2',
        title: 'Disturbed by Opinions',
        subtitle: 'Demand that events be as they are',
        sourceLabel: 'Enchiridion · Chapters 5, 8 (selection) · Carter (1758)',
        attribution: 'Translated by Elizabeth Carter. Public domain.',
        verses: [
          {
            heading: 'It Is Opinions That Disturb Us',
            lines: [
              'Men are disturbed, not by things, but by the principles and notions which they form concerning things.',
              'Death, for instance, is not terrible, else it would have appeared so to Socrates. But the terror consists in our notion of death, that it is terrible.',
              'When therefore we are hindered, or disturbed, or grieved, let us never ascribe it to others, but to ourselves — that is, to our own principles.',
            ],
          },
          {
            heading: 'Demand Not That Events Happen as You Wish',
            lines: [
              'Demand not that events should happen as you wish; but wish them to happen as they do happen, and you will go on well.',
              'Sickness is a hindrance to the body, but not to the will, unless the will itself pleases.',
              'Lameness is a hindrance to the leg, but not to the will. And say this to yourself at everything that happens — for you will find it a hindrance to something else, but not to yourself.',
            ],
          },
        ],
        essence:
          'Nothing outside you disturbs you — only your notions about it. Death frightened no one until a notion called it terrible; the obstacle blocks your plan but never your will, unless you let it. So reverse the demand: stop insisting events match your wishes, and train your wishes to match events. That reversal is serenity.',
        deeper: [
          'Chapter 5 is the locus classicus of cognitive mediation — the claim that emotion follows interpretation. Socrates’ calm death is Exhibit A: same event, different notion, different experience.',
          'Chapter 8’s amor fati (“wish events to happen as they do”) predates Nietzsche’s famous phrase by 1,750 years — and goes further, making it a daily exercise rather than a heroic ideal.',
          'The body/will distinction is precise: sickness hinders the body (an external) but the will (prohairesis) remains free to respond well — Epictetus, himself lame, wrote from inside this truth.',
        ],
        perspectives: [
          { label: 'Empowering', text: 'Your will is unhinderable — the one fortress no circumstance can storm.' },
          { label: 'Pastoral caution', text: 'This consoles the sufferer who can act; it must never be used to blame victims or dismiss real harm. Epictetus comforts, never accuses.' },
          { label: 'Modern', text: 'The Serenity Prayer (“accept the things I cannot change…”) is this chapter in liturgical dress.' },
        ],
        bringToLife: [
          { title: 'The cancelled flight', text: 'The cancellation hinders the itinerary, not the will. The will can read, rebook, rest — “and you will go on well.”' },
          { title: 'Criticism', text: 'The words are sounds; the wound is your notion (“this means I am worthless”). Examine the notion and the words shrink to size.' },
        ],
        reflection: {
          questions: [
            'What event are you demanding be otherwise? State it plainly — then practice wishing it as it is, for one minute.',
            'Whose death-like “terrible” in your life might actually be a notion, Socrates-style?',
          ],
          exercise: 'At the next hindrance today, pause and say: “This hinders X, but not my will.” Then choose the will’s response deliberately.',
        },
        connections: [
          { bookId: 'meditations', chapterId: 'med-4', reason: '“Wipe out this judgment now” — Marcus practicing Epictetus’s Chapter 5.' },
        ],
      },
    ],
  },
  {
    id: 'seneca-letters',
    title: 'Letters to Lucilius',
    author: 'Seneca the Younger',
    roomId: 'becoming',
    tradition: 'Stoicism · Rome, c. 63–65 CE',
    subjects: ['Stoicism', 'Philosophy', 'Time'],
    themes: ['time', 'friendship', 'death', 'simplicity'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'papyrus', base: '#4a2c10,#7a5a2e', accent: '#f7dd9a', motif: 'scroll' },
    description:
      '124 letters on time, friendship, and the art of dying well — including the immortal “On the Shortness of Life.” A Gummere (1917–25, public domain) selection is being prepared.',
    edition: {
      translator: 'Richard M. Gummere (in preparation)',
      edition: 'Loeb Classical Library vols. 75–77 — verification in progress',
      source: 'To be verified against archive.org scans.',
      rights: 'Public domain (pending verification).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'meditations', reason: 'Seneca taught the tradition Marcus embodied.' }],
    chapters: [],
  },
  {
    id: 'art-of-beginning',
    title: 'The Art of Beginning',
    author: 'Inner Orbit · Original Work',
    roomId: 'becoming',
    tradition: 'Inner Orbit Original · Practical philosophy',
    subjects: ['Creativity', 'Practice', 'Courage'],
    themes: ['beginning', 'practice', 'courage', 'craft'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'leather', base: '#123a2a,#1e6b4a', accent: '#ffe9a8', motif: 'tree', gem: '#8dffb0' },
    description:
      'An original Inner Orbit manual on starting — the blank page, the first step, the imperfect launch. Prototypes of Stoic-Daoist practice adapted for makers, seekers, and late bloomers. In composition.',
    edition: {
      edition: 'Inner Orbit Original — first edition in composition',
      source: 'Written for the Celestial Library.',
      rights: '© Inner Orbit (original work).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — first chapters in draft.',
    },
    related: [{ bookId: 'millennial-tao', reason: 'Beginning as wu wei: start soft, start small, start now.' }],
    chapters: [],
  },
];

```

## src/data/library.ts

```ts
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

```

## src/data/millennial.ts

```ts
import type { Book } from './types';

export const millennialTao: Book = {
  id: 'millennial-tao',
  title: 'The Millennial Tao',
  author: 'Inner Orbit · Original Companion',
  roomId: 'becoming',
  tradition: 'Inner Orbit Original · Companion to the Tao Te Ching',
  subjects: ['Daoism', 'Modern Life', 'Practice'],
  themes: ['wu-wei', 'simplicity', 'language', 'adaptability', 'humility'],
  status: 'complete',
  featured: true,
  pagesEstimate: 'Introductory edition · 3 chapters',
  cover: { material: 'silk', base: '#0b1e3a,#274a7a', accent: '#ffe9a8', motif: 'millennial', gem: '#7fe0ff' },
  description:
    'An original Inner Orbit companion that translates the Tao Te Ching’s ancient current into contemporary language — notifications, deadlines, group chats, and all. This is not a translation and never pretends to be: it is a friendly bridge to the original, grounded chapter by chapter in real Daoist concepts, with practices for ordinary days. Introductory edition: three substantive chapters.',
  edition: {
    edition: 'Inner Orbit Introductory Edition v0.1 — three chapters',
    source: 'Written originally for the Celestial Library; Daoist concepts verified against Legge (1891) and standard scholarship.',
    rights: '© Inner Orbit (original work). Free to read in the Library.',
    contentType: 'original',
    completeness: 'Complete introductory edition (3/3 chapters). Structured for later chapter-by-chapter expansion.',
  },
  related: [
    { bookId: 'tao-te-ching', reason: 'The source spring — read each Millennial chapter beside its Tao Te Ching root.' },
    { bookId: 'enchiridion', reason: 'Ancient East and West agree: hold plans lightly, act cleanly.' },
    { bookId: 'consciousness-primer', reason: 'What the un-named mind looks like to modern science.' },
  ],
  chapters: [
    {
      id: 'mt-1',
      title: 'The Map Is Not the Morning',
      subtitle: 'After Tao Te Ching, Chapter 1 · On language and fixed definitions',
      sourceLabel: 'The Millennial Tao · Chapter 1 · Original text',
      attribution: 'Original Inner Orbit writing. Philosophical foundation: Tao Te Ching Ch. 1 (Legge 1891, public domain).',
      verses: [
        {
          heading: 'Philosophical Foundation',
          lines: [
            'The Tao Te Ching opens with a warning label: the Tao that can be named is not the eternal Tao. Before Laozi tells you anything, he tells you that telling has limits — that every name is a handle, and reality refuses to be carried by its handles.',
            'This is not mysticism being evasive. It is philosophy being precise: definitions draw borders, and the living world keeps crossing them. The chapter gives us the “nameless” (mystery, origin) and the “named” (the distinct things of daily life) — same reality, two modes of meeting it.',
          ],
        },
        {
          heading: 'The Contemporary Current',
          lines: [
            'You live inside the most naming-saturated civilization in history. Algorithms label you (high-intent buyer, anxious attacher, type-A); you label yourself back (burnt out, behind, “not a morning person”); everyone performs nouns — founder, creator, healer — as if the noun were the person.',
            'The ancient warning fits this world like it was written yesterday: every label is a map, and you keep mistaking your maps for mornings. The profile is not the person. The diagnosis is not the destiny. The five-year plan is not the life — it is a sketch of one, drawn by someone (past-you) who knew less than present-you.',
            'None of this means abandoning language. Laozi wrote eighty-one chapters, after all. It means holding names the way you hold a good map on a real hike: grateful for guidance, eyes up for the actual trail, willing to fold the map when the mountain disagrees.',
          ],
        },
        {
          heading: 'A Small Practice of Un-Naming',
          lines: [
            'Pick one fixed definition you carry — about yourself or someone close. (“I’m bad with money.” “She never listens.” “I’m an introvert, so I can’t.”) For one week, treat it as a hypothesis instead of a fact. Collect one counter-example per day. Most people find the label was a cage with the door open.',
            'The gate of the subtle and wonderful, the old text says, opens where the Mystery is deepest. Translation for moderns: curiosity lives on the far side of certainty. Un-name one thing, and watch aliveness leak back in.',
          ],
        },
      ],
      essence:
        'Words are maps; life is the territory. You navigate partly by labels — roles, diagnoses, identities — but freedom begins when you remember they are tools, not truths. Hold every definition lightly enough to update it, and the world gets bigger, kinder, and more possible.',
      deeper: [
        'The chapter’s wordplay (tao as both “way” and “to speak”) performs its own message — language wobbling even as it points. Modern linguistics agrees: categories shape perception (the Sapir-Whorf vicinity), which is why rigid labels literally narrow what you can see.',
        'Psychology rediscovered this as “cognitive defusion” (ACT therapy): you are not your story about yourself. And Carol Dweck’s growth-mindset research shows fixed self-definitions (“I’m not a math person”) measurably degrade performance.',
        'Important nuance: un-naming is not vagueness and never an excuse to dodge accountability. “Labels are limited” cannot launder “I refuse to be described.” The Taoist holds names lightly — and still answers to them.',
      ],
      perspectives: [
        { label: 'Daoist', text: 'Names divide the undivided; wisdom keeps one foot in the nameless while functioning skillfully among names.' },
        { label: 'Stoic (compare)', text: 'Epictetus agrees from the West: “It is not things but opinions about things” — labels — “that disturb us.” Different tradition, same leverage point. Neither claims the traditions are identical.' },
        { label: 'Skeptical', text: 'A fair objection: some names (medical diagnoses, legal categories) save lives precisely by being fixed. The chapter’s answer: fix them where precision serves; release them where it strangles.' },
      ],
      bringToLife: [
        { title: 'The bio audit', text: 'Read your own social-media bio. Notice what it claims you are. Ask: what true thing about me would never fit here? That remainder is the nameless peeking through.' },
        { title: 'The difficult person', text: 'Someone you’ve filed under a noun — “narcissist,” “flake,” “difficult.” Try one interaction with the file closed. You may meet a verb (a person becoming) instead.' },
        { title: 'Career labels', text: '“I’m a designer, so I can’t write strategy” — the map forbidding the territory. The un-named professional experiments first and updates the title later.' },
      ],
      reflection: {
        questions: [
          'What three labels do you introduce yourself with most? Which one is most overdue for revision?',
          'Where has a label about someone else become a self-fulfilling prophecy — you stopped seeing anything but the noun?',
          'What would you attempt this month if your fixed self-definition were suspended?',
        ],
        exercise: 'The Un-Name Journal: each evening, write one sentence beginning “Today I was more than ___” and one beginning “Today ___ surprised me by ___.” Seven days. Notice the loosening.',
        journeyHook: 'Designed to become a “Beginner’s Mind” practice path in Your Journey — label audits and curiosity streaks.',
      },
      livingPage: 'breath-mandala',
      connections: [
        { bookId: 'tao-te-ching', chapterId: 'ttc-1', reason: 'Read the 2,300-year-old source this chapter translates.' },
        { bookId: 'varieties-experience', reason: 'James on the “ineffable” quality of mystical states — the nameless, studied.' },
      ],
    },
    {
      id: 'mt-2',
      title: 'Flow, Don’t Force',
      subtitle: 'After Tao Te Ching, Chapter 8 · On wu wei in a hustle world',
      sourceLabel: 'The Millennial Tao · Chapter 2 · Original text',
      attribution: 'Original Inner Orbit writing. Philosophical foundation: Tao Te Ching Ch. 8 (Legge 1891, public domain).',
      verses: [
        {
          heading: 'Philosophical Foundation',
          lines: [
            '“The highest excellence is like water,” says Chapter 8. Water benefits everything, contends with nothing, settles into the low places everyone else avoids — and in the end shapes stone. This is the portrait of wu wei: not passivity, not laziness, not “doing nothing,” but action without unnecessary forcing — timely, responsive, frictionless.',
            'The chapter then applies water-logic everywhere: stillness of mind, skill in affairs, timeliness in movement, humility in position. Wu wei is not one technique; it is a way of moving through a whole life the way water moves through a landscape.',
          ],
        },
        {
          heading: 'The Contemporary Current',
          lines: [
            'Hustle culture worships hardness: push through, grind, dominate, never settle. It works — until it doesn’t. The forced launch flops, the pressured relationship cracks, the white-knuckled creative session produces clenched, joyless work. Force borrows from tomorrow’s energy at brutal interest.',
            'Water-logic proposes the opposite experiment. The email that needs “the right moment” — wait for it. The conflict that tightens every time you push — try the low place: ask a question instead of making a point. The project that feels like dragging stone — ask what wants to happen (what the material, the market, the moment allows) and align effort with that grain instead of against it.',
            'Athletes call it the zone; musicians call it groove; psychologists call it flow. The Taoists just called it Tuesday. Wu wei is the discovery that your best work usually feels less like wrestling and more like steering something already moving.',
          ],
        },
        {
          heading: 'Forcing vs. Flowing: A Field Guide',
          lines: [
            'Forcing feels like: tight chest, tunnel vision, irritability at obstacles, exhaustion disproportionate to output, and a strange hollowness even when you “win.”',
            'Flowing feels like: alert relaxation, obstacles registering as information rather than insult, time dilating, energy sustained, and work that surprises you with its quality.',
            'The practice is embarrassingly simple to state and endlessly subtle to live: several times a day, ask “Am I water right now, or am I stone arguing with stone?” Then make one small adjustment toward water — soften the grip, change the timing, take the low place, or rest so the silt settles.',
          ],
        },
      ],
      essence:
        'Stop arguing with stone and start studying water. Wu wei means acting with the grain of the moment — right timing, soft persistence, no wasted force — rather than grinding against it. It is not doing less; it is forcing less, so that what you do lands.',
      deeper: [
        'Wu wei (無為) is among the most mistranslated terms in philosophy. “Non-action” misleads English readers toward passivity; scholars increasingly prefer “effortless action” (Slingerland) or “action without overdoing.” The water of Chapter 8 is extremely active — it nourishes all things — but never contentious.',
        'Flow research (Csikszentmihalyi) converges strikingly: optimal experience arises when challenge meets skill, goals are clear, and the self-conscious “forcer” drops out. Different vocabulary, same river.',
        'The “low place” deserves care: it is strategic humility, not self-erasure. Water takes the low place and thereby gathers all streams. The chapter promises influence through non-contention — not disappearance.',
      ],
      perspectives: [
        { label: 'Daoist', text: 'Align with the Tao’s own movement; force reveals misalignment, not virtue.' },
        { label: 'Stoic (compare)', text: 'Marcus would add: control your effort, release the outcome. Wu wei governs the how; Stoicism guards the heart toward results. Complementary, not identical.' },
        { label: 'Caution', text: '“Going with the flow” must never baptize avoidance or injustice. Water also floods; discernment chooses when to yield and when to carve.' },
      ],
      bringToLife: [
        { title: 'The deadline crunch', text: 'Forcing: fourteen frantic hours, snapping at collaborators, shipping something brittle. Water: ruthless prioritization, one honest conversation about scope, protected sleep — often shipping better work in fewer hours.' },
        { title: 'Traffic', text: 'You cannot force the highway. The water-driver picks the lane that moves, breathes, listens to something good — arriving minutes later and hours calmer.' },
        { title: 'Creative work', text: 'Stuck on the blank page? Forcing produces clenched drafts. Walk, shower, sleep — the silt settles, the water clears, and the sentence you needed surfaces like a fish.' },
      ],
      reflection: {
        questions: [
          'Where are you currently “stone arguing with stone”? Describe the forcing in one paragraph.',
          'What would the water-version of your next move be — softer timing, lower place, different channel?',
          'When did flow last find you? What conditions preceded it — and can you garden those conditions?',
        ],
        exercise: 'The Water Audit: three times tomorrow, pause and rate forcing-vs-flowing 1–10. For each forcing-moment, make one micro-adjustment (breathe, re-time, ask, yield). Log what changed.',
        journeyHook: 'A natural “Flow Experiments” track for Your Journey — daily forcing/flow check-ins.',
      },
      livingPage: 'tao-water',
      connections: [
        { bookId: 'tao-te-ching', chapterId: 'ttc-8', reason: 'The source chapter on water-excellence, in Legge’s 1891 English.' },
        { bookId: 'enchiridion', chapterId: 'ench-2', reason: '“Demand not that events happen as you wish” — the Western companion to wu wei.' },
      ],
    },
    {
      id: 'mt-3',
      title: 'Enough Is a Place',
      subtitle: 'After Tao Te Ching, Chapters 11 & 25 · On simplicity, desire, and contentment',
      sourceLabel: 'The Millennial Tao · Chapter 3 · Original text',
      attribution: 'Original Inner Orbit writing. Foundations: Tao Te Ching Chs. 11 & 25 (Legge 1891, public domain).',
      verses: [
        {
          heading: 'Philosophical Foundation',
          lines: [
            'Two chapters, one teaching. Chapter 11: the wheel works because of its empty hub, the vessel because of its hollowness, the room because of its space. Usefulness lives in emptiness. Chapter 25: humanity nested in Earth, Earth in Heaven, all in the self-so Tao — belonging as the deepest fact, not acquisition.',
            'Together they diagnose the modern disease with ancient precision: we keep adding spokes while ignoring the hub, filling rooms until no one can move, and chasing belonging through accumulation — when belonging was the starting condition and usefulness was always about space.',
          ],
        },
        {
          heading: 'The Contemporary Current',
          lines: [
            'Desire, in the attention economy, is manufactured on industrial lines. Every feed is a catalog of lives shinier than yours; every “limited drop” is urgency synthesized in a marketing meeting. The result is what psychologists call the hedonic treadmill and what the Taoists would call a room with no empty space — full, and therefore useless.',
            '“Enough” is not a number. It is a place — a settled recognition that the vessel of your life is already hollow in the right shape to be useful. Practices that relocate you there are unglamorous and undefeated: the cleared surface, the finished (not perfect) project, the phone in another room, the want-list that must age thirty days before it becomes a buy-list.',
            'And beneath the tactics sits Chapter 25’s consolation: you are already nested. The stars over the parking lot are the same vastness the old sages praised. Contentment is not having everything; it is remembering where — and in what — you already are.',
          ],
        },
        {
          heading: 'The Soft Strength of Less',
          lines: [
            'Adaptability, humility, non-contention — the chapter-cluster’s quiet virtues — all turn out to be strengths of the soft. The person who needs less can bend further, wait longer, and walk away cleaner. Every desire you release is a negotiation you no longer have to win.',
            'Try the ancient audit in modern dress: for each recurring want, ask “Which emptiness would this fill — and is that emptiness actually the useful part?” Genuine needs answer clearly. Manufactured ones dissolve under the question like mist — hevel, as the Hebrew Teacher would say.',
          ],
        },
      ],
      essence:
        'Usefulness lives in emptiness and belonging precedes acquisition — so the good life is less about adding and more about protecting space. “Enough” is not a finish line you cross but a place you return to: the clear hub, the breathable room, the already-nested self.',
      deeper: [
        'Chapter 11’s triad (wheel, vessel, room) is design philosophy: form serves void. Minimalist movements from Shaker furniture to Marie Kondo unknowingly preach it; the Tao Te Ching preached it first.',
        'Desire research supports the diagnosis: beyond sufficiency, additional consumption barely moves well-being (the Easterlin vicinity), while “wanting” circuitry (dopamine) is distinct from “liking” circuitry — you can be driven to chase what will not satisfy.',
        'Non-contention (不爭) as strength: game theory’s cooperative strategies, negotiation’s “best alternative,” and the martial arts’ yielding throws all formalize what Chapter 8 intuited — softness as power.',
      ],
      perspectives: [
        { label: 'Daoist', text: 'Return to the uncarved block (pu): simplicity not as poverty but as undifferentiated potential.' },
        { label: 'Stoic (compare)', text: 'Seneca: “It is not the man who has too little, but the man who craves more, that is poor.” Same arithmetic, Roman ledger.' },
        { label: 'Justice note', text: 'Contentment-talk must never shame real need. The teaching addresses manufactured want amid sufficiency — not poverty, which deserves remedy, not sermons.' },
      ],
      bringToLife: [
        { title: 'The thirty-day list', text: 'Every non-essential want goes on a dated list. If you still want it in thirty days, consider it. Most entries will embarrass their authors — that embarrassment is Chapter 11 working.' },
        { title: 'The one clear surface', text: 'Keep a single surface — desk, nightstand, kitchen counter — permanently clear. It becomes a shrine to the useful void and a daily reminder of Enough.' },
        { title: 'Enough, stated', text: 'Write your “enough” for money, stuff, followers, busyness — concrete numbers. Unwritten enoughs inflate forever; written ones can be arrived at.' },
      ],
      reflection: {
        questions: [
          'What room in your life (literal or figurative) has lost its emptiness? What would one clear cubic foot change?',
          'Whose manufactured desire are you currently carrying as if it were your own?',
          'Describe your “Enough” in one paragraph. When did you last visit that place?',
        ],
        exercise: 'The Emptiness Audit: empty one container, cancel one subscription of attention (a feed, a newsletter, a grudge), and leave one hour unscheduled this week. Journal the usefulness of each void.',
        journeyHook: '“Enough Is a Place” could anchor a Your Journey season on simplicity — audits, clearings, and contentment check-ins.',
      },
      livingPage: 'fibonacci-spiral',
      connections: [
        { bookId: 'tao-te-ching', chapterId: 'ttc-11', reason: 'The wheel, the vessel, the room — the 2,300-year-old original.' },
        { bookId: 'sacred-geometry-primer', chapterId: 'sg-2', reason: 'Nature’s own “enough”: the spirals that grow by perfect proportion.' },
        { bookId: 'ecclesiastes', chapterId: 'eccl-1', reason: '“The eye is not satisfied with seeing” — Hebrew wisdom on the same treadmill.' },
      ],
    },
  ],
};

```

## src/data/patterns.ts

```ts
import type { Book } from './types';

export const patternsBooks: Book[] = [
  {
    id: 'sacred-geometry-primer',
    title: 'Forms of Eternity — A Sacred Geometry Primer',
    author: 'Inner Orbit · Original Work',
    roomId: 'patterns',
    tradition: 'Inner Orbit Original · Mathematics, history & symbolism',
    subjects: ['Sacred Geometry', 'Mathematics', 'Symbolism'],
    themes: ['proportion', 'solids', 'spirals', 'mandalas', 'harmony'],
    status: 'complete',
    featured: true,
    pagesEstimate: 'Original · 3 chapters',
    cover: { material: 'metal', base: '#101a3a,#2e4a8a', accent: '#f7dd9a', motif: 'geometry', gem: '#9fe8ff' },
    description:
      'An original, hands-on introduction to the mathematics that mystics loved: the five Platonic solids, the golden ratio and Fibonacci growth, and the mandala as cosmos-map. Established mathematics and spiritual associations are rigorously distinguished — wonder without confusion.',
    edition: {
      edition: 'Inner Orbit First Edition — complete in three chapters',
      source: 'Original exposition; mathematical facts standard (Euclid XIII, Fibonacci 1202, Coxeter). Historical claims per cited scholarship.',
      rights: '© Inner Orbit (original work).',
      contentType: 'original',
      completeness: 'Complete (3/3 chapters), each with an interactive Living Page demonstration.',
    },
    related: [
      { bookId: 'tao-te-ching', reason: 'Chapter 11’s wheel and vessel — emptiness made geometric.' },
      { bookId: 'alchemical-symbols', reason: 'Where these forms reappear as alchemical emblems.' },
      { bookId: 'dhammapada', reason: 'Mandalas as Buddhist meditation architecture.' },
    ],
    chapters: [
      {
        id: 'sg-1',
        title: 'The Five Perfect Solids',
        subtitle: 'Why there are exactly five — and what they meant',
        sourceLabel: 'Forms of Eternity · Chapter 1 · Original',
        attribution: 'Original Inner Orbit writing. Mathematics: standard (Euclid, Elements XIII).',
        verses: [
          {
            heading: 'ESTABLISHED MATHEMATICS: Exactly Five',
            lines: [
              'A Platonic solid is a convex polyhedron with identical regular-polygon faces meeting identically at every vertex. There are exactly five — tetrahedron (4 triangles), cube (6 squares), octahedron (8 triangles), dodecahedron (12 pentagons), icosahedron (20 triangles) — and this was proved by Euclid (Elements, Book XIII, c. 300 BCE): only five angle-combinations can close around a point in three dimensions.',
              'Each solid has a dual (faces ↔ vertices): cube ↔ octahedron, dodecahedron ↔ icosahedron, tetrahedron ↔ itself. Euler’s formula (V − E + F = 2) governs them all. These are facts — as certain as anything humans know.',
            ],
          },
          {
            heading: 'HISTORY: The Solids as Elements',
            lines: [
              'Plato’s Timaeus (c. 360 BCE) assigned solids to elements: tetrahedron–fire (sharp), cube–earth (stable), octahedron–air, icosahedron–water — with the dodecahedron reserved for the cosmos itself (“the god used it for the whole”). This was natural philosophy, not mysticism: the best physics of its day, wrong but magnificent.',
              'The lineage runs through Kepler (who nested the solids to model planetary orbits in Mysterium Cosmographicum, 1596 — wrong, and gloriously productive, leading him to his laws) to modern chemistry, where tetrahedral carbon and icosahedral viruses vindicate the intuition that nature loves these forms.',
            ],
          },
          {
            heading: 'SPIRITUAL ASSOCIATIONS (interpretive — not mathematics)',
            lines: [
              'Esoteric traditions later mapped the solids onto chakras, archangels, and “Metatron’s Cube” (a modern construction, not ancient). These mappings are meaningful to practitioners and historically interesting — but they are associations layered onto the mathematics, not conclusions from it. This Library honors the distinction: the five-fold proof belongs to everyone; the symbolism belongs to its traditions.',
            ],
          },
        ],
        essence:
          'Only five perfectly regular solids can exist — Euclid proved it — and that austere fact has fascinated everyone from Plato to Kepler to virologists. The solids are genuine meeting-grounds of necessity and beauty; the spiritual meanings layered onto them are human responses to that beauty, precious but distinct from the proof.',
        deeper: [
          'Why five? Around any vertex, face-angles must sum to less than 360°. Only six regular-face combinations qualify; one tiles flat instead of closing. Hence: five. A proof you can verify with paper polygons in an afternoon.',
          'Duality pairs the solids beautifully: join cube face-centres and an octahedron appears. Contemplatives read this as metaphysics (inner/outer, heaven/earth mirroring); mathematicians read it as symmetry — both are responding to something real.',
          '“Sacred geometry” as a modern movement blends genuine mathematics with speculative claims (pyramid energies, “flower of life” antiquity). Enjoy the art; verify the history; cherish the proofs.',
        ],
        perspectives: [
          { label: 'Mathematical', text: 'Classification theorem: complete, proved, eternal. The solids need no symbolism to be wonderful.' },
          { label: 'Historical', text: 'Plato’s and Kepler’s “wrong” uses generated real science — beauty as a productive bet, not a guarantee.' },
          { label: 'Contemplative', text: 'Holding an imagined dodecahedron in meditation is a focusing discipline; its value is experiential, and that is enough.' },
        ],
        bringToLife: [
          { title: 'Build one', text: 'Print a net, fold a tetrahedron. The moment flat paper locks into inevitable form, you feel what “proof” means in your hands.' },
          { title: 'Spot them', text: 'Dice (cube), viruses (icosahedral), pyrite (cubic), garnets (dodecahedral) — the five are hiding in plain sight.' },
        ],
        reflection: {
          questions: [
            'Why does “exactly five” feel meaningful? What does your response reveal about how you relate necessity to beauty?',
            'Where else do you conflate a fact with the feelings it evokes — and is that conflation harmful or fertile?',
          ],
          exercise: 'Rotate each solid in the Living Page below. For each, write one mathematical sentence (true) and one associative sentence (felt) — and label which is which.',
          journeyHook: 'A “Fact & Felt” discernment log for Your Journey.',
        },
        livingPage: 'geometry-solids',
        connections: [
          { bookId: 'tao-te-ching', chapterId: 'ttc-11', reason: 'The vessel’s hollowness — now in foldable, rotatable form.' },
        ],
      },
      {
        id: 'sg-2',
        title: 'The Golden Ratio & the Fibonacci Growth',
        subtitle: 'Phi, spirals, and honest wonder',
        sourceLabel: 'Forms of Eternity · Chapter 2 · Original',
        attribution: 'Original Inner Orbit writing. Mathematics: standard.',
        verses: [
          {
            heading: 'ESTABLISHED MATHEMATICS: Phi and Fibonacci',
            lines: [
              'The golden ratio φ (phi ≈ 1.618…) is the number where a line divided so that whole : long = long : short. Euclid defined it (Elements VI); it appears in pentagons, Penrose tilings, and continued fractions — genuinely, provably, beautifully.',
              'The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13…) — published by Leonardo of Pisa in Liber Abaci (1202) — converges on φ: each ratio of neighbors approaches 1.618…. This is theorem, not mystique.',
              'Phyllotaxis — leaf and seed arrangement — really does favor Fibonacci angles (≈137.5°, the golden angle) because it packs optimally. Sunflowers, pinecones, and pineapples exhibit Fibonacci spirals for reasons of efficiency that botanists understand. Honest wonder needs no exaggeration.',
            ],
          },
          {
            heading: 'HONEST CORRECTIONS: What Is Oversold',
            lines: [
              'Nautilus shells are usually NOT golden spirals (they are logarithmic spirals with different growth factors — a beautiful fact displaced by a false one). Claims about the Parthenon, pyramids, and human body often involve cherry-picked measurements. The “most beautiful rectangle” experiments are mixed at best.',
              'This Library’s rule: real phi-phenomena (pentagons, phyllotaxis, Penrose, continued fractions) are astonishing enough. We debunk the fakes to protect the genuine marvels.',
            ],
          },
          {
            heading: 'SPIRAL GROWTH (interactive below)',
            lines: [
              'The Living Page lets you grow a Fibonacci spiral square-by-square and compare it against a true golden spiral and a nautilus cross-section — seeing with your own eyes where nature matches the mathematics and where myth overreaches it.',
            ],
          },
        ],
        essence:
          'Phi is real, Fibonacci growth is real, and sunflowers really do the mathematics — but nautilus shells mostly don’t, and the Parthenon probably doesn’t. The honest golden ratio is more wonderful than the hyped one, because it survives scrutiny. Learn the true cases, release the false, and keep the awe.',
        deeper: [
          'Why 137.5°? It is the angle that never repeats (φ being “most irrational”), so each new seed lands in the largest remaining gap — optimal packing emerging from number theory. Evolution discovered the theorem by survival.',
          'The golden ratio’s aesthetic claims trace largely to 19th-century German psychologists (Zeising, Fechner) — interesting experiments, overstated conclusions, then a century of self-help inflation. Knowing this history inoculates wonder against embarrassment.',
          'Logarithmic spirals (nautilus, galaxies, hurricanes) share self-similarity with golden spirals but differ in growth factor — cousins, not twins. Precision here is a form of respect for nature’s actual variety.',
        ],
        perspectives: [
          { label: 'Mathematical', text: 'φ as algebraic celebrity: continued fractions, pentagon geometry, Penrose aperiodicity — riches enough.' },
          { label: 'Biological', text: 'Phyllotaxis as optimization: nature “uses” Fibonacci the way rivers “use” calculus — by consequence, not contemplation.' },
          { label: 'Symbolic', text: 'Growth-by-proportion as a life image (the Millennial Tao’s “Enough”): expand without distortion, larger yet same-shaped.' },
        ],
        bringToLife: [
          { title: 'Count a sunflower', text: 'Seed-head spirals come in Fibonacci pairs (34/55, 55/89). Counting them in a garden is mathematics as treasure hunt.' },
          { title: 'Grow proportionally', text: 'A project, a team, a life — scaling that preserves shape (values, ratios, rhythms) is phyllotaxis as management philosophy.' },
        ],
        reflection: {
          questions: [
            'Why do false phi-claims spread so eagerly? What hunger does the myth feed that the fact doesn’t — and can the fact be taught to feed it?',
            'Where in your life is growth distorting shape — and what would “golden” (proportional) growth look like?',
          ],
          exercise: 'Use the Living Page to build the spiral to 8 squares, then find one Fibonacci pair in your kitchen (pineapple, cauliflower, banana). Photograph it. You now own this mathematics.',
        },
        livingPage: 'fibonacci-spiral',
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-3', reason: '“Enough Is a Place” — growth that keeps its proportion.' },
          { bookId: 'consciousness-primer', reason: 'Why brains love patterns — and sometimes love them into existence (apophenia).' },
        ],
      },
      {
        id: 'sg-3',
        title: 'Mandalas — Cosmos in a Circle',
        subtitle: 'Maps for the eye, architecture for meditation',
        sourceLabel: 'Forms of Eternity · Chapter 3 · Original',
        attribution: 'Original Inner Orbit writing. Art-historical claims per cited scholarship.',
        verses: [
          {
            heading: 'What Mandalas Are (Art History)',
            lines: [
              '“Mandala” (Sanskrit: circle, essence, container) names the geometric cosmos-maps of Hindu and Buddhist tradition: concentric squares and circles, gates at four directions, a deity or bindu-point at the centre. Tibetan sand mandalas (notably Kalachakra), Japanese Shingon’s Womb-and-Diamond worlds, and Hindu temple plans (vastupurusha-mandala) are major families — each a cosmology you can walk with your eyes.',
              'Use is practical: monks memorize mandalas over years, visualize themselves entering them, and dissolve them (sand swept away) to embody impermanence. The mandala is simultaneously map, palace, body, and meditation manual.',
            ],
          },
          {
            heading: 'ESTABLISHED FACTS vs. ASSOCIATIONS',
            lines: [
              'FACT: mandalas structure real contemplative training with documented attentional effects (focused-visualization practices show standard meditation benefits). FACT: their geometries encode genuine mathematics (radial symmetry groups, nested proportions).',
              'ASSOCIATION (respectful, distinct): Jung’s reading of mandalas as Self-archetypes emerging spontaneously in patients East and West — clinically suggestive, theoretically debated, therapeutically fruitful. INTERPRETATION (marked): New-Age claims of “mandala healing frequencies” exceed evidence; this Library separates Jung’s careful hypotheses from later inflation.',
            ],
          },
          {
            heading: 'Across Cultures (Comparative, Careful)',
            lines: [
              'Circular cosmos-maps recur: Aztec Sun Stone, Chartres labyrinth, Navajo sandpaintings (created and destroyed in healing rites — parallel, not equivalent, to Tibetan practice), Hildegard’s visions, Islamic girih tilings. Comparison illuminates — each tradition’s mandala answers its own cosmology — and must never flatten: a sandpainting is not “a mandala,” it is Diné healing technology with its own protocols, some restricted. Respect means specificity.',
            ],
          },
        ],
        essence:
          'A mandala is a universe you can hold in your gaze: gates, guardians, and a still centre — walked inward by monks over years and dissolved in an afternoon to teach impermanence. Their power is real (attention, devotion, beauty) and specific (each tradition’s own); honor them by learning their differences, not by melting them into one.',
        deeper: [
          'The centre-and-circumference structure mirrors contemplative phenomenology: distractions at the gates, deities as transformed energies, bindu as nondual awareness. Whether designed from experience or experienced from design, the fit is what makes mandalas work as instruments.',
          'Sand mandala dissolution is philosophy performed: weeks of meticulous beauty swept into a river. Compare Ecclesiastes’ hevel (breath) and the Stoic memento — three traditions staging impermanence, each in its own medium.',
          'Girih tilings (Islamic geometric art) encode quasi-crystalline mathematics centuries before Western discovery (Lu & Steinhardt, 2007) — a reminder that “sacred” and “rigorous” were never opposites.',
        ],
        perspectives: [
          { label: 'Devotional (Tibetan)', text: 'The mandala is the deity’s palace; visualization is invitation, not imagination.' },
          { label: 'Jungian', text: 'Spontaneous mandalas in dreams and psychosis suggest a centre-seeking function of the psyche.' },
          { label: 'Art-historical', text: 'Patronage, pigment, lineage, politics — mandalas as material culture as well as spirit.' },
        ],
        bringToLife: [
          { title: 'Draw one', text: 'Compass, ruler, one hour: a personal mandala of your current life — gates (entries), guardians (protections), centre (what matters). No skill required; attention is the medium.' },
          { title: 'Walk Chartres (or any labyrinth)', text: 'Many cathedrals and parks hold walkable labyrinths — mandalas at foot-scale. One slow circuit teaches more than ten pages.' },
        ],
        reflection: {
          questions: [
            'If your life were a mandala, what stands at the centre right now — and what guards (or blocks) the gates?',
            'What would it mean to build something beautiful for weeks and dissolve it in an afternoon?',
          ],
          exercise: 'Use the Living Page breath-mandala: breathe with the expanding geometry for five minutes, then sketch the after-image. Compare attention before and after.',
        },
        livingPage: 'breath-mandala',
        connections: [
          { bookId: 'dhammapada', chapterId: 'dhp-2', reason: 'Heedfulness as the gate-guardian of the inner mandala.' },
          { bookId: 'consciousness-primer', chapterId: 'cm-2', reason: 'Attention science behind visualization practice.' },
        ],
      },
    ],
  },
  {
    id: 'archetypes-myth',
    title: 'Archetypes & the Mythic Library Within',
    author: 'Inner Orbit · Original Work',
    roomId: 'patterns',
    tradition: 'Inner Orbit Original · Jungian & comparative mythology',
    subjects: ['Archetypes', 'Mythology', 'Psychology'],
    themes: ['archetypes', 'myth', 'symbols', 'hero'],
    status: 'selection',
    pagesEstimate: 'Original · 1 chapter',
    cover: { material: 'leather', base: '#2a1a3a,#5c3a6b', accent: '#e8c476', motif: 'mandala', gem: '#ff9dd0' },
    description:
      'An original introduction to archetypal patterns — Hero, Shadow, Anima/Animus, Trickster, Wise Old One — through Jung, Campbell, and the world’s myths, with careful notes on what is clinical hypothesis, what is literary pattern, and what is speculation.',
    edition: {
      edition: 'Inner Orbit First Edition — opening chapter',
      source: 'Original synthesis of Jung, Campbell, von Franz; critiques (anthropological, feminist) represented.',
      rights: '© Inner Orbit (original work).',
      contentType: 'original',
      completeness: 'Opening chapter complete; Hero, Shadow, and Trickster deep-dives forthcoming.',
    },
    related: [
      { bookId: 'varieties-experience', reason: 'James and Jung: two psychologies of the inner life.' },
      { bookId: 'sacred-geometry-primer', reason: 'Mandala as the Self’s geometric signature.' },
    ],
    chapters: [
      {
        id: 'am-1',
        title: 'The Cast of the Inner Drama',
        subtitle: 'Meeting the archetypes without mystification',
        sourceLabel: 'Archetypes & the Mythic Library · Chapter 1 · Original',
        attribution: 'Original Inner Orbit writing.',
        verses: [
          {
            heading: 'What “Archetype” Means (and Doesn’t)',
            lines: [
              'Jung’s archetypes are not inherited images but inherited predispositions — typical ways the human psyche organizes experience, filled in by culture. The Hero, Shadow, Anima/Animus, Trickster, and Wise Old One recur because human situations recur: departure, darkness, otherness, disruption, guidance.',
              'STATUS CHECK (how to hold this): as clinical hypothesis, archetypal patterns are suggestive and therapeutically useful; as literary pattern (Campbell’s Hero’s Journey, Propp’s folktale functions), they are well-documented; as biology (a “hardwired” collective unconscious), they remain speculative. This chapter uses the middle register: patterns worth knowing, claims held lightly.',
            ],
          },
          {
            heading: 'Five Figures, Briefly',
            lines: [
              'HERO — the ego’s adventure toward competence: departure, trial, return with boon. Your degree, your recovery, your startup: monomyth in modern dress.',
              'SHADOW — everything exiled from the persona: feared, despised, or merely undeveloped. It leaks (projections, slips) until integrated. “No one can fix on me what is ugly” (Marcus) is Shadow-work in Stoic dress.',
              'ANIMA/ANIMUS — the contrasexual interior (Jung’s gendered frame, now widely reworked): the inner other who mediates depth. Read critically, keep the gold: everyone has an exiled interiority.',
              'TRICKSTER — boundary-violator and truth-teller: Hermes, Coyote, Eshu, Loki. Appears in lives as disruption that reveals — the glitch exposing the system.',
              'WISE OLD ONE — the guiding function: Gandalf, Athena-as-mentor, your future self. Often dreamed at thresholds — the psyche offering counsel it already holds.',
            ],
          },
        ],
        essence:
          'Your inner life has a recurring cast — Hero striving, Shadow lurking, Trickster disrupting, Guide whispering. These patterns are lenses, not laws: use them to read your dreams, stories, and stuck places more richly, while remembering they are hypotheses with critics, not doctrines with dogmas.',
        deeper: [
          'Campbell’s Hero’s Journey (1949) fused Jung with comparative myth — inspiring Star Wars and a thousand workshops. Scholars note his selectivity (the myths that don’t fit get less airtime); feminists and postcolonial critics (Murdock, others) have reframed or replaced the journey. Use Campbell as starter-map, not territory.',
          'Shadow-projection explains much ordinary misery: the trait you most despise in others often marks your own exiled material. Integration (owning it) typically deflates both the hatred and the compulsion.',
          'The Trickster deserves special honor in a library: Hermes/Mercury/Thoth/Eshu governs writing, interpretation, and crossroads — every reader’s patron. Expect him in mistranslations, footnotes, and this very chapter’s ironies.',
        ],
        perspectives: [
          { label: 'Jungian', text: 'Archetypes as living psychic realities encountered in dreams, visions, and active imagination.' },
          { label: 'Literary', text: 'Archetypes as narrative technology: patterns that move audiences because they pattern experience.' },
          { label: 'Critical', text: 'Archetypes as overgeneralization: vague enough to fit anything (Barnum risk), gendered in dated ways, in need of updating — which contemporary Jungians actively do.' },
        ],
        bringToLife: [
          { title: 'Cast your week', text: 'Which figure starred? The Hero’s push, the Shadow’s leak, the Trickster’s glitch, the Guide’s whisper? Naming the cast loosens its possession.' },
          { title: 'Meet the Shadow gently', text: 'Name one trait you harshly judge in others. Ask, without self-attack: where does a seed of it live in me — and what might it be protecting?' },
        ],
        reflection: {
          questions: [
            'Which archetype is most active in your life right now? Which is most absent — and is its absence a lack or a peace?',
            'What story (film, myth, memory) is your life currently most like — and what happens next in that story?',
          ],
          exercise: 'Active-imagination letter: let one figure write you a short letter (as the Guide, or from the Shadow). Write fast, edit never, read tomorrow. Note: imaginative exercise, not channeling — the pen is yours throughout.',
        },
        connections: [
          { bookId: 'varieties-experience', chapterId: 'vj-sick', reason: 'The divided self and its unification — James beside Jung.' },
          { bookId: 'bhagavad-gita', chapterId: 'gita-setting', reason: 'Arjuna at the threshold: the Hero refusing — then accepting — the call.' },
        ],
      },
    ],
  },
  {
    id: 'alchemical-symbols',
    title: 'The Alchemical Bestiary — Symbols of Transformation',
    author: 'Inner Orbit · Reference in preparation',
    roomId: 'patterns',
    tradition: 'History of alchemy · Alexandrian to early-modern',
    subjects: ['Alchemy', 'Symbolism', 'History'],
    themes: ['transformation', 'symbols', 'history'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'metal', base: '#2a1a0f,#5c3a1a', accent: '#ffb060', motif: 'alch', gem: '#ff6b4a' },
    description:
      'Ouroboros, green lion, rebis, philosopher’s egg: the great emblems of alchemy read as history (proto-chemistry), psychology (Jung’s reading), and art — with the Hermetica as their ancestral voice.',
    edition: {
      edition: 'In preparation — image rights review (manuscript illuminations) in progress',
      source: 'Public-domain emblem books (Maier, Khunrath, Mutus Liber) under verification.',
      rights: 'Pending verification of specific facsimiles.',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [
      { bookId: 'hermetica', reason: '“As above, so below” — alchemy’s founding axiom.' },
      { bookId: 'sacred-geometry-primer', reason: 'The geometries hiding inside alchemical diagrams.' },
    ],
    chapters: [],
  },
  {
    id: 'symbols-astro-numero',
    title: 'Stars & Numbers — Astrology and Numerology as Symbol Systems',
    author: 'Inner Orbit · Reference in preparation',
    roomId: 'patterns',
    tradition: 'Comparative symbolism · Historical survey',
    subjects: ['Astrology', 'Numerology', 'Symbolism'],
    themes: ['symbols', 'correspondence', 'history'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'stone', base: '#0f1a3a,#2e3d7a', accent: '#c9d4ff', motif: 'star', gem: '#c9d4ff' },
    description:
      'A scholarly, non-predictive survey of astrological and numerological symbolism as cultural systems — what the symbols meant, how they were used, and how modern astronomy and statistics assess their claims. Symbolic literacy, never fortune-telling.',
    edition: {
      edition: 'In preparation',
      source: 'Original survey in preparation.',
      rights: '© Inner Orbit (forthcoming).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'archetypes-myth', reason: 'Planetary gods as archetypal figures.' }],
    chapters: [],
  },
];

```

## src/data/types.ts

```ts
export type RoomId = 'wisdom' | 'becoming' | 'visionary' | 'patterns';
export type BookStatus = 'complete' | 'selection' | 'forthcoming';
export type Atmosphere = 'full' | 'subtle' | 'minimal';
export type LivingPageId =
  | 'tao-water'
  | 'gita-chariot'
  | 'geometry-solids'
  | 'fibonacci-spiral'
  | 'breath-mandala'
  | 'stoic-dichotomy';

export interface VerseBlock { heading?: string; lines: string[]; }

export interface Perspective { label: string; text: string; }
export interface LifeExample { title: string; text: string; }

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  sourceLabel: string;
  attribution: string;
  verses: VerseBlock[];
  essence: string;
  deeper: string[];
  perspectives: Perspective[];
  bringToLife: LifeExample[];
  reflection: { questions: string[]; exercise?: string; journeyHook?: string };
  livingPage?: LivingPageId;
  connections: { bookId: string; chapterId?: string; reason: string }[];
}

export interface CoverSpec {
  material: 'leather' | 'metal' | 'silk' | 'stone' | 'crystal' | 'papyrus';
  base: string;      // css gradient stops base
  accent: string;    // gold etc
  motif: 'tao' | 'gita' | 'dharma' | 'tree' | 'stoic' | 'eye' | 'geometry' | 'mandala' | 'spiral' | 'scroll' | 'flame' | 'lotus' | 'millennial' | 'dream' | 'alch' | 'star';
  gem?: string;
}

export interface EditionInfo {
  translator?: string;
  edition: string;
  source: string;
  rights: string;
  contentType: 'public-domain' | 'original' | 'forthcoming';
  completeness: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  roomId: RoomId;
  tradition: string;
  subjects: string[];
  themes: string[];
  status: BookStatus;
  cover: CoverSpec;
  description: string;
  edition: EditionInfo;
  chapters: Chapter[];
  related: { bookId: string; reason: string }[];
  featured?: boolean;
  pagesEstimate?: string;
}

export interface RoomMeta {
  id: RoomId;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  accent: string;
  glow: string;
  motto: string;
  subjects: string[];
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  page: number;
  label: string;
  created: number;
}

export interface ProgressEntry {
  bookId: string;
  chapterId: string;
  page: number;
  totalPages: number;
  percent: number;
  updated: number;
  chapterTitle: string;
  bookTitle: string;
}

export interface RecentVisit { bookId: string; chapterId?: string; timestamp: number; }

```

## src/data/visionary.ts

```ts
import type { Book } from './types';

export const visionaryBooks: Book[] = [
  {
    id: 'consciousness-primer',
    title: 'The Luminous Mind — A Field Guide to Consciousness',
    author: 'Inner Orbit · Original Work',
    roomId: 'visionary',
    tradition: 'Inner Orbit Original · Science, philosophy & contemplative inquiry',
    subjects: ['Consciousness', 'Perception', 'Psychology'],
    themes: ['awareness', 'perception', 'attention', 'mystery'],
    status: 'selection',
    featured: true,
    pagesEstimate: 'Original · 2 chapters',
    cover: { material: 'crystal', base: '#1a0f3a,#5c2e8a', accent: '#c9b8ff', motif: 'eye', gem: '#7fe0ff' },
    description:
      'An original, carefully sourced introduction to the hardest problem in science: what consciousness is, how perception constructs your world, and what contemplative traditions and laboratories each reveal. Science, philosophy, and spiritual interpretation are clearly distinguished throughout.',
    edition: {
      edition: 'Inner Orbit First Edition — in serial release',
      source: 'Written for the Library from standard sources (peer-reviewed literature, classic texts). Key claims cited in-chapter.',
      rights: '© Inner Orbit (original work).',
      contentType: 'original',
      completeness: 'Two chapters complete; further chapters (attention, dreams, meditation science) in preparation.',
    },
    related: [
      { bookId: 'varieties-experience', reason: 'James’s classic casebook of the experiences this primer frames.' },
      { bookId: 'dhammapada', reason: 'The contemplative science of mind that anticipated much of this research.' },
    ],
    chapters: [
      {
        id: 'cm-1',
        title: 'The Hard Problem & the Controlled Hallucination',
        subtitle: 'Why awareness itself is the mystery',
        sourceLabel: 'The Luminous Mind · Chapter 1 · Original',
        attribution: 'Original Inner Orbit writing. Scientific claims per citations below.',
        verses: [
          {
            heading: 'Two Problems',
            lines: [
              'In 1995 the philosopher David Chalmers drew a line that organized the entire field. The “easy problems” of consciousness — how the brain processes vision, directs attention, controls speech — are hard in practice but straightforward in principle: they ask how functions are performed.',
              'The “hard problem” is different: why is any of it accompanied by subjective experience at all? Why does red look like something, pain hurt like something, Bach sound like something — why isn’t the whole machine running “in the dark”? Explaining functions, Chalmers argued, still leaves the inner light unexplained.',
            ],
          },
          {
            heading: 'Your World Is a Controlled Hallucination',
            lines: [
              'Meanwhile neuroscience delivered a stranger verdict about the world you seem to inhabit directly. Perception is not a window but a construction: the brain generates a predictive model of reality and corrects it with sensory input. As neuroscientist Anil Seth puts it, we all hallucinate — perception is simply hallucination constrained by the senses.',
              'Consider the blind spot: each eye has a hole in its vision where the optic nerve exits, yet you never see holes — the brain paints over them. Consider color: wavelengths carry no hue; your visual cortex invents it. The seamless movie of your life is an edited production, and the editor never takes a credit.',
            ],
          },
          {
            heading: 'What This Means (and Doesn’t)',
            lines: [
              'SCIENTIFIC FINDING: perception is substantially predictive and constructive (well-established; see e.g. predictive-processing literature). PHILOSOPHICAL SPECULATION: what this implies about the ultimate nature of mind — materialist, panpsychist, idealist, mysterian — remains genuinely open, and honest thinkers disagree.',
              'SPIRITUAL INTERPRETATION (clearly marked as such): contemplative traditions heard something like this millennia ago — “life is opinion” (Marcus), “mind the forerunner” (Dhammapada), maya as the constructed veil (Vedanta). The resonance is real and thought-provoking; it is not the same as scientific confirmation, and this Library will never blur the two.',
            ],
          },
        ],
        essence:
          'Your brain doesn’t show you reality — it stages a brilliant, useful simulation of it. And beneath that staging lies the deeper mystery: why there is an experiencer at all. Hold both truths together — the constructed world and the undeniable light of awareness — and you are standing at the threshold every tradition in this room explores.',
        deeper: [
          'Predictive processing (Friston, Clark, Hohwy) is currently the leading framework: the brain as prediction machine minimizing “surprise.” It elegantly explains illusions, dreams (unconstrained prediction), and aspects of psychosis — but critics note it addresses mechanisms of experience, not experience’s existence.',
          'Chalmers’ hard problem has generated major research programs: Global Workspace Theory (Baars, Dehaene), Integrated Information Theory (Tononi), higher-order theories — each with real evidence and real gaps. No consensus exists; beware anyone selling one.',
          'The blind-spot and change-blindness demonstrations are classroom staples because they make construction undeniable in seconds: you literally perceive things (filled-in pattern, stable scene) that are not in the sensory data.',
        ],
        perspectives: [
          { label: 'Materialist', text: 'Experience will ultimately be explained by neural mechanisms; the “hard problem” dissolves with better theory.' },
          { label: 'Mysterian / Dual-aspect', text: 'Experience is irreducible or fundamental (Chalmers, Nagel, Spinoza-influenced views) — science maps its correlates, not its essence.' },
          { label: 'Contemplative', text: 'Direct investigation of awareness itself (meditation, inquiry) is a valid complementary instrument — first-person science with 2,500 years of replication.' },
        ],
        bringToLife: [
          { title: 'The argument replay', text: 'You replay the quarrel as “what happened.” It was your brain’s edited cut. Asking “what did their camera capture?” is predictive-processing as peacemaking.' },
          { title: 'Noticing the editor', text: 'Stare at an illusion (the dress, the spinning dancer) and feel construction happening. That felt wobble is the machinery showing through — wonder, on demand.' },
        ],
        reflection: {
          questions: [
            'If perception is construction, what in your current life might be “painted over blind spot” — assumed rather than seen?',
            'Which stance toward the hard problem attracts you — and what would change it?',
          ],
          exercise: 'The Editor Hunt: find one blind-spot demo online, experience your brain inventing reality, and journal the feeling. Genuine seeing-that-you-don’t-see is the chapter’s whole lesson in ten seconds.',
        },
        connections: [
          { bookId: 'dhammapada', chapterId: 'dhp-1', reason: '“Mind the forerunner” — the 2,300-year-old statement of construction.' },
          { bookId: 'meditations', chapterId: 'med-4', reason: '“Life is opinion” — Stoic predictive processing.' },
        ],
      },
      {
        id: 'cm-2',
        title: 'Attention Is the Potter’s Hand',
        subtitle: 'What you attend to, you become',
        sourceLabel: 'The Luminous Mind · Chapter 2 · Original',
        attribution: 'Original Inner Orbit writing.',
        verses: [
          {
            heading: 'The Spotlight and the Clay',
            lines: [
              'Psychologist William James wrote in 1890 that “my experience is what I agree to attend to” — and that attention sculpts the mind the way a potter shapes clay. Modern neuroscience agrees with embarrassing enthusiasm: attention gates perception, consolidates memory, and through neuroplasticity physically rewires the brain that pays it.',
              'Inattentional blindness (Simons & Chabris’s invisible gorilla) proves the gate: looking straight at something without attending is functionally blind. Memory research proves the consolidation: unattended experience barely encodes. And contemplative neuroscience (Lazar, Davidson, Brewer) shows long-term meditators with measurably altered attention networks — the potter’s hand, visible on brain scans.',
            ],
          },
          {
            heading: 'The Ancient Attention Sciences',
            lines: [
              'Every wisdom tradition in this Library is, among other things, an attention technology. Stoic prosochē (vigilant attention to impressions), Buddhist sati (mindfulness) and samadhi (collectedness), Daoist “abysmal stillness” (Tao Te Ching 8), the Jesus Prayer’s and dhikr’s repetitive gathering — different cosmologies, converging instrument: train attention, transform experience.',
              'This convergence is evidence of a kind — cross-cultural replication across millennia — but note its type: first-person and pragmatic (practitioners report similar fruits), not third-person controlled-trial evidence. The modern mindfulness literature supplies the latter, with appropriate modesty: real benefits for stress, attention, and relapse prevention; real hype exceeding the data; research ongoing.',
            ],
          },
        ],
        essence:
          'Attention is not a spotlight that reveals your world — it is a sculptor that builds it, and rebuilds the brain behind it. Every tradition worth its salt is an attention gym. Train the beam deliberately, or the loudest bidder (outrage, novelty, fear) will aim it for you.',
        deeper: [
          'Key findings, honestly framed: 8-week mindfulness courses (MBSR/MBCT) show moderate effects on stress/anxiety and strong evidence for depression-relapse prevention; brief practices improve focused attention; claims beyond this (compassion transformation, enlightenment-by-app) outrun the data.',
          'Attention’s gate explains the Dhammapada mechanistically: unattended provocations don’t consolidate into grudges; attended breath stabilizes the predictive machine. Ancient instruction, modern mechanism — neither reducible to the other.',
          'The attention economy is applied inattention-science: variable rewards, infinite scroll, and outrage are engineered captures of the potter’s hand. Heedfulness (appamāda) is now a counter-technology.',
        ],
        perspectives: [
          { label: 'Scientific', text: 'Attention training works modestly and measurably; mechanisms increasingly mapped; hype discounted.' },
          { label: 'Contemplative', text: 'Attention is sacred: “where your attention goes, your life goes” — and ultimately, your liberation.' },
          { label: 'Critical', text: 'Mindfulness divorced from ethics becomes calm complicity (“McMindfulness”). The traditions embedded attention in moral training for a reason.' },
        ],
        bringToLife: [
          { title: 'The first-hour rule', text: 'The day’s first attended object sets the clay’s theme. Phone-first shapes one mind; breath-and-intention-first shapes another. Same morning, different potter.' },
          { title: 'Listening as practice', text: 'Full attention on one speaker for five minutes — no rehearsing replies — is samadhi in business casual.' },
        ],
        reflection: {
          questions: [
            'Audit yesterday’s attention: what got the most hours? Did you choose it, or was it captured?',
            'Which attention technology (Stoic, Buddhist, Daoist, other) calls to you — and what is one rep you could do today?',
          ],
          exercise: 'Single-task one routine act daily for a week (tea, commute, dishwashing) with full gathered attention. Log the texture change. This is the laboratory.',
          journeyHook: 'An “Attention Garden” tracker for Your Journey — reps, streaks, and texture notes.',
        },
        livingPage: 'breath-mandala',
        connections: [
          { bookId: 'dhammapada', chapterId: 'dhp-2', reason: 'Heedfulness (appamāda) as the Buddha’s attention doctrine.' },
        ],
      },
    ],
  },
  {
    id: 'varieties-experience',
    title: 'The Varieties of Religious Experience',
    author: 'William James',
    roomId: 'visionary',
    tradition: 'Psychology of religion · Harvard, 1902',
    subjects: ['Psychology', 'Mysticism', 'Philosophy'],
    themes: ['mysticism', 'conversion', 'ineffability', 'pluralism'],
    status: 'selection',
    pagesEstimate: 'Selection · 2 lectures',
    cover: { material: 'leather', base: '#1a2340,#2e3d6b', accent: '#e8c476', motif: 'dream' },
    description:
      'The founding classic of the psychology of religion: James’s Gifford Lectures treating mystical states, conversion, and saintliness as psychological facts worthy of respect. Presented from the 1902 first edition (public domain).',
    edition: {
      edition: 'Longmans, Green & Co., 1902 (first edition)',
      source: 'Public-domain edition; verified against Project Gutenberg transcription.',
      rights: 'Public domain worldwide (author died 1910). Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Selection: Lecture XVI–XVII (Mysticism) abridged; “sick soul” passage. Excerpts clearly marked.',
    },
    related: [
      { bookId: 'consciousness-primer', reason: 'The modern science of the states James catalogued.' },
      { bookId: 'tao-te-ching', reason: 'Ineffability East and West: the Tao that cannot be told.' },
    ],
    chapters: [
      {
        id: 'vj-myst',
        title: 'Mysticism — The Four Marks',
        subtitle: 'Ineffable, noetic, transient, passive',
        sourceLabel: 'Varieties · Lectures XVI–XVII, abridged · 1902',
        attribution: 'William James (1902). Public domain. Light abridgment noted with ellipses.',
        verses: [
          {
            heading: 'The Four Marks',
            lines: [
              '“...I propose to you four marks which, when an experience has them, may justify us in calling it mystical...”',
              '“Ineffability — ...the subject of it immediately says that it defies expression, that no adequate report of its contents can be given in words. It follows from this that its quality must be directly experienced; it cannot be imparted or transferred to others...”',
              '“Noetic quality — ...mystical states seem to those who experience them to be also states of knowledge. They are states of insight into depths of truth unplumbed by the discursive intellect. They are illuminations, revelations, full of significance and importance, all inarticulate though they remain...”',
              '“Transiency — ...mystical states cannot be sustained for long...”',
              '“Passivity — ...the mystic feels as if his own will were in abeyance, and indeed sometimes as if he were grasped and held by a superior power...”',
            ],
          },
          {
            heading: 'Fruits, Not Roots',
            lines: [
              '“...By their fruits ye shall know them, not by their roots... The highest flights of charity, devotion, trust, patience, bravery to which the wings of human nature have spread themselves have been flown for religious ideals.”',
              'James’s pragmatist verdict: judge experiences by the lives they produce — “...if the fruits for life... are good, we ought to idealize and venerate them, even though they be a piece of natural psychology...”',
            ],
          },
        ],
        essence:
          'Mystical experiences share four fingerprints: they cannot be spoken (ineffable), yet feel like knowing (noetic); they pass quickly (transient); and they arrive uncommanded (passive). James’s genius was his test: don’t argue their metaphysics — examine their fruits. Do they make people kinder, braver, more alive? Then honor them, whatever they ultimately are.',
        deeper: [
          'The four marks remain the standard scholarly definition of mysticism (used by Stace, Hood’s Mysticism Scale, and modern psychedelic research) — a 1902 framework still structuring 21st-century laboratories.',
          '“Noetic quality” names mysticism’s central provocation: the experiencer’s certainty of having learned something. Philosophy still wrestles with whether such certainty evidences anything beyond brain states.',
          'James’s “fruits not roots” is pragmatism applied to religion: sidestep unresolvable origin-debates (divine? neural? both?) and evaluate by consequences for character and conduct.',
        ],
        perspectives: [
          { label: 'Psychological', text: 'Mysticism as natural fact: classifiable, measurable, and continuous with ordinary consciousness.' },
          { label: 'Perennialist', text: 'The marks’ cross-cultural recurrence suggests one underlying Reality variously described.' },
          { label: 'Constructivist critique', text: 'Later scholars (Katz) argue experiences are shaped by their traditions — there is no uninterpreted “core.” The debate continues.' },
        ],
        bringToLife: [
          { title: 'Trusting the fruits', text: 'Someone returns from retreat, grief, or wilderness visibly kinder. James says: that transformation is the evidence that matters — honor it without demanding a theory.' },
          { title: 'Your own transiency', text: 'Moments of oceanic peace in music, nature, or love — brief, certain, unspeakable. You have likely tasted all four marks already.' },
        ],
        reflection: {
          questions: [
            'Have you ever known something “all inarticulate” — certain, yet unsayable? Describe the knowing without explaining it.',
            'Apply the fruits-test to your own peak moments: what did they make of you afterward?',
          ],
          exercise: 'Write a 200-word “variety” of your own: one unusual state of consciousness, described with Jamesian neutrality — marks noted, metaphysics suspended, fruits honestly listed.',
        },
        connections: [
          { bookId: 'consciousness-primer', chapterId: 'cm-1', reason: 'What neuroscience now says about the states James described.' },
        ],
      },
      {
        id: 'vj-sick',
        title: 'The Sick Soul & the Divided Self',
        subtitle: 'On melancholy, conversion, and unification',
        sourceLabel: 'Varieties · Lectures VI–IX, abridged · 1902',
        attribution: 'William James (1902). Public domain.',
        verses: [
          {
            heading: 'The Sick Soul',
            lines: [
              '“...the sick soul... finds all things hollow... ‘All is vanity’ — the Hebrew Preacher’s verdict — names the conviction exactly.”',
              '“...Evil is not a surface disorder but an integral part of the universe... The healthy-minded optimism of the hour may paper it over, but the sick soul knows better — and demands a religion that knows it too.” (paraphrase of James’s argument; direct quotes above)',
              'James insists this temperament sees something real: “...the completest religions would... be those in which the pessimistic elements are best developed...” — Buddhism and Christianity foremost, because they take suffering as central rather than accidental.',
            ],
          },
          {
            heading: 'The Divided Self Made Whole',
            lines: [
              '“...There are persons whose existence is little more than a series of zigzags... their spirit wars with their flesh...” — the divided self, which conversion (gradual or sudden) may unify.',
              '“...To be converted... is for a man to pass from one centre of energy to another — the hot place in consciousness shifts, and what was peripheral becomes central...” (abridged)',
              'Whether by crisis or by slow “wilting of the lower desires,” the outcome James honors is the same: a self no longer at war with itself, with energies gathered around a new centre.',
            ],
          },
        ],
        essence:
          'Some souls are “healthy-minded,” skating over evil; others are “sick souls” who feel the world’s wound as their own — and James sides, tenderly, with the wounded: they see deeper, and they need religions deep enough to meet them. Healing, when it comes, is conversion in the broad sense: the hot centre of energy shifts, the divided self unifies, and life reorganizes around what matters most.',
        deeper: [
          'James’s typology (healthy-minded vs. sick soul, once-born vs. twice-born) drew on his own severe depression — the famous “panic fear” passage is autobiographical. The lectures are self-portraiture disguised as psychology.',
          '“The hot place in consciousness” anticipates modern salience and value-based models of the self: identity as whatever the motivational system currently centers. Conversion is re-centering.',
          'James treats sudden conversion (Paul, Edwards’s converts) and gradual “wilting” as one phenomenon at different speeds — a unification of the divided will that psychology (and AA, which James influenced via Jung) still studies.',
        ],
        perspectives: [
          { label: 'Clinical (modern)', text: 'The “sick soul” maps partly onto depression — treatable, medical, and real. James would welcome treatment AND honor the temperament’s insights.' },
          { label: 'Religious', text: 'Twice-born religion (redemption through crisis) vs. once-born (harmony uninterrupted) — a lasting typology of spiritual paths.' },
          { label: 'Existential', text: 'The divided self as universal: everyone zigzags; unification is everyone’s work, religious or not.' },
        ],
        bringToLife: [
          { title: 'Honoring melancholy', text: 'The friend who “can’t just be positive” may be a sick soul seeing truly. James prescribes depth, not cheer — meet them there.' },
          { title: 'Your conversions', text: 'Becoming a parent, surviving illness, leaving a faith or finding one — each shifted your hot centre. Name your re-centerings; they are your varieties.' },
        ],
        reflection: {
          questions: [
            'Are you, by temperament, once-born or twice-born? What evidence does your history offer?',
            'Where is your “hot place” centred now — and is it where you want it?',
            'What would unification look like for your most divided area?',
          ],
          exercise: 'Map your divided self: two columns (“wars with” / “wars against”), then one paragraph on what a new centre might gather. No fixing required — mapping is the medicine.',
        },
        connections: [
          { bookId: 'ecclesiastes', chapterId: 'eccl-1', reason: 'James quotes Qoheleth directly — the sick soul’s scripture.' },
          { bookId: 'meditations', chapterId: 'med-2', reason: 'Morning preparation as daily micro-conversion toward the chosen centre.' },
        ],
      },
    ],
  },
  {
    id: 'sacred-plants-history',
    title: 'Sacred Plants & Human History — An Educational Survey',
    author: 'Inner Orbit · Original Work',
    roomId: 'visionary',
    tradition: 'Inner Orbit Original · History, anthropology & science',
    subjects: ['History', 'Anthropology', 'Neuroscience'],
    themes: ['entheogens', 'ritual', 'research', 'caution'],
    status: 'selection',
    pagesEstimate: 'Original · 1 chapter (educational)',
    cover: { material: 'papyrus', base: '#1e3a24,#3a6b3a', accent: '#ffe9a8', motif: 'lotus' },
    description:
      'A strictly educational, balanced survey of humanity’s historical relationship with entheogenic plants and fungi — archaeology, anthropology, prohibition, and the modern research renaissance. Non-promotional, harm-aware, and clear that this is information, never encouragement or instruction.',
    edition: {
      edition: 'Inner Orbit Educational Survey v1.0',
      source: 'Standard academic sources; no instructions, dosages, or sourcing content of any kind.',
      rights: '© Inner Orbit (original educational work).',
      contentType: 'original',
      completeness: 'One survey chapter complete. Educational scope only.',
    },
    related: [{ bookId: 'varieties-experience', reason: 'James’s mysticism-marks now structure modern psychedelic research.' }],
    chapters: [
      {
        id: 'sp-1',
        title: 'A Responsible History of Sacred Plants',
        subtitle: 'What scholarship knows — and what caution requires',
        sourceLabel: 'Sacred Plants & Human History · Survey Chapter · Original (educational)',
        attribution: 'Original Inner Orbit educational writing. Informational only — not medical, legal, or personal advice.',
        verses: [
          {
            heading: 'Deep History (Archaeological & Anthropological Record)',
            lines: [
              'HISTORICAL ACCOUNT: Human use of psychoactive plants reaches deep into prehistory — from Mesoamerican mushroom imagery to the soma/haoma of Indo-Iranian texts to the kykeon of Eleusis (composition debated; hypotheses only). Indigenous American sacramental traditions (peyote in the Native American Church, ayahuasca in Amazonian lineages) are living religions, not historical curiosities, and deserve the respect — and legal protections — afforded to sincere worship.',
              'What archaeology shows is breadth (many cultures, many plants) and context: these substances overwhelmingly appear inside ritual frames — preparation, guidance, song, community, interpretation — never as isolated chemical events. The frame, scholars stress, was half the pharmacology.',
            ],
          },
          {
            heading: 'Prohibition and the Research Renaissance (20th–21st century)',
            lines: [
              'HISTORICAL ACCOUNT: The mid-20th century saw enthusiastic psychiatric research (over 1,000 papers, tens of thousands of patients) followed by prohibition amid countercultural turbulence (US Controlled Substances Act 1970; global analogues). Research largely halted for decades.',
              'SCIENTIFIC FINDING (current, honestly framed): Since the 2000s, regulated trials at major universities have found that supervised psilocybin-assisted therapy shows significant promise for treatment-resistant depression, end-of-life distress, and addiction — with effects correlated to mystical-type experiences (Griffiths, Carhart-Harris, et al.). MDMA-assisted therapy has advanced through Phase 3 trials for PTSD. Crucially: these are supervised medical protocols with screening, preparation, and integration — results do not transfer to unsupervised use, risks (psychological, cardiac, interactional, legal) are real, and research continues.',
            ],
          },
          {
            heading: 'What This Library Will and Will Not Do',
            lines: [
              'This Library provides history, anthropology, and research literacy — and nothing else. It will never provide instructions for obtaining, preparing, dosing, or using any controlled or psychoactive substance; never encourage use; never minimize risks; and never present spiritual interpretations of such experiences as established fact.',
              'Readers drawn to visionary experience are invited toward the room’s lawful, safe contemplative paths — meditation, dreamwork, art, nature, breath — and toward professional care where suffering is concerned. Wonder is abundant; it does not require pharmacology. If you or someone you love struggles with substance use, please contact local health services or crisis lines.',
            ],
          },
        ],
        essence:
          'Humans have long met psychoactive plants inside sacred ritual frames; the 20th century prohibited them; the 21st is carefully re-studying them in medical settings with promising but preliminary results. This Library teaches that history with respect and rigor — offering understanding, never encouragement, and pointing always toward safe, lawful paths of inner exploration.',
        deeper: [
          'The “set and setting” principle (Leary, refined by Zinberg) is the field’s most robust finding: outcomes depend enormously on mindset, environment, and guidance — which is why ritual frames and clinical protocols, not molecules alone, structure both traditional and modern use.',
          'Legal status varies sharply by jurisdiction and changes over time; nothing here constitutes legal advice. Religious exemptions (e.g., NAC peyote use, ayahuasca decisions in some countries) are narrow, litigated, and specific.',
          'Indigenous reciprocity is an emerging ethical norm: traditions that stewarded these medicines merit respect, benefit-sharing, and protection from appropriation — scholarship increasingly centers indigenous voices over colonial collecting.',
        ],
        perspectives: [
          { label: 'Scientific', text: 'Promising clinical signals under supervision; mechanisms (DMN modulation, plasticity, mystical-type experience) under active study; unsupervised use an entirely different risk profile.' },
          { label: 'Anthropological', text: 'Sacramental use as religion: meaning, community, and cosmology — not “drug use” in the recreational sense.' },
          { label: 'Spiritual (interpretive, marked)', text: 'Some traditions interpret visionary states as genuine perception of deeper reality; others (including many Buddhist lineages) treat them as side-effects to note and release. The Library presents both without endorsing either.' },
        ],
        bringToLife: [
          { title: 'Reading the headlines', text: '“Psychedelics cure depression” overstates trial data; “dangerous drugs with no value” ignores it. The educated stance: supervised promise, real risk, research ongoing.' },
          { title: 'Respecting lineages', text: 'Encountering ayahuasca tourism or “shamanic” branding? Ask who benefits, who is centered, and what reciprocity flows back to source communities.' },
        ],
        reflection: {
          questions: [
            'What drew you to this chapter — curiosity, suffering, wonder? Which lawful path in this Library might serve that need?',
            'How do you distinguish, in your own reading, scientific findings from spiritual interpretations from hype?',
          ],
          exercise: 'Media-literacy practice: find one sensational headline on this topic and rewrite it in this chapter’s three-voice style (finding / history / interpretation). Notice how much changes.',
        },
        connections: [
          { bookId: 'consciousness-primer', chapterId: 'cm-1', reason: 'The neuroscience of constructed perception behind visionary states.' },
          { bookId: 'varieties-experience', chapterId: 'vj-myst', reason: 'James’s four marks — now the standard measure in psychedelic research.' },
        ],
      },
    ],
  },
  {
    id: 'inner-cinema-dreams',
    title: 'The Inner Cinema — Dreams & the Night Mind',
    author: 'Inner Orbit · Original Work (forthcoming)',
    roomId: 'visionary',
    tradition: 'Inner Orbit Original · Psychology & contemplative practice',
    subjects: ['Dreams', 'Psychology', 'Practice'],
    themes: ['dreams', 'sleep', 'symbols'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'crystal', base: '#0f1e3a,#2e4a7a', accent: '#b8d4ff', motif: 'dream', gem: '#b8d4ff' },
    description:
      'Sleep science, dream history (Artemidorus to Aserinsky), lucid-dreaming research, and contemplative dream practices — with dream-journaling tools designed for Your Journey integration.',
    edition: {
      edition: 'In composition',
      source: 'Original work in preparation.',
      rights: '© Inner Orbit (forthcoming).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'consciousness-primer', reason: 'Dreams as the predictive brain, unconstrained.' }],
    chapters: [],
  },
  {
    id: 'doors-reference',
    title: 'The Doors of Perception — A Reader’s Guide (Reference Entry)',
    author: 'About Aldous Huxley (1954) — guide only, no excerpts',
    roomId: 'visionary',
    tradition: 'Reference entry · Modern classic (copyrighted)',
    subjects: ['Reference', 'Consciousness'],
    themes: ['perception', 'reference'],
    status: 'forthcoming',
    pagesEstimate: 'Reference only',
    cover: { material: 'leather', base: '#3a2a0f,#6b5223', accent: '#ffe9a8', motif: 'eye' },
    description:
      'Huxley’s 1954 account of mescaline experience remains under copyright and will never be reproduced here. This forthcoming entry will offer only a lawful reader’s guide: context, themes, and critical perspectives.',
    edition: {
      edition: 'Reference entry in preparation — no copyrighted text will ever appear',
      source: 'Guide only.',
      rights: 'The underlying work is copyrighted; this Library respects that fully.',
      contentType: 'forthcoming',
      completeness: 'Reference entry forthcoming. No excerpts — ever.',
    },
    related: [{ bookId: 'sacred-plants-history', reason: 'The responsible historical frame for Huxley’s era.' }],
    chapters: [],
  },
];

```

## src/data/wisdom.ts

```ts
import type { Book } from './types';

export const wisdomBooks: Book[] = [
  {
    id: 'tao-te-ching',
    title: 'Tao Te Ching',
    author: 'Laozi (attributed)',
    roomId: 'wisdom',
    tradition: 'Daoism · China, c. 4th–3rd century BCE',
    subjects: ['Daoism', 'Philosophy', 'Spirituality'],
    themes: ['simplicity', 'wu-wei', 'humility', 'nature', 'mystery'],
    status: 'selection',
    featured: true,
    pagesEstimate: 'Selection · 4 chapters',
    cover: { material: 'silk', base: '#0f2b26,#1d4a40', accent: '#e8c476', motif: 'tao', gem: '#7fe0c3' },
    description:
      'The quiet, water-like classic of the Tao — eighty-one brief chapters on the Way that cannot be named, power that does not force, and the strength found in softness. Presented here in the landmark 1891 Legge translation (public domain), with Inner Orbit commentary to open each passage.',
    edition: {
      translator: 'James Legge (1815–1897)',
      edition: 'Sacred Books of the East, Vol. 39 (1891)',
      source: 'Public-domain edition; text verified against archive.org scan of the 1891 Oxford edition.',
      rights: 'Public domain worldwide (translator died 1897). Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Curated selection: Chapters 1, 8, 11, 25. Clearly marked excerpts — not the complete work.',
    },
    related: [
      { bookId: 'millennial-tao', reason: 'Our contemporary companion walks through these same ideas in modern language.' },
      { bookId: 'enchiridion', reason: 'Stoic acceptance and Daoist non-forcing rhyme beautifully — and differ in instructive ways.' },
      { bookId: 'sacred-geometry-primer', reason: 'Chapter 11 on emptiness pairs with the geometry of vessels, wheels and space.' },
    ],
    chapters: [
      {
        id: 'ttc-1',
        title: 'Chapter 1 — The Tao That Can Be Told',
        subtitle: 'On the limits of language',
        sourceLabel: 'Tao Te Ching · Chapter 1 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            heading: 'The Unnamed Beginning',
            lines: [
              'The Tao that can be trodden is not the enduring and unchanging Tao.',
              'The name that can be named is not the enduring and unchanging name.',
              '(Conceived of as) having no name, it is the Originator of heaven and earth;',
              '(conceived of as) having a name, it is the Mother of all things.',
            ],
          },
          {
            heading: 'Two Aspects, One Mystery',
            lines: [
              'Always without desire we must be found, if its deep mystery we would sound;',
              'But if desire always within us be, its outer fringe is all that we shall see.',
              'Under these two aspects, it is really the same; but as development takes place, it receives the different names.',
              'Together we call them the Mystery. Where the Mystery is the deepest is the gate of all that is subtle and wonderful.',
            ],
          },
        ],
        essence:
          'Some realities are too alive to be pinned down by words. The Tao — the deep Way things are — can be pointed at, but never captured. This chapter invites you to hold language lightly: use names as tools, then set them down and meet life directly.',
        deeper: [
          'Legge renders the opening with “trodden” and “enduring and unchanging” where modern translators often write “spoken” and “eternal.” The Chinese plays on two senses of both tao (way / to speak) and ming (name / to name) — the text is itself demonstrating the slipperiness it describes.',
          'The “nameless” and the “named” are not two separate worlds. They are two ways of meeting one reality: mystery when we release grasping, and the distinct “ten thousand things” when perception divides the whole into parts.',
          '“Without desire” here does not mean without feeling — it points to a still, non-grasping attention that can perceive depth rather than only surfaces.',
        ],
        perspectives: [
          { label: 'Philosophical', text: 'A statement about the limits of concepts: every definition excludes as much as it includes. The map is not the territory.' },
          { label: 'Meditative', text: 'An instruction: quiet the naming mind and the world reveals a depth that labels conceal.' },
          { label: 'Scholarly', text: 'Likely a later editorial opening placed first to frame the whole collection — the gateway chapter that teaches you how to read everything after it.' },
        ],
        bringToLife: [
          { title: 'The label trap', text: 'You call yourself “not creative” or someone else “difficult” — and then only see evidence for the label. The chapter asks: what happens if you meet the next hour without the story?' },
          { title: 'Awe before analysis', text: 'Standing before the ocean or holding a newborn, explanations fall short — and that shortfall is the point. Some knowing arrives only when naming pauses.' },
        ],
        reflection: {
          questions: [
            'What is one thing in your life you have over-defined — a person, a role, yourself? What might you notice if you set the label down for a day?',
            'When did you last feel wonder that words could not hold? What were you doing, and what made space for it?',
          ],
          exercise: 'For five minutes, sit somewhere ordinary and silently un-name what you see. Not “tree” — notice color, movement, light. Journal what changes in your attention.',
          journeyHook: 'This reflection can later flow into Your Journey as a “Beginner’s Mind” practice streak.',
        },
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-1', reason: 'The Millennial Tao retells this chapter through modern language and digital-age examples.' },
          { bookId: 'varieties-experience', reason: 'James describes mystical states as “ineffable” — the same limit of language, studied psychologically.' },
        ],
      },
      {
        id: 'ttc-8',
        title: 'Chapter 8 — The Excellence of Water',
        subtitle: 'On wu wei and the strength of softness',
        sourceLabel: 'Tao Te Ching · Chapter 8 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            heading: 'Like Water',
            lines: [
              'The highest excellence is like (that of) water.',
              'The excellence of water appears in its benefiting all things, and in its occupying, without striving (to the contrary), the low place which all men dislike.',
              'Hence (its way) is near to (that of) the Tao.',
            ],
          },
          {
            heading: 'Seven Excellences',
            lines: [
              'The excellence of a residence is in (the suitability of) the place;',
              'that of the mind is in abysmal stillness;',
              'that of associations is in their being with the virtuous;',
              'that of government is in its securing good order;',
              'that of (the conduct of) affairs is in its ability;',
              'and that of (the initiation of) any movement is in its timeliness.',
              'And when (one) with the highest excellence does not wrangle (about his low position), no one finds fault with him.',
            ],
          },
        ],
        essence:
          'Water never argues with stone — it simply flows around it, and over time reshapes it. This chapter proposes that yielding is not weakness but a deeper strength: benefit others, take the humble place without resentment, act at the right moment, and meet no resistance because you force nothing.',
        deeper: [
          'This is the classic portrait of wu wei — often translated “non-action,” but better understood as action without unnecessary forcing: responsive, timely, frictionless, like water finding its level.',
          'The “low place which all men dislike” is both literal (water settles downward) and social: humility as strategy and as virtue. The text claims the one who does not contend cannot be contended with.',
          'The list of excellences — place, mind, friendship, governance, skill, timing — shows the Taoist ideal applied across a whole life, from interior stillness to public affairs.',
        ],
        perspectives: [
          { label: 'Ethical', text: 'Humility and service as the highest virtue: greatness that seeks the low place.' },
          { label: 'Strategic', text: 'A theory of influence — softness outlasts hardness; timing outperforms pressure.' },
          { label: 'Ecological (modern)', text: 'Contemporary readers hear an environmental ethic: emulate systems that nourish all things without dominating them.' },
        ],
        bringToLife: [
          { title: 'The difficult colleague', text: 'Instead of pushing your approach in a meeting, ask what they need and shape your proposal around it. You may find the “low place” of listening gets your idea adopted faster than argument.' },
          { title: 'Creative blocks', text: 'Forcing output often tightens the block. Stepping away, taking a walk, letting the mind settle like water — the solution frequently surfaces on its own.' },
        ],
        reflection: {
          questions: [
            'Where in your life are you currently pushing against stone? What would the water-version of your next move look like?',
            'What does “timeliness” mean for one decision you are facing — what would acting too early, or too late, cost?',
          ],
          exercise: 'Choose one friction point this week. Deliberately take the “low place” once — listen first, yield on something small — and note what happens to the resistance.',
          journeyHook: 'A candidate “Flow, don’t force” weekly experiment for Your Journey.',
        },
        livingPage: 'tao-water',
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-2', reason: 'Explores wu wei through work deadlines, traffic, and creative flow.' },
          { bookId: 'meditations', reason: 'Marcus Aurelius likewise counsels yielding to the nature of things — compare Stoic acceptance with Daoist flow.' },
        ],
      },
      {
        id: 'ttc-11',
        title: 'Chapter 11 — The Usefulness of Emptiness',
        subtitle: 'On what is not there',
        sourceLabel: 'Tao Te Ching · Chapter 11 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            lines: [
              'The thirty spokes unite in the one nave; but it is on the empty space (for the axle), that the use of the wheel depends.',
              'Clay is fashioned into vessels; but it is on their empty hollowness, that their use depends.',
              'The door and windows are cut out (from the walls) to form an apartment; but it is on the empty space (within), that its use depends.',
              'Therefore, what has a (positive) existence serves for profitable adaptation, and what has not that for (actual) usefulness.',
            ],
          },
        ],
        essence:
          'We notice the walls, the spokes, the clay — but a room is useful because of its empty middle. This chapter turns your attention to the overlooked half of everything: the silence that makes music possible, the pause that makes conversation work, the space that makes a life livable.',
        deeper: [
          'The wheel, the vessel, and the room are three images of the same principle: being (you) provides structure; non-being (wu) provides function. Neither alone is enough.',
          'This is among the earliest philosophical celebrations of emptiness — centuries before Buddhist emptiness (śūnyatā) teachings arrived in China, though later Chinese Buddhism and Daoism would illuminate each other on this theme.',
          'Note the practicality: this is not abstract mysticism but design wisdom. The sage-architect builds around the void.',
        ],
        perspectives: [
          { label: 'Design', text: 'A principle every architect and musician knows: form serves the space it shapes.' },
          { label: 'Psychological', text: 'Rest, unscheduled time, and mental quiet are not the absence of life — they are what make a full life usable.' },
          { label: 'Metaphysical', text: 'Non-being is not nothingness; it is potential — the uncarved openness from which usefulness emerges.' },
        ],
        bringToLife: [
          { title: 'Your calendar', text: 'A day packed edge-to-edge is a room with no space to move. Protecting one empty hour may be the most “useful” thing you schedule.' },
          { title: 'Listening', text: 'In conversation, the pause after someone speaks — the empty nave — is where understanding actually turns.' },
        ],
        reflection: {
          questions: [
            'What is the “empty nave” in your own life right now — the space that everything else turns around? Is it protected or crowded?',
            'What could you remove — not add — that would make something you care about more useful?',
          ],
          exercise: 'Empty one thing: a drawer, an hour, a shelf. Notice how the remaining contents gain clarity. This is Chapter 11 as housekeeping.',
          journeyHook: 'Could become a “Sacred Emptiness” decluttering ritual in Your Journey.',
        },
        connections: [
          { bookId: 'sacred-geometry-primer', chapterId: 'sg-1', reason: 'Explore how vessels and wheels embody this principle geometrically.' },
          { bookId: 'dhammapada', reason: 'Buddhist verses on the mind’s stillness echo the praise of inner space.' },
        ],
      },
      {
        id: 'ttc-25',
        title: 'Chapter 25 — The Great Tao',
        subtitle: 'On vastness and belonging',
        sourceLabel: 'Tao Te Ching · Chapter 25 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            heading: 'Before Heaven and Earth',
            lines: [
              'There was something undefined and complete, coming into existence before Heaven and Earth.',
              'How still it was and formless, standing alone, and undergoing no change, reaching everywhere and in no danger (of being exhausted)!',
              'It may be regarded as the Mother of all things.',
              'I do not know its name, and I give it the designation of the Tao (the Way or Course). Making an effort (further) to give it a name I call it The Great.',
            ],
          },
          {
            heading: 'The Four Greats',
            lines: [
              'Great, it passes on (in constant flow). Passing on, it becomes remote. Having become remote, it returns.',
              'Therefore the Tao is great; Heaven is great; Earth is great; and the (sage) king is also great.',
              'In the universe there are four that are great, and the (sage) king is one of them.',
              'Man takes his law from the Earth; the Earth takes its law from Heaven; Heaven takes its law from the Tao. The law of the Tao is its being what it is.',
            ],
          },
        ],
        essence:
          'Before everything there was a vast, silent completeness — and it is still here, flowing through everything, returning to itself. You belong to that vastness: humanity nested in Earth, Earth in Heaven, all of it in the Tao, which simply is what it is. Belonging, not control, is the deepest truth.',
        deeper: [
          'The final line — the Tao’s law is “its being what it is” (ziran, “self-so”) — is one of Daoism’s key terms: spontaneity, naturalness, things being so of themselves without imposed command.',
          'The “four greats” place humanity inside a nested cosmos rather than above it — a profoundly ecological vision from over two thousand years ago.',
          'Legge’s “(sage) king” reflects the text’s original audience of rulers; modern readers often read it as the mature human being — one who governs a life, a household, or a community in accord with the pattern.',
        ],
        perspectives: [
          { label: 'Cosmological', text: 'A creation account without a creator: the ultimate is not a maker but a mothering field — undefined, complete, self-so.' },
          { label: 'Political', text: 'Advice to rulers: govern as Heaven governs — by allowing, not by forcing. Legitimacy flows from alignment with the pattern.' },
          { label: 'Contemplative', text: 'An invitation to feel your scale: small enough to be humble, connected enough to be at home in the vast.' },
        ],
        bringToLife: [
          { title: 'Under the stars', text: 'The vertigo you feel looking up on a clear night is Chapter 25 arriving unannounced — smallness that feels like belonging rather than insignificance.' },
          { title: 'Letting systems work', text: 'A good manager, parent, or gardener sets conditions and steps back — taking law “from the Tao” by trusting self-so unfolding.' },
        ],
        reflection: {
          questions: [
            'Where do you feel most “nested” — most clearly part of something larger that holds you?',
            'What in your life is trying to unfold “self-so” that you keep interrupting with control?',
          ],
          exercise: 'Go outside tonight and look up for three full minutes. Then complete the sentence: “I am part of ___.” Write whatever comes, without editing.',
          journeyHook: 'A “Night Sky Belonging” ritual for Your Journey’s wonder practices.',
        },
        connections: [
          { bookId: 'consciousness-primer', reason: 'Modern cosmology and consciousness studies revisit the same nested vastness scientifically.' },
          { bookId: 'ecclesiastes', reason: '“He hath set the world in their heart” — compare Hebrew wisdom on eternity and scale.' },
        ],
      },
    ],
  },
  {
    id: 'bhagavad-gita',
    title: 'Bhagavad Gita',
    author: 'Tradition attributes to Vyasa',
    roomId: 'wisdom',
    tradition: 'Hinduism · Sanskrit, c. 2nd century BCE – 2nd century CE',
    subjects: ['Hinduism', 'Philosophy', 'Ethics'],
    themes: ['duty', 'detachment', 'action', 'self', 'devotion'],
    status: 'selection',
    featured: true,
    pagesEstimate: 'Selection · 2 chapters',
    cover: { material: 'metal', base: '#3a1503,#7a2e0e', accent: '#f7dd9a', motif: 'gita', gem: '#ff9d45' },
    description:
      'The Song of God — Krishna’s counsel to the warrior Arjuna on the field of Kurukshetra: act with all your heart while releasing grasping for results. Presented in Sir Edwin Arnold’s beloved 1885 verse rendering, The Song Celestial (public domain).',
    edition: {
      translator: 'Sir Edwin Arnold (1832–1904), “The Song Celestial”',
      edition: 'London: Trübner & Co., 1885',
      source: 'Public-domain edition; verified against Project Gutenberg transcription of the 1885 text.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Curated selection from Chapter 2, with scene-setting from Chapter 1. Excerpts clearly marked.',
    },
    related: [
      { bookId: 'dhammapada', reason: 'Two Indian visions of the disciplined mind — compare Krishna’s “yoga” with the Buddha’s “training.”' },
      { bookId: 'meditations', reason: 'Detached action in the Gita and Stoic acceptance of outcomes illuminate each other.' },
      { bookId: 'tao-te-ching', reason: 'Effort without forcing: wu wei beside nishkama karma.' },
    ],
    chapters: [
      {
        id: 'gita-setting',
        title: 'The Field — Arjuna’s Despair',
        subtitle: 'Why the teaching was needed',
        sourceLabel: 'Bhagavad Gita · Scene-setting after Chapter 1 · Arnold (1885)',
        attribution: 'Paraphrased scene-setting by Inner Orbit; verses from Arnold’s public-domain rendering.',
        verses: [
          {
            heading: 'Between Two Armies',
            lines: [
              'On the field of Kurukshetra, Prince Arjuna asks his charioteer Krishna to drive him between the two armies.',
              'There he sees arrayed against him his own teachers, kinsmen, and friends — and his great bow Gandiva slips from his hand.',
              '“I will not fight,” he says, and sinks into the chariot, overwhelmed by grief.',
            ],
          },
          {
            heading: 'From Arnold’s Song Celestial',
            lines: [
              '“Arjuna, whose heart was troubled with pity, gazed upon the armies set in battle array —”',
              '“— and sorrow came upon him as he beheld his kin standing before him, eager for war.”',
              'It is to this despair — not to triumph — that the teaching of the Gita is given.',
            ],
          },
        ],
        essence:
          'The Gita’s wisdom is spoken to someone who has collapsed — not to a hero at his best. Arjuna’s despair is the doorway: grief, moral horror, and paralysis are treated not as failures but as the honest starting point of the spiritual search.',
        deeper: [
          'Kurukshetra is both a literal battlefield in the Mahabharata epic and, for many interpreters, the inner field of every life — the place where duty, love, and conscience collide.',
          'Krishna begins not with comfort but with philosophy: the nature of the self, of death, and of action. The Gita takes despair seriously enough to answer it with metaphysics.',
          'The chariot itself became a celebrated image in Indian thought: the body as chariot, the senses as horses, the mind as reins, the intellect as driver — and the true Self as the passenger who must be remembered.',
        ],
        perspectives: [
          { label: 'Devotional', text: 'The scene reveals grace: the Divine appears as a friend and servant — a charioteer — to one who has surrendered.' },
          { label: 'Ethical', text: 'Arjuna’s refusal to fight raises the problem of just war and duty; the Gita’s answer has been debated for two millennia and must be read with care.' },
          { label: 'Psychological (modern)', text: 'A portrait of moral injury and collapse — and of counsel that dignifies the sufferer by taking his questions seriously.' },
        ],
        bringToLife: [
          { title: 'The frozen moment', text: 'A diagnosis, a layoff, a family crisis — life drives you between two armies and the bow slips from your hand. The Gita says: this is precisely when wisdom begins.' },
          { title: 'Asking for counsel', text: 'Arjuna turns to his charioteer — the help already beside him. Who is already in your chariot that you have not yet asked?' },
        ],
        reflection: {
          questions: [
            'What is your Kurukshetra right now — the field where competing loyalties meet?',
            'Arjuna’s despair was honored with a teaching, not dismissed. What despair of yours deserves that dignity?',
          ],
          exercise: 'Name your “two armies” on paper — what pulls you each way. Then write what you would ask Krishna if the chariot stopped today.',
        },
        livingPage: 'gita-chariot',
        connections: [
          { bookId: 'tao-te-ching', chapterId: 'ttc-1', reason: 'Two gateways: despair (Gita) and unknowing (Tao) as entrances to wisdom.' },
        ],
      },
      {
        id: 'gita-2',
        title: 'Chapter 2 — The Yoga of Knowledge',
        subtitle: 'The imperishable Self and selfless action',
        sourceLabel: 'Bhagavad Gita · Chapter 2 (selections) · Arnold (1885)',
        attribution: 'Sir Edwin Arnold, The Song Celestial. Public domain.',
        verses: [
          {
            heading: 'The Spirit Was Never Born',
            lines: [
              '“Never the spirit was born; the spirit shall cease to be never;',
              'Never was time it was not; End and Beginning are dreams!',
              'Birthless and deathless and changeless remaineth the spirit for ever;',
              'Death hath not touched it at all, dead though the house of it seems!”',
            ],
          },
          {
            heading: 'Act, but Relinquish the Fruits',
            lines: [
              '“Set thy heart upon thy work, but never on its reward.”',
              '“Work not for a reward; but never cease to do thy work.”',
              '“Perform thy duty with a mind even and undisturbed — abandoning attachment to success or failure. Such equanimity is called yoga.”',
            ],
          },
          {
            heading: 'The Mind at Rest',
            lines: [
              '“As a lamp in a windless place does not flicker — this is the likeness of the yogi whose mind is mastered.”',
              '“When the mind rests, disciplined by practice, and turns from all desires toward the Self — then one is called steadfast.”',
            ],
          },
        ],
        essence:
          'You are not the house; you are the dweller. The body changes and ends, but the witnessing Self endures — so grief for the eternal is misplaced. From that steadiness comes the Gita’s great ethic: pour yourself fully into right action, and release your grip on how it turns out. Equanimity is yoga.',
        deeper: [
          'The “house” image renders the Gita’s distinction between deha (body) and atman (Self). Krishna’s argument moves from metaphysics (what you are) to ethics (how therefore to act) — knowledge first, then duty.',
          '“Never on its reward” (nishkama karma, desireless action) does not mean careless action. It means full excellence of means with surrendered attachment to ends — doing the work because it is yours to do.',
          'The windless lamp is among India’s most beloved meditation images, echoed across Hindu, Buddhist, and Jain contemplative literature.',
        ],
        perspectives: [
          { label: 'Vedantic', text: 'The Self (atman) is ultimately one with ultimate reality (Brahman) — the ground of fearlessness.' },
          { label: 'Practical-ethical', text: 'A psychology of performance: attachment to outcomes degrades both peace and effectiveness; focus on process liberates both.' },
          { label: 'Devotional', text: 'Later chapters reframe this surrender as love — action offered to Krishna. Chapter 2 plants the seed that bhakti will flower.' },
        ],
        bringToLife: [
          { title: 'The exam, the launch, the audition', text: 'Prepare with total devotion; then walk in having released the result. Paradoxically, this often improves performance — the hand steadies when the grasping stops.' },
          { title: 'Caregiving', text: 'You cannot control the outcome of another’s illness — only the quality of your presence. The Gita dignifies that presence as complete in itself.' },
        ],
        reflection: {
          questions: [
            'What “fruit” are you gripping most tightly right now? What would full effort with open hands look like?',
            'When has your mind been a “lamp in a windless place”? What stilled the wind?',
          ],
          exercise: 'Choose one task today. Before beginning, silently dedicate the effort and release the outcome. Afterwards, note any change in quality of attention.',
          journeyHook: 'An “Offered Action” daily practice for Your Journey.',
        },
        livingPage: 'gita-chariot',
        connections: [
          { bookId: 'enchiridion', reason: '“Do your work; the outcome is not yours” — Epictetus and Krishna in striking parallel.' },
          { bookId: 'meditations', reason: 'Marcus on acting for the common good without demanding recognition.' },
        ],
      },
    ],
  },
  {
    id: 'dhammapada',
    title: 'The Dhammapada',
    author: 'The Buddha (compiled sayings)',
    roomId: 'wisdom',
    tradition: 'Buddhism · Pali Canon, c. 3rd century BCE',
    subjects: ['Buddhism', 'Ethics', 'Mind'],
    themes: ['mindfulness', 'compassion', 'mind', 'discipline'],
    status: 'selection',
    pagesEstimate: 'Selection · 2 chapters',
    cover: { material: 'papyrus', base: '#4a2c10,#8a5a1c', accent: '#f7dd9a', motif: 'dharma' },
    description:
      'The beloved “Path of Dhamma” — 423 verses on the mind as the forerunner of all things, gathered from the Buddha’s sayings. Presented in F. Max Müller’s 1881 translation for the Sacred Books of the East (public domain).',
    edition: {
      translator: 'F. Max Müller (1823–1900)',
      edition: 'Sacred Books of the East, Vol. 10 (1881)',
      source: 'Public-domain edition; verified against archive.org scan.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Selection: opening verses of Ch. 1 (Twin Verses) and Ch. 2 (Heedfulness). Excerpts clearly marked.',
    },
    related: [
      { bookId: 'bhagavad-gita', reason: 'Two trainings of mind — Buddhist heedfulness beside yogic steadiness.' },
      { bookId: 'enchiridion', reason: 'Guarding the mind: the Buddha and Epictetus on where suffering truly begins.' },
    ],
    chapters: [
      {
        id: 'dhp-1',
        title: 'The Twin Verses — Mind the Forerunner',
        subtitle: 'All that we are arises with our thoughts',
        sourceLabel: 'Dhammapada · Chapter 1, verses 1–2, 5 · Müller (1881)',
        attribution: 'Translated by F. Max Müller. Public domain.',
        verses: [
          {
            lines: [
              'All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts.',
              'If a man speaks or acts with an evil thought, pain follows him, as the wheel follows the foot of the ox that draws the carriage.',
              'All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts.',
              'If a man speaks or acts with a pure thought, happiness follows him, like a shadow that never leaves him.',
            ],
          },
          {
            heading: 'Hatred Ceases by Love',
            lines: [
              'For hatred does not cease by hatred at any time: hatred ceases by love — this is an eternal law.',
            ],
          },
        ],
        essence:
          'Your mind is not a mirror of the world — it is the forerunner, the architect. Speak and act from ill will and suffering trails you like a cart-wheel; speak and act from clarity and joy follows like your own shadow. And hatred, the Buddha insists, has never once been ended by more hatred.',
        deeper: [
          '“Evil thought” and “pure thought” render manas charged with ill will versus with clarity — the emphasis is on intention (cetanā), which in Buddhist ethics is the very heart of karma.',
          'The wheel-and-shadow images are deliberately physical: consequences are not punishments imposed from outside but the natural trailing of causes — a law as reliable as shadow.',
          'Verse 5 (“hatred ceases by love”) is among the most quoted lines in Buddhist literature, paralleled in Jain and Hindu texts and echoed in Gandhi’s satyagraha.',
        ],
        perspectives: [
          { label: 'Ethical', text: 'Responsibility begins upstream: guard the intention and the act takes care of itself.' },
          { label: 'Psychological (modern)', text: 'Cognitive science confirms the direction: appraisal shapes emotion. The Dhammapada stated it 2,300 years early.' },
          { label: 'Contemplative', text: 'Meditation is the laboratory where you watch thoughts become worlds — and learn to choose.' },
        ],
        bringToLife: [
          { title: 'The morning thought', text: 'The first story you tell yourself about the day — dread or willingness — quietly architects the hours. The Twin Verses ask you to author it deliberately.' },
          { title: 'Ending a feud', text: 'One more sharp reply has never ended a quarrel. The “eternal law” suggests the only exit: the cycle breaks where love enters.' },
        ],
        reflection: {
          questions: [
            'What thought have you been rehearsing most this week — and what world is it building?',
            'Where is hatred (even mild: resentment, coldness) being met with more of itself? What would love’s version cost?',
          ],
          exercise: 'Set three chimes through the day. At each, note the current thought’s “flavor” — contracting or opening — in one word. Watch the pattern by evening.',
        },
        connections: [
          { bookId: 'meditations', chapterId: 'med-4', reason: '“The soul is dyed the color of its thoughts” — Marcus and the Buddha agree.' },
        ],
      },
      {
        id: 'dhp-2',
        title: 'Heedfulness — The Path to the Deathless',
        subtitle: 'Earnestness among the heedless',
        sourceLabel: 'Dhammapada · Chapter 2, verses 21–26 (selection) · Müller (1881)',
        attribution: 'Translated by F. Max Müller. Public domain.',
        verses: [
          {
            lines: [
              'Earnestness is the path of immortality (Nirvana), thoughtlessness the path of death.',
              'Those who are in earnest do not die, those who are thoughtless are as if dead already.',
              'The wise who understand this, who are earnest and delight in earnestness, rejoice in the knowledge of the elect.',
              'Rousing oneself, earnest, restrained, and controlled — the self-possessed make for themselves an island which no flood can overwhelm.',
            ],
          },
        ],
        essence:
          'Heedfulness — awake, careful, earnest attention — is the whole path in one word. The “thoughtless” sleepwalk through their own lives; the earnest build, moment by moment, an inner island no flood of circumstance can overwhelm.',
        deeper: [
          '“Earnestness” renders appamāda — heedfulness, diligence, non-negligence — the quality the Buddha called, on his deathbed, the single teaching to remember: “all conditioned things are impermanent; strive on with heedfulness.”',
          'The island (dīpa) that “no flood can overwhelm” is both refuge and self-reliance: the Dhamma as shelter you build by practice, not a rescue you await.',
          'This chapter pairs naturally with Stoic prosochē (attention) — two traditions discovering that freedom is a function of vigilance.',
        ],
        perspectives: [
          { label: 'Monastic', text: 'The ancient commentary reads this as meditation instruction: guard the sense-doors, moment after moment.' },
          { label: 'Lay', text: 'For householders: earnestness means keeping promises, handling money mindfully, speaking carefully — the ordinary as path.' },
          { label: 'Modern', text: 'Attention is the scarcest resource of the digital age; heedfulness is its ancient name and antidote.' },
        ],
        bringToLife: [
          { title: 'The phone flood', text: 'Each unconscious scroll is a small thoughtlessness. One deliberate pause — “what am I here for?” — is the island being built.' },
          { title: 'Keeping one promise', text: 'Choose the smallest promise you keep breaking to yourself. Keeping it today is earnestness in its purest form.' },
        ],
        reflection: {
          questions: [
            'What does your “flood” look like — the overwhelm that keeps arriving? What would one stone of the island be?',
            'Where are you “as if dead already” — moving through something awake people would savor?',
          ],
          exercise: 'Take one routine act — drinking tea, walking stairs — and do it in full earnestness, senses open. That is the whole chapter in three minutes.',
        },
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-2', reason: 'Heedfulness and wu wei: full attention, zero forcing.' },
        ],
      },
    ],
  },
  {
    id: 'ecclesiastes',
    title: 'Ecclesiastes — Wisdom of the Teacher',
    author: 'Qoheleth, “the Teacher” (traditionally Solomon)',
    roomId: 'wisdom',
    tradition: 'Hebrew Bible · c. 3rd century BCE',
    subjects: ['Biblical Wisdom', 'Philosophy', 'Meaning'],
    themes: ['meaning', 'time', 'impermanence', 'joy'],
    status: 'selection',
    pagesEstimate: 'Selection · 2 readings',
    cover: { material: 'leather', base: '#1c1a3a,#3a2d5c', accent: '#e8c476', motif: 'scroll' },
    description:
      'The Bible’s strangest wisdom book — a philosopher-king’s brutally honest meditation on vanity, time, death, and the quiet goodness of ordinary joys. Presented in the King James Version (public domain).',
    edition: {
      edition: 'King James Version (1611)',
      source: 'Public-domain text; spelling lightly modernized where noted.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Selection: Ch. 1:2–11 and Ch. 3:1–15 (abridged). Excerpts clearly marked.',
    },
    related: [
      { bookId: 'meditations', reason: 'Two families of impermanence-wisdom: Hebrew and Stoic.' },
      { bookId: 'tao-te-ching', reason: 'Time, return, and the pattern that outlasts striving.' },
    ],
    chapters: [
      {
        id: 'eccl-1',
        title: 'Vanity of Vanities',
        subtitle: 'All is breath',
        sourceLabel: 'Ecclesiastes 1:2–11 · King James Version',
        attribution: 'King James Version (1611). Public domain.',
        verses: [
          {
            lines: [
              'Vanity of vanities, saith the Preacher, vanity of vanities; all is vanity.',
              'What profit hath a man of all his labour which he taketh under the sun?',
              'One generation passeth away, and another generation cometh: but the earth abideth for ever.',
              'The sun also ariseth, and the sun goeth down, and hasteth to his place where he arose.',
              'All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.',
              'All things are full of labour; man cannot utter it: the eye is not satisfied with seeing, nor the ear filled with hearing.',
            ],
          },
        ],
        essence:
          '“Vanity” translates hevel — breath, vapor, mist. The Teacher’s claim: everything grasped “under the sun” dissolves like breath on cold air. Generations turn, rivers return, eyes stay hungry. This is not despair but clearing — the smoke must be named before anything solid can be found.',
        deeper: [
          'Hevel appears 38 times in the book — its drumbeat. Scholars debate whether it means futile, fleeting, absurd, or enigmatic; likely it carries all four at once.',
          '“Under the sun” is the book’s laboratory frame: life considered without reference to eternity. The experiment’s result — hunger without satisfaction — prepares the turn toward joy and reverence in later chapters.',
          'The river-and-sea image quietly parallels Taoist water wisdom and Stoic cycles — three traditions watching the same circulation of nature.',
        ],
        perspectives: [
          { label: 'Traditional Jewish/Christian', text: 'A controlled demolition of idolatry: only what transcends “the sun” can satisfy.' },
          { label: 'Existential', text: 'A biblical Camus: lucidity about absurdity as the precondition for authentic joy.' },
          { label: 'Skeptical', text: 'Some scholars hear a genuine doubter preserved inside the canon — faith honest enough to include its own questions.' },
        ],
        bringToLife: [
          { title: 'Arrival fallacy', text: 'The promotion, the purchase, the milestone — each promised fullness; each delivered mist. Qoheleth would nod: the eye was never going to be satisfied with seeing.' },
          { title: 'News cycles', text: '“There is no new thing under the sun” reads like commentary on outrage media — the same river, returning.' },
        ],
        reflection: {
          questions: [
            'What “vanity” have you been chasing — what vapor did you expect to hold?',
            'If all striving is breath, what remains that is not striving? Name one thing.',
          ],
          exercise: 'List three labors. For each, ask: “What profit?” — not to quit them, but to see which are breath and which are bread.',
        },
        connections: [
          { bookId: 'tao-te-ching', chapterId: 'ttc-25', reason: 'Circulation and return: rivers, sun, and the Tao that “returns.”' },
        ],
      },
      {
        id: 'eccl-3',
        title: 'To Every Thing a Season',
        subtitle: 'The poem of time',
        sourceLabel: 'Ecclesiastes 3:1–15 (abridged) · King James Version',
        attribution: 'King James Version (1611). Public domain.',
        verses: [
          {
            lines: [
              'To every thing there is a season, and a time to every purpose under the heaven:',
              'A time to be born, and a time to die; a time to plant, and a time to pluck up that which is planted;',
              'A time to kill, and a time to heal; a time to break down, and a time to build up;',
              'A time to weep, and a time to laugh; a time to mourn, and a time to dance;',
              'A time to cast away stones, and a time to gather stones together; a time to embrace, and a time to refrain from embracing;',
              'He hath made every thing beautiful in his time: also he hath set the world in their heart, so that no man can find out the work that God maketh from the beginning to the end.',
            ],
          },
        ],
        essence:
          'Everything has its season — grief and gladness both appointed, both passing. The poem’s comfort is rhythmic: your winter is not failure but timing. And the ache you feel inside time — eternity “set in the heart” — is itself the signature of something larger than the seasons.',
        deeper: [
          'The fourteen pairs (birth/death through war/peace) form a merism — opposites naming the whole of human experience. Nothing in your life falls outside the poem.',
          '“Beautiful in his time” is the book’s quiet theodicy: not that all is pleasant, but that each season has its fitting place in a pattern too large to see from inside.',
          '“The world in their heart” (ha-‘olam) is famously difficult Hebrew — eternity, the universe, the hidden age. Every major translation reveals its theology in this single phrase.',
        ],
        perspectives: [
          { label: 'Pastoral', text: 'Grief permitted: mourning has a season, which means it is holy — and also that dancing returns.' },
          { label: 'Wisdom', text: 'Discernment as the supreme skill: not mastering events but reading their season rightly.' },
          { label: 'Mystical', text: 'The eternity in the heart is the part of you that time cannot touch — the reader of the seasons, not only their subject.' },
        ],
        bringToLife: [
          { title: 'Naming your season', text: 'Planting or plucking? Embracing or refraining? Much suffering is season-confusion — demanding harvest in planting time.' },
          { title: 'Goodbyes', text: 'Graduations, moves, endings — the poem gives them liturgy: this, too, has its time, and its time is now.' },
        ],
        reflection: {
          questions: [
            'Which line of the poem names your current season most precisely?',
            'What would it mean to let this season be “beautiful in its time” instead of rushing the next?',
          ],
          exercise: 'Copy the poem’s first line and write your own pair: “A time to ___, and a time to ___.” Fill it with this year’s truth.',
        },
        connections: [
          { bookId: 'meditations', chapterId: 'med-4', reason: 'Marcus on the seasons of the soul and the whole.' },
        ],
      },
    ],
  },
  {
    id: 'upanishads',
    title: 'The Upanishads — Songs of the Self',
    author: 'Vedic sages (traditional)',
    roomId: 'wisdom',
    tradition: 'Hinduism · c. 8th–4th century BCE',
    subjects: ['Hinduism', 'Metaphysics'],
    themes: ['self', 'unity', 'meditation'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'metal', base: '#2a1a4a,#5c3a8a', accent: '#f7dd9a', motif: 'flame', gem: '#b79bff' },
    description:
      'The forest teachings on atman and Brahman — “Thou art That.” A verified public-domain selection (Müller, 1879–84) is being prepared with full Essence layers.',
    edition: {
      translator: 'F. Max Müller (forthcoming verification)',
      edition: 'Sacred Books of the East, Vols. 1 & 15 — in preparation',
      source: 'To be verified against archive.org scans before release.',
      rights: 'Public domain (pending verification).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet. This entry honestly awaits preparation.',
    },
    related: [{ bookId: 'bhagavad-gita', reason: 'The Gita is often called the “cream of the Upanishads.”' }],
    chapters: [],
  },
  {
    id: 'sufi-garden',
    title: 'The Garden of the Sufis',
    author: 'Rumi · Hafez · Attar (anthology, forthcoming)',
    roomId: 'wisdom',
    tradition: 'Sufism · Persianate world, 12th–14th century',
    subjects: ['Sufism', 'Poetry', 'Mysticism'],
    themes: ['love', 'longing', 'union'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'silk', base: '#3a0f2e,#7a1e54', accent: '#ffd9a0', motif: 'lotus', gem: '#ff7fb0' },
    description:
      'Wine of longing, reed-flute of separation: the love-mysticism of Rumi, Hafez, and Attar. Only verified public-domain renderings (Nicholson, Arberry’s early work where PD) will be used — modern copyrighted translations will never be reproduced without permission.',
    edition: {
      edition: 'In preparation — rights review in progress',
      source: 'Candidate sources under verification.',
      rights: 'Pending. Modern versions (Barks, Ladinsky-inspired, etc.) are copyrighted and excluded.',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'ecclesiastes', reason: 'Longing and love as wisdom paths across traditions.' }],
    chapters: [],
  },
  {
    id: 'hermetica',
    title: 'The Hermetica — Corpus Hermeticum',
    author: 'Hermes Trismegistus (attributed)',
    roomId: 'wisdom',
    tradition: 'Hermeticism · Alexandria, c. 2nd–3rd century CE',
    subjects: ['Hermeticism', 'Esotericism'],
    themes: ['mind', 'cosmos', 'as-above-so-below'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'metal', base: '#0d2b3a,#154a5c', accent: '#9fe8ff', motif: 'star', gem: '#9fe8ff' },
    description:
      '“As above, so below” — the revelatory dialogues of Graeco-Egyptian wisdom that seeded alchemy, Renaissance magic, and modern esotericism. A Mead (1906, public domain) selection is being prepared.',
    edition: {
      translator: 'G. R. S. Mead (1906) — in preparation',
      edition: 'Thrice-Greatest Hermes — verification in progress',
      source: 'To be verified against archive.org scan.',
      rights: 'Public domain (pending verification).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'alchemical-symbols', reason: 'The Hermetica are alchemy’s ancestral scriptures.' }],
    chapters: [],
  },
];

```

## src/hooks/useLibraryStore.ts

```ts
import { useCallback, useEffect, useState } from 'react';
import type { Atmosphere, Bookmark, ProgressEntry, RecentVisit } from '../data/types';

const KEY = 'inner-orbit-library-v1';

interface StoreShape {
  progress: Record<string, ProgressEntry>;
  bookmarks: Bookmark[];
  notes: Record<string, { text: string; updated: number }>;
  recent: RecentVisit[];
  atmosphere: Atmosphere;
  readerPrefs: { fontSize: number; lineSpacing: number; theme: 'parchment' | 'night' | 'dawn'; motionSafe: boolean };
  soulHubRoute: string;
  onboardingSeen: boolean;
}

const defaults: StoreShape = {
  progress: {},
  bookmarks: [],
  notes: {},
  recent: [],
  atmosphere: 'full',
  readerPrefs: { fontSize: 19, lineSpacing: 1.75, theme: 'parchment', motionSafe: false },
  soulHubRoute: '/soul-hub',
  onboardingSeen: false,
};

function load(): StoreShape {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function useLibraryStore() {
  const [store, setStore] = useState<StoreShape>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch { /* storage unavailable */ }
  }, [store]);

  // respect OS reduced-motion on first run
  useEffect(() => {
    if (!store.onboardingSeen && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setStore((s) => ({ ...s, atmosphere: 'minimal', readerPrefs: { ...s.readerPrefs, motionSafe: true } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProgress = useCallback((entry: ProgressEntry) => {
    setStore((s) => ({ ...s, progress: { ...s.progress, [entry.bookId]: entry } }));
  }, []);

  const toggleBookmark = useCallback((b: Omit<Bookmark, 'id' | 'created'>) => {
    setStore((s) => {
      const exists = s.bookmarks.find((x) => x.bookId === b.bookId && x.chapterId === b.chapterId && x.page === b.page);
      if (exists) return { ...s, bookmarks: s.bookmarks.filter((x) => x.id !== exists.id) };
      const nb: Bookmark = { ...b, id: Math.random().toString(36).slice(2), created: Date.now() };
      return { ...s, bookmarks: [nb, ...s.bookmarks].slice(0, 200) };
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setStore((s) => ({ ...s, bookmarks: s.bookmarks.filter((x) => x.id !== id) }));
  }, []);

  const saveNote = useCallback((key: string, text: string) => {
    setStore((s) => ({ ...s, notes: { ...s.notes, [key]: { text, updated: Date.now() } } }));
  }, []);

  const pushRecent = useCallback((bookId: string, chapterId?: string) => {
    setStore((s) => {
      const recent = [{ bookId, chapterId, timestamp: Date.now() }, ...s.recent.filter((r) => r.bookId !== bookId)].slice(0, 12);
      return { ...s, recent };
    });
  }, []);

  const setAtmosphere = useCallback((atmosphere: Atmosphere) => setStore((s) => ({ ...s, atmosphere })), []);
  const setReaderPrefs = useCallback((p: Partial<StoreShape['readerPrefs']>) =>
    setStore((s) => ({ ...s, readerPrefs: { ...s.readerPrefs, ...p } })), []);
  const setSoulHubRoute = useCallback((soulHubRoute: string) => setStore((s) => ({ ...s, soulHubRoute })), []);
  const markOnboarded = useCallback(() => setStore((s) => ({ ...s, onboardingSeen: true })), []);

  const continueReading = Object.values(store.progress).sort((a, b) => b.updated - a.updated)[0] as ProgressEntry | undefined;

  return {
    store, updateProgress, toggleBookmark, removeBookmark, saveNote, pushRecent,
    setAtmosphere, setReaderPrefs, setSoulHubRoute, markOnboarded, continueReading,
  };
}

export type LibraryStore = ReturnType<typeof useLibraryStore>;

```

## src/index.css

```css
@import "tailwindcss";

@theme {
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-reading: "EB Garamond", Georgia, serif;
  --font-ui: "Inter", system-ui, sans-serif;
  --color-void: #060312;
  --color-abyss: #0c0724;
  --color-gold: #e8c476;
  --color-gold-bright: #f7dd9a;
  --color-parchment: #f5eeda;
}

html, body, #root {
  height: 100%;
  background: #060312;
  color: #f3ecdb;
  font-family: "Inter", system-ui, sans-serif;
  overscroll-behavior-y: none;
}

.font-display { font-family: "Cormorant Garamond", Georgia, serif; }
.font-reading { font-family: "EB Garamond", Georgia, serif; }

::selection { background: rgba(232,196,118,.35); color: #fff; }

/* ---------- scrollbar ---------- */
* { scrollbar-width: thin; scrollbar-color: rgba(232,196,118,.4) transparent; }
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-thumb { background: rgba(232,196,118,.35); border-radius: 99px; }
*::-webkit-scrollbar-track { background: transparent; }

/* ---------- gold text ---------- */
.gold-text {
  background: linear-gradient(135deg, #f9e7b8 0%, #e8c476 30%, #c99a3f 55%, #f7dd9a 75%, #e8c476 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.gold-rule {
  background: linear-gradient(90deg, transparent, rgba(232,196,118,.7), transparent);
  height: 1px;
}

/* ---------- glass panels ---------- */
.glass {
  background: linear-gradient(160deg, rgba(24,16,52,.82), rgba(10,6,28,.88));
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(232,196,118,.22);
}
.glass-soft {
  background: rgba(10,6,28,.55);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(232,196,118,.16);
}
.ornate-frame {
  position: relative;
  border: 1px solid rgba(232,196,118,.35);
  box-shadow: 0 0 0 1px rgba(0,0,0,.6), 0 0 40px rgba(124,58,237,.25), inset 0 0 60px rgba(232,196,118,.05);
}
.ornate-corner::before, .ornate-corner::after {
  content: ""; position: absolute; width: 22px; height: 22px; pointer-events: none;
  border-color: rgba(247,221,154,.9); border-style: solid;
}
.ornate-corner::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.ornate-corner::after { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

/* ---------- ambient animations ---------- */
@keyframes floaty { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
@keyframes drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(14px,-18px) } }
@keyframes shimmer { 0% { background-position: -200% center } 100% { background-position: 200% center } }
@keyframes glowPulse { 0%,100% { opacity:.55 } 50% { opacity:1 } }
@keyframes spinSlow { to { transform: rotate(360deg) } }
@keyframes portalGlow { 0%,100% { box-shadow: 0 0 24px rgba(232,196,118,.25), inset 0 0 30px rgba(124,58,237,.35) } 50% { box-shadow: 0 0 60px rgba(232,196,118,.5), inset 0 0 50px rgba(124,58,237,.55) } }
@keyframes riseIn { from { opacity:0; transform: translateY(26px) } to { opacity:1; transform: translateY(0) } }
@keyframes candleFlicker { 0%,100% { opacity:1 } 20% { opacity:.82 } 40% { opacity:.95 } 60% { opacity:.78 } 80% { opacity:.92 } }

.animate-floaty { animation: floaty 7s ease-in-out infinite; }
.animate-drift { animation: drift 12s ease-in-out infinite; }
.animate-rise { animation: riseIn .7s cubic-bezier(.22,1,.36,1) both; }
.animate-spin-slower { animation: spinSlow 60s linear infinite; }
.animate-spin-slow { animation: spinSlow 24s linear infinite; }

.shimmer-gold {
  background: linear-gradient(110deg, #e8c476 20%, #fff6dd 40%, #e8c476 60%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmer 5s linear infinite;
}

/* ---------- book cover sheen ---------- */
.cover-sheen { position: relative; overflow: hidden; }
.cover-sheen::after {
  content:""; position:absolute; inset:0; pointer-events:none;
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.22) 45%, transparent 60%);
  transform: translateX(-120%); transition: transform .9s ease;
}
.cover-sheen:hover::after { transform: translateX(120%); }

/* ---------- Living Tome pages ---------- */
.tome-stage { perspective: 2400px; }
.tome-book {
  transform-style: preserve-3d;
  box-shadow: 0 40px 120px rgba(0,0,0,.8), 0 0 80px rgba(124,58,237,.25);
}
.page-paper {
  background:
    radial-gradient(ellipse at 20% 10%, rgba(255,250,235,.6), transparent 50%),
    radial-gradient(ellipse at 85% 90%, rgba(160,120,60,.12), transparent 55%),
    linear-gradient(105deg, #efe3c8 0%, #f7efda 12%, #faf4e4 50%, #f4ead2 88%, #e7d6b4 100%);
  color: #2b2118;
}
.page-paper-night {
  background: linear-gradient(105deg, #171224 0%, #1e1832 12%, #221b38 50%, #1c162e 88%, #120d20 100%);
  color: #e9e0cf;
}
.page-paper-dawn {
  background: linear-gradient(105deg, #e8d9d4 0%, #f2e6e2 12%, #f7efea 50%, #efdfdc 88%, #dcc7c2 100%);
  color: #33231f;
}
.page-left-shadow { box-shadow: inset -40px 0 60px -30px rgba(60,35,10,.45), inset -2px 0 3px rgba(60,35,10,.3); }
.page-right-shadow { box-shadow: inset 40px 0 60px -30px rgba(60,35,10,.45), inset 2px 0 3px rgba(60,35,10,.3); }
.page-left-shadow-night { box-shadow: inset -40px 0 60px -30px rgba(0,0,0,.7); }
.page-right-shadow-night { box-shadow: inset 40px 0 60px -30px rgba(0,0,0,.7); }

.drop-cap::first-letter {
  font-family: "Cormorant Garamond", serif;
  font-weight: 700;
  font-size: 3.4em; line-height: .82;
  float: left; margin: .06em .12em 0 0;
  color: #8a5a1c;
  text-shadow: 0 1px 0 rgba(255,255,255,.5);
}
.drop-cap-night::first-letter { color: #e8c476; text-shadow: 0 0 18px rgba(232,196,118,.4); }

.page-curl {
  position: absolute; top:0; bottom:0; width: 90px; pointer-events:none; z-index: 5;
}
.curl-left { right: 0; background: linear-gradient(270deg, rgba(43,25,8,.35), transparent); border-radius: 0 6px 6px 0; }
.curl-right { left: 0; background: linear-gradient(90deg, rgba(43,25,8,.35), transparent); border-radius: 6px 0 0 6px; }

/* page turn */
@keyframes pageTurnRight {
  0% { transform: rotateY(0deg); opacity:1; }
  100% { transform: rotateY(-18deg) translateX(-14px); opacity:0; }
}
@keyframes pageTurnLeft {
  0% { transform: rotateY(0deg); opacity:1; }
  100% { transform: rotateY(18deg) translateX(14px); opacity:0; }
}
@keyframes pageEnter { from { opacity:0 } to { opacity:1 } }

/* ---------- reader text ---------- */
.reader-body p { margin-bottom: .9em; }
.reader-body p.verse-line { margin-bottom: .35em; }

/* ---------- misc ---------- */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
.text-balance { text-wrap: balance; }

.illuminated-initial {
  display:inline-flex; align-items:center; justify-content:center;
  width: 2.6em; height: 2.6em; float:left; margin: .1em .3em 0 0;
  font-family:"Cormorant Garamond",serif; font-weight:700; font-size:1.25em;
  border-radius: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .animate-floaty, .animate-drift, .animate-spin-slow, .animate-spin-slower, .shimmer-gold { animation: none !important; }
}

```

## src/main.tsx

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

## src/utils/cn.ts

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```
