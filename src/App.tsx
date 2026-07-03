import { useEffect, useMemo, useState } from 'react';
import { stations } from './data/stations';
import { loadProgress, saveProgress, resetProgress, emptyProgress, type Progress } from './lib/progress';
import StartScreen from './components/StartScreen';
import StationScreen from './components/StationScreen';
import MapView from './components/MapView';

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const started = progress.startedAt !== null;
  const current = Math.min(progress.current, stations.length - 1);
  const station = stations[current];
  const solvedCurrent = progress.solved.includes(station.id);

  const fragments = useMemo(
    () =>
      stations
        .filter((s) => s.fragment && progress.solved.includes(s.id))
        .map((s) => s.fragment as string),
    [progress.solved],
  );

  const handleStart = () => {
    setProgress((p) => ({ ...p, startedAt: p.startedAt ?? Date.now() }));
  };

  const handleSolved = () => {
    setProgress((p) => {
      const solved = p.solved.includes(station.id) ? p.solved : [...p.solved, station.id];
      const finishedAt =
        current === stations.length - 1 ? (p.finishedAt ?? Date.now()) : p.finishedAt;
      return { ...p, solved, finishedAt };
    });
  };

  const handleNext = () => {
    setProgress((p) => ({ ...p, current: Math.min(p.current + 1, stations.length - 1) }));
    window.scrollTo({ top: 0 });
  };

  const handleHintUsed = () => {
    setProgress((p) => ({
      ...p,
      hintsUsed: { ...p.hintsUsed, [station.id]: (p.hintsUsed[station.id] ?? 0) + 1 },
    }));
  };

  const handleReset = () => {
    if (window.confirm('Wirklich von vorn beginnen? Der gesamte Fortschritt geht verloren.')) {
      resetProgress();
      setProgress(emptyProgress);
      setShowMap(false);
    }
  };

  if (!started) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-title">
          <span className="topbar-emblem">✉</span> Die verlorene Depesche
        </div>
        <div className="topbar-actions">
          <button className="iconbtn" onClick={() => setShowMap((v) => !v)}>
            {showMap ? '📜 Rätsel' : '🗺️ Karte'}
          </button>
          <button className="iconbtn" onClick={handleReset} title="Neu starten">
            ↺
          </button>
        </div>
      </header>

      <div className="progress-dots" aria-label="Fortschritt">
        {stations.map((s, i) => (
          <span
            key={s.id}
            className={
              'dot' +
              (progress.solved.includes(s.id) ? ' done' : '') +
              (i === current ? ' active' : '')
            }
            title={s.name}
          />
        ))}
      </div>

      {fragments.length > 0 && (
        <div className="fragments">
          <span className="fragments-label">Gefundene Fragmente:</span>
          {fragments.map((f) => (
            <span key={f} className="fragment">{f}</span>
          ))}
        </div>
      )}

      {showMap ? (
        <MapView
          stations={stations}
          currentIndex={current}
          solvedIds={progress.solved}
        />
      ) : (
        <StationScreen
          key={station.id}
          station={station}
          solved={solvedCurrent}
          isLast={current === stations.length - 1}
          hintsUsed={progress.hintsUsed[station.id] ?? 0}
          onSolved={handleSolved}
          onNext={handleNext}
          onHintUsed={handleHintUsed}
        />
      )}
    </div>
  );
}
