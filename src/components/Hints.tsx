interface Props {
  hints: string[];
  used: number;
  onReveal: () => void;
}

export default function Hints({ hints, used, onReveal }: Props) {
  const revealed = hints.slice(0, used);
  const remaining = hints.length - used;

  return (
    <section className="hints">
      <h3>💡 Hinweise</h3>
      {revealed.length === 0 && (
        <p className="hints-empty">
          Ihr steckt fest? Deckt nach und nach bis zu {hints.length} Hinweise auf – vom sanften
          Schubs bis fast zur Lösung.
        </p>
      )}
      <ol>
        {revealed.map((hint, i) => (
          <li key={i}>{hint}</li>
        ))}
      </ol>
      {remaining > 0 && (
        <button className="secondary" onClick={onReveal}>
          Hinweis {used + 1} von {hints.length} aufdecken
        </button>
      )}
    </section>
  );
}
