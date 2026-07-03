import { useEffect, useRef, useState } from 'react';
import type { GeoTask as GeoTaskData } from '../data/stations';
import { distanceMeters, bearingLabel } from '../lib/geo';
import { checkAnswer } from '../lib/answers';

interface Props {
  task: GeoTaskData;
  onSolved: () => void;
}

export default function GeoTask({ task, onSolved }: Props) {
  const [watching, setWatching] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [direction, setDirection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackInput, setFallbackInput] = useState('');
  const [fallbackWrong, setFallbackWrong] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const solvedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const startWatching = () => {
    if (!('geolocation' in navigator)) {
      setError('Euer Browser unterstützt keine Standortabfrage.');
      return;
    }
    setError(null);
    setWatching(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const dist = distanceMeters(here, task.target);
        setDistance(dist);
        setDirection(bearingLabel(here, task.target));
        if (dist <= task.radiusMeters && !solvedRef.current) {
          solvedRef.current = true;
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          onSolved();
        }
      },
      (err) => {
        setWatching(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Standortzugriff wurde abgelehnt. Erlaubt ihn in den Browser-Einstellungen oder nutzt das Codewort.'
            : 'Standort konnte nicht ermittelt werden. Versucht es im Freien erneut oder nutzt das Codewort.',
        );
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );
  };

  const submitFallback = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await checkAnswer(fallbackInput, task.fallbackHashes);
    if (ok) {
      onSolved();
    } else {
      setFallbackWrong(true);
    }
  };

  const warmth =
    distance === null
      ? null
      : distance <= task.radiusMeters * 2
        ? '🔥 Ganz heiß!'
        : distance <= 150
          ? '♨️ Heiß'
          : distance <= 400
            ? '🌤️ Warm'
            : '❄️ Kalt';

  return (
    <section className="task">
      <h3>📍 GPS-Suche</h3>
      <p>{task.description}</p>

      {!watching && distance === null && (
        <button className="primary" onClick={startWatching}>
          Ortung starten
        </button>
      )}

      {watching && (
        <div className="geo-status">
          {distance === null ? (
            <p>Warte auf GPS-Signal …</p>
          ) : (
            <>
              <div className="geo-distance">{Math.round(distance)} m</div>
              <div className="geo-warmth">
                {warmth} · Richtung: {direction}
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="wrong">{error}</p>}

      <button className="linklike" onClick={() => setShowFallback((v) => !v)}>
        GPS funktioniert nicht?
      </button>
      {showFallback && (
        <form onSubmit={submitFallback} className="answer-form">
          <p className="fallback-hint">{task.fallbackHint}</p>
          <input
            type="text"
            value={fallbackInput}
            onChange={(e) => {
              setFallbackInput(e.target.value);
              setFallbackWrong(false);
            }}
            placeholder="Codewort"
            autoComplete="off"
          />
          <button type="submit" className="primary">
            Prüfen
          </button>
          {fallbackWrong && <p className="wrong">Falsches Codewort.</p>}
        </form>
      )}
    </section>
  );
}
