import { useEffect, useRef, useState } from 'react';
import type { SolveMode } from '../lib/game';
import type { Station } from '../data/stations';
import QuizTask from './QuizTask';
import GeoTask from './GeoTask';
import Hints from './Hints';
import StationImage from './StationImage';
import Glyph from './Glyph';

interface Props {
  station: Station;
  solved: boolean;
  isLast: boolean;
  hintsUsed: number;
  blockedUntil: number;
  cooldownSeconds: number;
  onSolved: (mode: SolveMode) => void;
  pending: boolean;
  onAttempt: (input: string) => Promise<boolean | null>;
  onNext: () => void;
  onHintUsed: () => void;
}

export default function StationScreen({
  station,
  solved,
  isLast,
  hintsUsed,
  blockedUntil,
  cooldownSeconds,
  onSolved,
  pending,
  onAttempt,
  onNext,
  onHintUsed,
}: Props) {
  const [confirmEmergency, setConfirmEmergency] = useState(false);
  const emergencyTrigger = useRef<HTMLButtonElement>(null);
  const emergencyConfirm = useRef<HTMLButtonElement>(null);
  const resolutionHeading = useRef<HTMLHeadingElement>(null);
  const previous = useRef({ solved, confirmEmergency });
  const hadCooldown = useRef(cooldownSeconds > 0);
  if (cooldownSeconds > 0) hadCooldown.current = true;

  useEffect(() => {
    if (solved && !previous.current.solved) resolutionHeading.current?.focus();
    else if (!solved && confirmEmergency && !previous.current.confirmEmergency) emergencyConfirm.current?.focus();
    else if (!solved && !confirmEmergency && previous.current.confirmEmergency) emergencyTrigger.current?.focus();
    previous.current = { solved, confirmEmergency };
  }, [solved, confirmEmergency]);
  return (
    <main className="station">
      <div className="station-head">
        <span className="station-label">{station.label}</span>
        <h2>{station.name}</h2>
      </div>

      <section className="directions">
        <strong><Glyph kind="compass" /> Der Weg:</strong> {station.directions}
      </section>

      {station.image && <StationImage image={station.image} />}

      {station.story.split('\n\n').map((para, i) => (
        <p key={i} className="story" dangerouslySetInnerHTML={{ __html: mdBold(para) }} />
      ))}

      {!solved ? (
        <>
          <p className="visually-hidden" role="status">
            {cooldownSeconds > 0 ? 'Nach drei Fehlversuchen pausiert die Antwortprüfung.' : hadCooldown.current ? 'Ihr könnt wieder Antworten prüfen.' : ''}
          </p>
          {cooldownSeconds > 0 && (
            <p className="cooldown">Drei Fehlversuche: Nehmt euch kurz Zeit. In {cooldownSeconds} Sekunden könnt ihr wieder Antworten prüfen.</p>
          )}
          {station.task.kind === 'quiz' ? (
            <QuizTask task={station.task} blockedUntil={blockedUntil} pending={pending} onAttempt={onAttempt} />
          ) : (
            <GeoTask task={station.task} blockedUntil={blockedUntil} pending={pending} onAttempt={onAttempt} onSolved={() => onSolved('gps')} />
          )}
          <Hints hints={station.hints} used={hintsUsed} onReveal={onHintUsed} />
          <section className="emergency">
            <h3>Ort geschlossen oder kein Weiterkommen?</h3>
            {!confirmEmergency ? (
              <button ref={emergencyTrigger} className="secondary" onClick={() => setConfirmEmergency(true)}>Notfall-Auflösen (−100 Punkte)</button>
            ) : (
              <div role="group" aria-label="Notfall-Auflösen bestätigen">
                <p>Diese Station ohne Rätsellösung abschließen? Das kostet 100 Punkte und wird in eurer Wertung vermerkt.</p>
                <div className="emergency-actions">
                  <button ref={emergencyConfirm} className="primary" onClick={() => onSolved('emergency')}>Für 100 Punkte auflösen</button>
                  <button className="secondary" onClick={() => setConfirmEmergency(false)}>Abbrechen</button>
                </div>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className={'resolution' + (isLast ? ' finale' : '')}>
          <h3 ref={resolutionHeading} tabIndex={-1}>{isLast ? 'Die Depesche gefunden!' : 'Station gelöst!'}</h3>
          {isLast && <div className="finale-seal">🕊️</div>}
          {station.resolution.split('\n\n').map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: mdBold(para) }} />
          ))}
          {station.fragment && (
            <div className="fragment-found">
              Fragment gefunden: <span className="fragment">{station.fragment}</span>
            </div>
          )}
          {!isLast && (
            <button className="primary" onClick={onNext}>
              Weiter zur nächsten Station →
            </button>
          )}
        </section>
      )}
    </main>
  );
}

/** Wandelt **fett** in <strong> um; alle übrigen Zeichen werden escaped. */
function mdBold(s: string): string {
  const escaped = s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
