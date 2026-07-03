import type { Station } from '../data/stations';
import QuizTask from './QuizTask';
import GeoTask from './GeoTask';
import Hints from './Hints';
import StationImage from './StationImage';

interface Props {
  station: Station;
  solved: boolean;
  isLast: boolean;
  hintsUsed: number;
  onSolved: () => void;
  onNext: () => void;
  onHintUsed: () => void;
}

export default function StationScreen({
  station,
  solved,
  isLast,
  hintsUsed,
  onSolved,
  onNext,
  onHintUsed,
}: Props) {
  return (
    <main className="station">
      <div className="station-head">
        <span className="station-label">{station.label}</span>
        <h2>{station.name}</h2>
      </div>

      <section className="directions">
        <strong>🧭 Der Weg:</strong> {station.directions}
      </section>

      {station.image && <StationImage image={station.image} />}

      {station.story.split('\n\n').map((para, i) => (
        <p key={i} className="story" dangerouslySetInnerHTML={{ __html: mdBold(para) }} />
      ))}

      {!solved ? (
        <>
          {station.task.kind === 'quiz' ? (
            <QuizTask task={station.task} onSolved={onSolved} />
          ) : (
            <GeoTask task={station.task} onSolved={onSolved} />
          )}
          <Hints hints={station.hints} used={hintsUsed} onReveal={onHintUsed} />
        </>
      ) : (
        <section className={'resolution' + (isLast ? ' finale' : '')}>
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
