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
