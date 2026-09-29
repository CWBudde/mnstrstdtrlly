import { useEffect, useRef, useState } from 'react';
import type { GeoTask as GeoTaskData } from '../data/stations';
import { distanceMeters, bearingLabel } from '../lib/geo';
import { normalizeAnswer } from '../lib/answers';

interface Props {
  task: GeoTaskData;
  blockedUntil: number;
  pending: boolean;
  onAttempt: (input: string) => Promise<boolean | null>;
  onSolved: () => void;
}

export default function GeoTask({ task, blockedUntil, pending, onAttempt, onSolved }: Props) {
  const [watching, setWatching] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [direction, setDirection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackInput, setFallbackInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'checking' | 'error'>('idle');
  const watchIdRef = useRef<number | null>(null);
  const startingRef = useRef(false);
  const generationRef = useRef(0);
  const solvedRef = useRef(false);
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);
  const blocked = blockedUntil > Date.now();

  const clearWatch = () => {
    generationRef.current += 1;
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    startingRef.current = false;
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; clearWatch(); };
  }, []);

  const finish = () => {
    if (solvedRef.current || !mountedRef.current) return;
    solvedRef.current = true;
    clearWatch();
    setWatching(false);
    onSolved();
  };

  const startWatching = () => {
    if (watchIdRef.current !== null || startingRef.current || solvedRef.current) return;
    if (!navigator.geolocation) {
      setError('Euer Browser unterstützt keine Standortabfrage. Nutzt das Codewort oder Notfall-Auflösen.');
      return;
    }
    setError(null);
    setWatching(true);
    startingRef.current = true;
    const generation = ++generationRef.current;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!mountedRef.current || generation !== generationRef.current || solvedRef.current) return;
        const here = { lat: position.coords.latitude, lng: position.coords.longitude };
        const dist = distanceMeters(here, task.target);
        setDistance(dist);
        setDirection(bearingLabel(here, task.target));
        if (dist <= task.radiusMeters) finish();
      },
      (failure) => {
        if (!mountedRef.current || generation !== generationRef.current) return;
        clearWatch();
        setWatching(false);
        setError(failure.code === 1
          ? 'Standortzugriff wurde abgelehnt. Erlaubt ihn in den Browser-Einstellungen oder nutzt das Codewort.'
          : 'Standort konnte nicht ermittelt werden. Versucht es im Freien erneut oder nutzt das Codewort.');
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );
    // A browser or test double may deliver an immediate result before returning its watch ID.
    if (generation !== generationRef.current || solvedRef.current || !mountedRef.current) navigator.geolocation.clearWatch(watchId);
    else watchIdRef.current = watchId;
    startingRef.current = false;
  };

  const submitFallback = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!normalizeAnswer(fallbackInput) || pending || pendingRef.current || solvedRef.current || blockedUntil > Date.now()) return;
    pendingRef.current = true;
    setFeedback('checking');
    try {
      const ok = await onAttempt(fallbackInput);
      if (!mountedRef.current || solvedRef.current) return;
      if (ok) { solvedRef.current = true; clearWatch(); setWatching(false); }
      else if (ok === false) setFeedback('wrong');
    } catch {
      if (mountedRef.current) setFeedback('error');
    } finally {
      pendingRef.current = false;
      if (mountedRef.current) setFeedback((value) => value === 'checking' ? 'idle' : value);
    }
  };

  const warmth = distance === null ? null : distance <= task.radiusMeters * 2 ? '🔥 Ganz heiß!' : distance <= 150 ? '♨️ Heiß' : distance <= 400 ? '🌤️ Warm' : '❄️ Kalt';

  return (
    <section className="task">
      <h3>📍 GPS-Suche</h3>
      <p>{task.description}</p>
      {!watching && <button className="primary" onClick={startWatching}>{distance === null ? 'Ortung starten' : 'Ortung erneut starten'}</button>}
      {watching && <div className="geo-status" role="status">
        {distance === null ? <p>Warte auf GPS-Signal …</p> : <><div className="geo-distance">{Math.round(distance)} m</div><div className="geo-warmth">{warmth} · Richtung: {direction}</div></>}
      </div>}
      {error && <p className="wrong" role="alert">{error}</p>}
      <button className="linklike" onClick={() => setShowFallback((value) => !value)} aria-expanded={showFallback}>GPS funktioniert nicht?</button>
      {showFallback && <form onSubmit={submitFallback} className="answer-form">
        <p className="fallback-hint">{task.fallbackHint} Das richtige Codewort löst diese Station als Notfall auf und kostet 100 Punkte.</p>
        <label className="input-label" htmlFor="gps-codeword">Codewort</label>
        <input id="gps-codeword" type="text" value={fallbackInput}
          onChange={(event) => { setFallbackInput(event.target.value); if (feedback !== 'checking') setFeedback('idle'); }}
          placeholder="Codewort" autoComplete="off" autoCapitalize="off" enterKeyHint="done"
          disabled={blocked || pending || feedback === 'checking'} />
        <button type="submit" className="primary" disabled={blocked || pending || feedback === 'checking' || !normalizeAnswer(fallbackInput)}>{pending || feedback === 'checking' ? 'Wird geprüft …' : 'Prüfen'}</button>
        {feedback === 'wrong' && <p className="wrong" role="alert">Falsches Codewort.</p>}
        {feedback === 'error' && <p className="wrong" role="alert">Das Codewort konnte nicht geprüft werden. Versucht es erneut.</p>}
      </form>}
    </section>
  );
}
