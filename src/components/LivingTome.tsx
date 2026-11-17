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
