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
