import { intro } from '../data/stations';
import StationImage from './StationImage';
import Glyph from './Glyph';

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="app start">
      <div className="start-card">
        <div className="start-seal"><Glyph kind="letter" /></div>
        <p className="eyebrow">Münster · Eine Spur durch die Zeit</p>
        <h1>{intro.title}</h1>
        <p className="subtitle">{intro.subtitle}</p>
        <div className="start-motifs" aria-hidden="true">
          <span><Glyph kind="compass" /> Stadt entdecken</span>
          <span><Glyph kind="key" /> Rätsel lösen</span>
        </div>
        <StationImage image={intro.image} />
        <div className="practical draft-note" role="note" aria-label="Entwurfsstand">
          <strong>Vorschau – noch nicht vor Ort geprüft</strong>
          <p>Begehungen und unabhängiger Blindtest stehen aus. Rätseldetails, Zugänglichkeit und Spieldauer sind noch nicht bestätigt.</p>
        </div>
        {intro.text.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <div className="practical">
          <strong>Bevor es losgeht</strong>
          <p>{intro.practical}</p>
        </div>
        <button className="primary" onClick={onStart}>
          Die Spur aufnehmen
        </button>
      </div>
    </div>
  );
}
