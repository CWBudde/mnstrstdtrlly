export interface Progress {
  /** Index der aktuellen Station (0-basiert). */
  current: number;
  /** IDs der gelösten Stationen. */
  solved: string[];
  /** Anzahl aufgedeckter Hinweise pro Station. */
  hintsUsed: Record<string, number>;
  startedAt: number | null;
  finishedAt: number | null;
}

const STORAGE_KEY = 'mnstrstdtrlly:progress:v1';

export const emptyProgress: Progress = {
  current: 0,
  solved: [],
  hintsUsed: {},
  startedAt: null,
  finishedAt: null,
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...emptyProgress, ...parsed };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage nicht verfügbar (z.B. Privatmodus) – Spiel läuft ohne Speicherung weiter.
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorieren
  }
}
