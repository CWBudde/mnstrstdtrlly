import { intro } from '../data/stations';

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="app start">
      <div className="start-card">
        <div className="start-seal">✉</div>
        <h1>{intro.title}</h1>
        <p className="subtitle">{intro.subtitle}</p>
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
