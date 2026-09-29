import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress } from './progress';
import { calculateScore, recordWrongAttempt, revealHint, solveStation } from './game';

function wrongBlock(progress = emptyProgress, now = 1000) {
  for (let attempt = 0; attempt < 3; attempt++) progress = recordWrongAttempt(progress, 'first', now);
  return progress;
}

describe('station game rules', () => {
  it('blocks answer solves after three wrong attempts and preserves the deadline', () => {
    const progress = wrongBlock();
    expect(progress.wrongAttempts.first).toBe(3);
    expect(progress.blockedUntil.first).toBe(31_000);
    expect(recordWrongAttempt(progress, 'first', 2000)).toBe(progress);
    expect(solveStation(progress, 'first', 'answer', 2000)).toBe(progress);
    expect(solveStation(progress, 'first', 'fallback', 2000)).toBe(progress);
    expect(solveStation(progress, 'first', 'answer', 31_000).solved).toEqual(['first']);
  });
  it('doubles each subsequent cooldown and caps at five minutes', () => {
    let progress = emptyProgress;
    let now = 1000;
    for (const expected of [30_000, 60_000, 120_000, 240_000, 300_000, 300_000]) {
      progress = wrongBlock(progress, now);
      expect(progress.blockedUntil.first).toBe(now + expected);
      now += expected;
    }
  });
  it('charges hints once up to the available count', () => {
    let progress = revealHint(emptyProgress, 'first', 2);
    progress = revealHint(progress, 'first', 2);
    expect(revealHint(progress, 'first', 2)).toBe(progress);
    expect(progress.hintsUsed.first).toBe(2);
    expect(calculateScore(progress)).toBe(950);
  });
  it.each(['emergency', 'gps'] as const)('%s can solve during cooldown', (mode) => {
    const solved = solveStation(wrongBlock(), 'first', mode, 2000);
    expect(solved.solved).toEqual(['first']);
    expect(calculateScore(solved)).toBe(mode === 'gps' ? 970 : 870);
  });
  it('records successful GPS fallback as emergency and ignores repeated solved events', () => {
    const solved = solveStation(emptyProgress, 'first', 'fallback', 1000);
    expect(solved.emergencySolved).toEqual(['first']);
    expect(calculateScore(solved)).toBe(900);
    expect(solveStation(solved, 'first', 'emergency', 2000)).toBe(solved);
    expect(recordWrongAttempt(solved, 'first', 2000)).toBe(solved);
    expect(revealHint(solved, 'first', 2)).toBe(solved);
  });
  it('only final solves set finishedAt and clamps score at zero', () => {
    const started = { ...emptyProgress, startedAt: 1000 };
    expect(solveStation(started, 'first', 'answer', 2000).finishedAt).toBeNull();
    expect(solveStation(started, 'last', 'emergency', 5000, true).finishedAt).toBe(5000);
    expect(calculateScore({ ...started, wrongAttempts: { first: 200 } })).toBe(0);
    expect(calculateScore(emptyProgress)).toBe(1000);
  });
});

// The state holder represents App, which stays mounted while its station view changes.
// Verification remains the real checkAnswer; only the browser's async digest is delayed.
describe('answer accounting owned by the game session', () => {
  let release: () => void;
  beforeEach(() => {
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    const gate = new Promise<void>((resolve) => { release = resolve; });
    vi.spyOn(crypto.subtle, 'digest').mockImplementation(async (...args) => {
      const hash = await digest(...args);
      await gate;
      return hash;
    });
  });
  afterEach(() => vi.restoreAllMocks());
  it.each(['answer', 'fallback'] as const)('retains pending ownership and counts a submitted wrong %s after the station view leaves', async (mode) => {
    const { createAnswerSession } = await import('./game');
    let progress: typeof emptyProgress = { ...emptyProgress, startedAt: 1000 };
    const session = createAnswerSession(() => progress, (change) => { progress = change(progress); });
    const first = session.submit({ stationId: 'first', input: 'wrong', hashes: [], mode });
    expect(session.isPending('first')).toBe(true);
    // A remounted quiz uses the same session, so a second accepted attempt is impossible.
    expect(await session.submit({ stationId: 'first', input: 'wrong again', hashes: [], mode })).toBeNull();
    release();
    expect(await first).toBe(false);
    expect(progress.wrongAttempts.first).toBe(1);
    expect(calculateScore(progress)).toBe(990);
    expect(session.isPending('first')).toBe(false);
  });
  it('solves a successful fallback after leaving the station view and charges it once', async () => {
    const { createAnswerSession } = await import('./game');
    let progress: typeof emptyProgress = { ...emptyProgress, startedAt: 1000 };
    const session = createAnswerSession(() => progress, (change) => { progress = change(progress); });
    const pending = session.submit({ stationId: 'first', input: '3',
      hashes: ['4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'], mode: 'fallback' });
    release();
    expect(await pending).toBe(true);
    expect(progress.solved).toEqual(['first']);
    expect(progress.emergencySolved).toEqual(['first']);
    expect(calculateScore(progress)).toBe(900);
  });
  it('does not apply a late answer from a reset game to its replacement', async () => {
    const { createAnswerSession } = await import('./game');
    let progress: typeof emptyProgress = { ...emptyProgress, startedAt: 1000 };
    const session = createAnswerSession(() => progress, (change) => { progress = change(progress); });
    const old = session.submit({ stationId: 'first', input: 'old wrong', hashes: [], mode: 'fallback' });
    session.reset();
    progress = { ...emptyProgress, startedAt: 2000 };
    const current = session.submit({ stationId: 'first', input: 'new wrong', hashes: [], mode: 'fallback' });
    release();
    expect(await old).toBeNull();
    expect(await current).toBe(false);
    expect(progress.wrongAttempts.first).toBe(1);
    expect(calculateScore(progress)).toBe(990);
  });
  it('keeps emergency completion authoritative over an outstanding wrong fallback', async () => {
    const { createAnswerSession } = await import('./game');
    let progress: typeof emptyProgress = { ...emptyProgress, startedAt: 1000 };
    const session = createAnswerSession(() => progress, (change) => { progress = change(progress); });
    const pending = session.submit({ stationId: 'first', input: 'wrong', hashes: [], mode: 'fallback' });
    progress = solveStation(progress, 'first', 'emergency', 2000);
    release();
    await pending;
    expect(progress.wrongAttempts).toEqual({});
    expect(calculateScore(progress)).toBe(900);
  });
});
