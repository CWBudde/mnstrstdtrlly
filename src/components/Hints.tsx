import Glyph from './Glyph';

interface Props {
  hints: string[];
  used: number;
  onReveal: () => void;
}

export default function Hints({ hints, used, onReveal }: Props) {
  const count = Math.max(0, Math.min(used, hints.length));
  const revealed = hints.slice(0, count);
  const remaining = hints.length - count;

  return (
    <section className="hints">
      <h3><Glyph kind="light" /> Hinweise</h3>
      {revealed.length === 0 && (
        <p className="hints-empty">
          Ihr steckt fest? Deckt nach und nach bis zu {hints.length} Hinweise auf – vom sanften
          Schubs bis zu einem deutlichen Wink. Die Lösung selbst verraten sie nicht.
        </p>
      )}
      <ol>
        {revealed.map((hint, i) => (
          <li key={i}>{hint}</li>
        ))}
      </ol>
      {remaining > 0 && (
        <button className="secondary" onClick={onReveal}>
          Hinweis {count + 1} von {hints.length} aufdecken (−25 Punkte)
        </button>
      )}
    </section>
  );
}
