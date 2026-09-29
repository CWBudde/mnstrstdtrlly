import { useEffect, useRef, useState } from 'react';
import type { QuizTask as QuizTaskData } from '../data/stations';
import { normalizeAnswer } from '../lib/answers';
import Glyph from './Glyph';

interface Props {
  task: QuizTaskData;
  blockedUntil: number;
  pending: boolean;
  onAttempt: (input: string) => Promise<boolean | null>;
}

export default function QuizTask({ task, blockedUntil, pending, onAttempt }: Props) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'checking' | 'error'>('idle');
  const submitting = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const blocked = blockedUntil > Date.now();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!normalizeAnswer(input) || pending || submitting.current || blockedUntil > Date.now()) return;
    submitting.current = true;
    setFeedback('checking');
    try {
      const ok = await onAttempt(input);
      if (!mounted.current) return;
      if (ok === false) setFeedback('wrong');
    } catch {
      if (mounted.current) setFeedback('error');
    } finally {
      submitting.current = false;
      if (mounted.current) setFeedback((value) => value === 'checking' ? 'idle' : value);
    }
  };

  return (
    <section className="task">
      <h3><Glyph kind="key" /> Eure Aufgabe</h3>
      <p>{task.question}</p>
      <form onSubmit={submit} className="answer-form">
        <label className="input-label" htmlFor="quiz-answer">Eure Antwort</label>
        <input id="quiz-answer" type="text" value={input}
          onChange={(event) => { setInput(event.target.value); if (feedback !== 'checking') setFeedback('idle'); }}
          placeholder={task.placeholder} autoComplete="off" autoCapitalize="off" enterKeyHint="done"
          disabled={blocked || pending || feedback === 'checking'} />
        <button type="submit" className="primary" disabled={blocked || pending || feedback === 'checking' || !normalizeAnswer(input)}>
          {pending || feedback === 'checking' ? 'Wird geprüft …' : 'Prüfen'}
        </button>
      </form>
      {feedback === 'wrong' && <p className="wrong" role="alert">Das ist leider nicht die richtige Antwort. Schaut noch einmal genau hin – oder nehmt einen Hinweis.</p>}
      {feedback === 'error' && <p className="wrong" role="alert">Die Antwort konnte nicht geprüft werden. Versucht es erneut.</p>}
    </section>
  );
}
