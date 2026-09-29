import { useEffect, useMemo, useRef, useState } from 'react';
import { stations } from './data/stations';
import { loadProgress, saveProgress, resetProgress, emptyProgress, type Progress } from './lib/progress';
import { calculateScore, createAnswerSession, revealHint, solveStation, type SolveMode } from './lib/game';
import StartScreen from './components/StartScreen';
import StationScreen from './components/StationScreen';
import MapView from './components/MapView';

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(stations.map((s) => s.id), Object.fromEntries(stations.map((s) => [s.id, s.hints.length]))));
  const [showMap, setShowMap] = useState(false);
  const [, tick] = useState(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const answersRef = useRef<ReturnType<typeof createAnswerSession> | null>(null);
  if (answersRef.current === null) {
    answersRef.current = createAnswerSession(
      () => progressRef.current,
      (change) => setProgress((p) => change(p)),
      () => tick((value) => value + 1),
    );
  }
  const answers = answersRef.current;

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const started = progress.startedAt !== null;
  const current = Math.min(progress.current, stations.length - 1);
  const station = stations[current];
  const solvedCurrent = progress.solved.includes(station.id);
  const blockedUntil = progress.blockedUntil[station.id] ?? 0;
  const cooldownSeconds = solvedCurrent ? 0 : Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
  const score = calculateScore(progress);

  useEffect(() => {
    if (solvedCurrent || blockedUntil <= Date.now()) return;
    const timer = window.setInterval(() => {
      tick((value) => value + 1);
      if (blockedUntil <= Date.now()) window.clearInterval(timer);
    }, 250);
    return () => window.clearInterval(timer);
  }, [blockedUntil, solvedCurrent]);

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

  const handleSolved = (mode: SolveMode) => {
    setProgress((p) => solveStation(p, station.id, mode, Date.now(), current === stations.length - 1));
  };

  const handleAttempt = (input: string) => answers.submit({
    stationId: station.id, input,
    hashes: station.task.kind === 'quiz' ? station.task.answerHashes : station.task.fallbackHashes,
    mode: station.task.kind === 'quiz' ? 'answer' : 'fallback',
    isLast: current === stations.length - 1,
  });

  const handleNext = () => {
    setProgress((p) => p.solved.includes(station.id) ? { ...p, current: Math.min(p.current + 1, stations.length - 1) } : p);
    window.scrollTo({ top: 0 });
  };

  const handleHintUsed = () => {
    setProgress((p) => revealHint(p, station.id, station.hints.length));
  };

  const handleReset = () => {
    if (window.confirm('Wirklich von vorn beginnen? Der gesamte Fortschritt geht verloren.')) {
      answers.reset();
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

      <p className="score" aria-live="polite">{score} Punkte</p>

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
          blockedUntil={blockedUntil}
          cooldownSeconds={cooldownSeconds}
          pending={answers.isPending(station.id)}
          onAttempt={handleAttempt}
          onSolved={handleSolved}
          onNext={handleNext}
          onHintUsed={handleHintUsed}
        />
      )}
      {progress.finishedAt !== null && progress.startedAt !== null && (
        <section className="scorecard" aria-labelledby="scorecard-title">
          <h2 id="scorecard-title">Eure Wertung</h2>
          <p className="final-score">{score} Punkte</p>
          <dl>
            <div><dt>Spieldauer</dt><dd>{formatDuration(progress.finishedAt - progress.startedAt)}</dd></div>
            <div><dt>Hinweise</dt><dd>{Object.values(progress.hintsUsed).reduce((sum, n) => sum + n, 0)}</dd></div>
            <div><dt>Fehlversuche</dt><dd>{Object.values(progress.wrongAttempts).reduce((sum, n) => sum + n, 0)}</dd></div>
          </dl>
          <h3>Notfall-Auflösungen</h3>
          {progress.emergencySolved.length === 0 ? <p>Keine – alle Stationen selbst gelöst!</p> : (
            <ul>{stations.filter((s) => progress.emergencySolved.includes(s.id)).map((s) => <li key={s.id}>{s.name}</li>)}</ul>
          )}
        </section>
      )}
    </div>
  );
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours > 0 ? `${hours} Std. ` : ''}${minutes} Min. ${seconds % 60} Sek.`;
}
