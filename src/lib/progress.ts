export interface Progress {
  current: number;
  solved: string[];
  hintsUsed: Record<string, number>;
  wrongAttempts: Record<string, number>;
  blockedUntil: Record<string, number>;
  emergencySolved: string[];
  startedAt: number | null;
  finishedAt: number | null;
}

export const STORAGE_KEY = 'mnstrstdtrlly:progress:v3';

export const emptyProgress: Progress = {
  current: 0, solved: [], hintsUsed: {}, wrongAttempts: {}, blockedUntil: {},
  emergencySolved: [], startedAt: null, finishedAt: null,
};

function freshProgress(): Progress {
  return { ...emptyProgress, solved: [], hintsUsed: {}, wrongAttempts: {}, blockedUntil: {}, emergencySolved: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonnegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function loadProgress(stationIds: readonly string[] = [], hintLimits: Record<string, number> = {}): Progress {
  const fresh = freshProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return fresh;
    const validIds = new Set(stationIds);
    const knownIds = (value: unknown): string[] => Array.isArray(value)
      ? [...new Set(value.filter((id): id is string => typeof id === 'string' && validIds.has(id)))] : [];
    const counters = (value: unknown, hints = false): Record<string, number> => {
      if (!isRecord(value)) return {};
      return Object.fromEntries(Object.entries(value)
        .filter(([id, count]) => validIds.has(id) && nonnegativeInteger(count))
        .map(([id, count]) => [id, hints ? Math.min(count as number, hintLimits[id] ?? (count as number)) : count as number]));
    };
    const now = Date.now();
    const validTimestamp = (value: unknown): value is number => nonnegativeInteger(value) && value <= now;
    const claimedSolved = new Set(knownIds(parsed.solved));
    let solved: string[] = [];
    for (const id of stationIds) {
      if (!claimedSolved.has(id)) break;
      solved.push(id);
    }
    const startedAt = validTimestamp(parsed.startedAt) ? parsed.startedAt : null;
    const finishedAt = startedAt !== null && validTimestamp(parsed.finishedAt)
      && parsed.finishedAt >= startedAt && stationIds.length > 0 && solved.length === stationIds.length
      ? parsed.finishedAt : null;
    const incompleteTiming = stationIds.length > 0 && solved.length === stationIds.length && finishedAt === null;
    if (incompleteTiming && startedAt === null) return fresh;
    // A missing finish time cannot produce an honest duration. Reopen the finale,
    // retaining the valid start and preceding stations until it is completed again.
    if (incompleteTiming) solved = solved.slice(0, -1);
    const lastIndex = Math.max(0, stationIds.length - 1);
    const requestedCurrent = nonnegativeInteger(parsed.current) ? parsed.current : 0;
    const current = incompleteTiming ? lastIndex : Math.max(
      Math.max(0, solved.length - 1),
      Math.min(requestedCurrent, solved.length, lastIndex),
    );
    const blockedUntil = isRecord(parsed.blockedUntil)
      ? Object.fromEntries(Object.entries(parsed.blockedUntil).filter(([id, deadline]) =>
        validIds.has(id) && nonnegativeInteger(deadline) && deadline <= now + 300_000)
        .map(([id, deadline]) => [id, deadline as number])) : {};
    return {
      current,
      solved, hintsUsed: counters(parsed.hintsUsed, true), wrongAttempts: counters(parsed.wrongAttempts),
      blockedUntil, emergencySolved: knownIds(parsed.emergencySolved).filter((id) => solved.includes(id)),
      startedAt, finishedAt,
    };
  } catch {
    return fresh;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage may be unavailable; the current game still works in memory.
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable.
  }
}
