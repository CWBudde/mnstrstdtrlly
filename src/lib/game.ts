import { checkAnswer, normalizeAnswer } from './answers';
import type { Progress } from './progress';

export type SolveMode = 'answer' | 'gps' | 'fallback' | 'emergency';

export function calculateScore(progress: Progress): number {
  const hints = Object.values(progress.hintsUsed).reduce((sum, count) => sum + count, 0);
  const wrong = Object.values(progress.wrongAttempts).reduce((sum, count) => sum + count, 0);
  return Math.max(0, 1000 - hints * 25 - wrong * 10 - progress.emergencySolved.length * 100);
}

export function recordWrongAttempt(progress: Progress, stationId: string, now = Date.now()): Progress {
  if (progress.solved.includes(stationId) || (progress.blockedUntil[stationId] ?? 0) > now) return progress;
  const attempts = (progress.wrongAttempts[stationId] ?? 0) + 1;
  const blockedUntil = attempts % 3 === 0
    ? { ...progress.blockedUntil, [stationId]: now + Math.min(300_000, 30_000 * 2 ** (attempts / 3 - 1)) }
    : progress.blockedUntil;
  return { ...progress, wrongAttempts: { ...progress.wrongAttempts, [stationId]: attempts }, blockedUntil };
}

export function revealHint(progress: Progress, stationId: string, available: number): Progress {
  const used = progress.hintsUsed[stationId] ?? 0;
  if (progress.solved.includes(stationId) || used >= available) return progress;
  return { ...progress, hintsUsed: { ...progress.hintsUsed, [stationId]: used + 1 } };
}

export function solveStation(progress: Progress, stationId: string, mode: SolveMode, now = Date.now(), isLast = false): Progress {
  if (progress.solved.includes(stationId)) return progress;
  if ((mode === 'answer' || mode === 'fallback') && (progress.blockedUntil[stationId] ?? 0) > now) return progress;
  const emergency = mode === 'emergency' || mode === 'fallback';
  return {
    ...progress, solved: [...progress.solved, stationId],
    emergencySolved: emergency ? [...progress.emergencySolved, stationId] : progress.emergencySolved,
    finishedAt: isLast ? (progress.finishedAt ?? now) : progress.finishedAt,
  };
}

export interface AnswerAttempt {
  stationId: string;
  input: string;
  hashes: string[];
  mode: 'answer' | 'fallback';
  isLast?: boolean;
}

/** Owns accepted submissions for a game run, independently of its visible screen. */
export function createAnswerSession(
  getProgress: () => Progress,
  updateProgress: (change: (progress: Progress) => Progress) => void,
  onPendingChange: () => void = () => {},
) {
  const pending = new Set<string>();
  let generation = 0;
  return {
    isPending: (id: string): boolean => pending.has(id),
    reset() {
      generation += 1;
      pending.clear();
      onPendingChange();
    },
    async submit(attempt: AnswerAttempt): Promise<boolean | null> {
      const progress = getProgress();
      if (!normalizeAnswer(attempt.input) || pending.has(attempt.stationId)
        || progress.solved.includes(attempt.stationId)
        || (progress.blockedUntil[attempt.stationId] ?? 0) > Date.now()) return null;
      const acceptedGeneration = generation;
      pending.add(attempt.stationId);
      onPendingChange();
      try {
        const ok = await checkAnswer(attempt.input, attempt.hashes);
        if (acceptedGeneration !== generation) return null;
        updateProgress((current) => acceptedGeneration !== generation ? current : ok
          ? solveStation(current, attempt.stationId, attempt.mode, Date.now(), attempt.isLast)
          : recordWrongAttempt(current, attempt.stationId));
        return ok;
      } finally {
        if (acceptedGeneration === generation) {
          pending.delete(attempt.stationId);
          onPendingChange();
        }
      }
    },
  };
}
