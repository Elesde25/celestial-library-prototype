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
