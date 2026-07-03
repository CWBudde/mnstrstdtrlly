import { useState } from 'react';
import type { QuizTask as QuizTaskData } from '../data/stations';
import { checkAnswer } from '../lib/answers';

interface Props {
  task: QuizTaskData;
  onSolved: () => void;
}

export default function QuizTask({ task, onSolved }: Props) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'checking'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || feedback === 'checking') return;
    setFeedback('checking');
    const ok = await checkAnswer(input, task.answerHashes);
    if (ok) {
      onSolved();
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <section className="task">
      <h3>❓ Eure Aufgabe</h3>
      <p>{task.question}</p>
      <form onSubmit={submit} className="answer-form">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (feedback === 'wrong') setFeedback('idle');
          }}
          placeholder={task.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          enterKeyHint="done"
        />
        <button type="submit" className="primary" disabled={feedback === 'checking'}>
          Prüfen
        </button>
      </form>
      {feedback === 'wrong' && (
        <p className="wrong" role="alert">
          Das ist leider nicht die richtige Antwort. Schaut noch einmal genau hin – oder nehmt einen Hinweis.
        </p>
      )}
    </section>
  );
}
