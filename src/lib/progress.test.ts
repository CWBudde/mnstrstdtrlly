import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { calculateScore, recordWrongAttempt, solveStation } from './game';
import { emptyProgress, loadProgress, resetProgress, saveProgress } from './progress';

const key = 'mnstrstdtrlly:progress:v3';
const ids = ['first', 'last'];
const read = () => (loadProgress as (...args: unknown[]) => typeof emptyProgress)(ids, { first: 2, last: 1 });
let storage: Map<string, string>;
beforeEach(() => {
  storage = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (name: string) => storage.get(name) ?? null,
    setItem: (name: string, value: string) => storage.set(name, value),
    removeItem: (name: string) => storage.delete(name),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe('persisted progress', () => {
  it('ignores v2 data after route reorder', () => {
    storage.set('mnstrstdtrlly:progress:v2', JSON.stringify({ current: 1, solved: ['last'] }));
    expect(read().solved).toEqual([]);
  });
  it('round trips v3 progress', () => {
    const progress = { ...emptyProgress, current: 1, solved: ['first'], startedAt: 1000 };
    saveProgress(progress);
    expect(storage.has(key)).toBe(true);
    expect(read()).toEqual(progress);
    resetProgress();
    expect(read().solved).toEqual([]);
  });
  it.each(['broken', 'null', '[]', 'true', '42'])('safely loads malformed %s', (raw) => {
    storage.set(key, raw);
    expect(read()).toEqual(emptyProgress);
  });
  it('sanitizes IDs, counters, station index and invalid timestamps', () => {
    storage.set(key, JSON.stringify({ current: 999, solved: ['first', 'first', 'foreign', 2],
      hintsUsed: { first: 99, last: -2, foreign: 4 },
      wrongAttempts: { first: 3, last: '3', foreign: 10 },
      blockedUntil: { first: Date.now() + 20_000, last: -1, foreign: Date.now() },
      emergencySolved: ['first', 'foreign', 'last'], startedAt: 'today', finishedAt: 5000 }));
    const progress = read() as typeof emptyProgress & { wrongAttempts: Record<string, number>; blockedUntil: Record<string, number>; emergencySolved: string[] };
    expect(progress.current).toBe(1);
    expect(progress.solved).toEqual(['first']);
    expect(progress.hintsUsed).toEqual({ first: 2 });
    expect(progress.wrongAttempts).toEqual({ first: 3 });
    expect(Object.keys(progress.blockedUntil)).toEqual(['first']);
    expect(progress.emergencySolved).toEqual(['first']);
    expect(progress.startedAt).toBeNull();
    expect(progress.finishedAt).toBeNull();
  });
  it('rejects future and reversed timestamps', () => {
    storage.set(key, JSON.stringify({ startedAt: Date.now() + 5000, finishedAt: Date.now() + 6000 }));
    expect(read().startedAt).toBeNull();
    storage.set(key, JSON.stringify({ startedAt: 2000, finishedAt: 1000 }));
    expect(read().finishedAt).toBeNull();
  });
  it('does not share mutable default progress', () => {
    read().solved.push('first');
    expect(read().solved).toEqual([]);
    expect(emptyProgress.solved).toEqual([]);
  });
  it('retains cooldown and point deductions across reload', () => {
    const now = Date.now();
    let progress: typeof emptyProgress = { ...emptyProgress, startedAt: now - 1000 };
    for (let i = 0; i < 3; i++) progress = recordWrongAttempt(progress, 'first', now);
    saveProgress(progress);
    const restored = read();
    expect(restored.wrongAttempts.first).toBe(3);
    expect(restored.blockedUntil.first).toBe(now + 30_000);
    expect(calculateScore(restored)).toBe(970);
    expect(solveStation(restored, 'first', 'answer', now + 1000).solved).toEqual([]);
    expect(solveStation(restored, 'first', 'answer', now + 30_000).solved).toEqual(['first']);
  });
  it('retains emergency use and valid completion across reload', () => {
    const started = { ...emptyProgress, startedAt: 1000 };
    const completed = solveStation({ ...solveStation(started, 'first', 'fallback', 2000), current: 1 }, 'last', 'emergency', 3000, true);
    saveProgress(completed);
    expect(read()).toEqual(completed);
    expect(calculateScore(read())).toBe(800);
  });
  it('only restores completion when the final station is solved', () => {
    storage.set(key, JSON.stringify({ startedAt: 1000, finishedAt: 2000, solved: ['first'] }));
    expect(read().finishedAt).toBeNull();
  });
  it.each([-1, 1.5, '1', null])('rejects invalid index %s', (current) => {
    storage.set(key, JSON.stringify({ current }));
    expect(read().current).toBe(0);
  });
  it('rejects nonfinite counters and implausible future deadlines', () => {
    storage.set(key, '{"current":1e400,"hintsUsed":{"first":1e400},"wrongAttempts":{"last":1.5},"blockedUntil":{"first":999999999999999}}');
    expect(read().current).toBe(0);
    expect(read().hintsUsed).toEqual({});
    expect(read().wrongAttempts).toEqual({});
    expect(read().blockedUntil).toEqual({});
  });
  it('cannot restore a later station before solving its predecessors', () => {
    storage.set(key, JSON.stringify({ current: 9, solved: [], startedAt: 1000 }));
    expect(read().current).toBe(0);
  });
  it('drops solved IDs beyond the first missing station and their emergency claims', () => {
    storage.set(key, JSON.stringify({ current: 2, solved: ['first', 'last'], emergencySolved: ['last'], startedAt: 1000 }));
    const restored = loadProgress(['first', 'middle', 'last']);
    expect(restored.solved).toEqual(['first']);
    expect(restored.current).toBe(1);
    expect(restored.emergencySolved).toEqual([]);
  });
  it.each([1, 2])('preserves the normal just-solved or next-station screen %s', (current) => {
    storage.set(key, JSON.stringify({ current, solved: ['first', 'middle'], startedAt: 1000 }));
    expect(loadProgress(['first', 'middle', 'last']).current).toBe(current);
  });
  it('brings a stale earlier index to the latest solved station', () => {
    storage.set(key, JSON.stringify({ current: 0, solved: ['first', 'middle'], startedAt: 1000 }));
    expect(loadProgress(['first', 'middle', 'last']).current).toBe(1);
  });
  it.each([null, 'invalid', 500, 999999999999999])('reopens a solved finale with invalid finishedAt %s', (finishedAt) => {
    storage.set(key, JSON.stringify({ current: 1, solved: ['first', 'last'], emergencySolved: ['last'], startedAt: 1000, finishedAt }));
    const restored = read();
    expect(restored.current).toBe(1);
    expect(restored.solved).toEqual(['first']);
    expect(restored.finishedAt).toBeNull();
    expect(restored.startedAt).toBe(1000);
    expect(restored.emergencySolved).toEqual([]);
    const completed = solveStation(restored, 'last', 'emergency', 5000, true);
    expect(completed.finishedAt).toBe(5000);
    expect(completed.emergencySolved).toEqual(['last']);
    expect(calculateScore(completed)).toBe(900);
  });
  it('resets an apparently completed game whose start time cannot be recovered', () => {
    storage.set(key, JSON.stringify({ current: 1, solved: ['first', 'last'], startedAt: 'lost', finishedAt: 2000 }));
    expect(read()).toEqual(emptyProgress);
  });
  it('survives inaccessible storage', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); }, removeItem: () => { throw new Error('denied'); } });
    expect(read()).toEqual(emptyProgress);
    expect(() => saveProgress(emptyProgress)).not.toThrow();
    expect(() => resetProgress()).not.toThrow();
  });
});
