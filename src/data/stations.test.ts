import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { intro, stations, type Station } from './stations';
import { normalizeAnswer } from '../lib/answers';
import { solutions, fallbackCode } from '../../tests/solutions';

const numberWords: Record<string, string> = {
  null: '0', ein: '1', eins: '1', eine: '1', einer: '1', zwei: '2', drei: '3', vier: '4',
  fuenf: '5', sechs: '6', sieben: '7', acht: '8', neun: '9', zehn: '10', elf: '11', zwoelf: '12',
};
function normalizedForms(text: string): string[] {
  const numeric = text.replace(/\b[\p{L}]+\b/gu, word => numberWords[normalizeAnswer(word)] ?? word);
  return [normalizeAnswer(text), normalizeAnswer(numeric)];
}
function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
// Scan inside words as well as tokens. The fixture completeness assertion below ensures
// every registered answer length is covered, including the multiword finale.
function leaks(texts: string[], hashes: string[], lengths = Array.from({length:64}, (_, i) => i + 1)): string[] {
  const accepted = new Set(hashes), found = new Set<string>();
  for (const text of texts) {
    for (const normalized of normalizedForms(text)) {
      for (let start = 0; start < normalized.length; start++) {
        for (const length of lengths) {
          if (length > normalized.length - start) continue;
          const candidate = normalized.slice(start, start + length);
          if (accepted.has(hash(candidate))) found.add(candidate);
        }
      }
    }
  }
  return [...found];
}
function visible(station: Station): string[] {
  return [station.label, station.name, station.directions, station.story, ...station.hints,
    station.image?.alt ?? '', station.image?.credit ?? '',
    ...(station.task.kind === 'quiz'
      ? [station.task.question, station.task.placeholder]
      : [station.task.description, station.task.fallbackHint])];
}

describe('content spoiler protection', () => {
  it('detects historical spoilers, including inside names and spelled-out numbers', () => {
    expect(leaks(['Kiepenkerl', 'wo drei steinerne Kugeln ruhen', 'Codewort: SCHLAUN'],
      ['kiepe', '3', 'schlaun'].map(hash))).toEqual(['kiepe', '3', 'schlaun']);
    expect(leaks(['Die chiffrierten Zeichen: GRO WXBQUI MZMPH'], [hash('paxoptimarerum')])).toEqual([]);
  });
  it('does not expose quiz solutions or the GPS fallback in any text visible before solving', () => {
    const texts = [intro.title, intro.subtitle, intro.text, intro.practical,
      intro.image.alt, intro.image.credit];
    const fragments: string[] = [];
    for (const station of stations) {
      texts.push(...visible(station));
      const hashes = station.task.kind === 'quiz' ? station.task.answerHashes : station.task.fallbackHashes;
      const answers = station.task.kind === 'quiz' ? solutions[station.id] : [fallbackCode];
      expect(hashes, `${station.id}: complete organizer fixtures`).toEqual(answers.map(answer => hash(normalizeAnswer(answer))));
      const lengths = [...new Set(answers.map(answer => normalizeAnswer(answer).length))];
      expect(leaks([...texts, texts.join(' '), fragments.join(' ')], hashes, lengths), station.id).toEqual([]);
      texts.push(station.resolution);
      if (station.fragment) fragments.push(station.fragment);
    }
  }, 30_000);
  it('decodes the finale with the dated codes rather than walking order', () => {
    const datedCodes = stations.filter(s => s.fragment).map(s => {
      const [year, code] = s.fragment!.split(' · ').map(Number);
      return {year, code};
    }).sort((a, b) => a.year - b.year);
    const finale = stations[stations.length - 1];
    const encrypted = finale.story.match(/\*\*([A-Z ]+)\*\*/)?.[1].split(' ') ?? [];
    expect(encrypted).toHaveLength(datedCodes.length);
    const decrypted = encrypted.map((word, index) => [...word].map(letter =>
      String.fromCharCode(65 + (letter.charCodeAt(0) - 65 - datedCodes[index].code + 26) % 26)
    ).join('')).join(' ');
    expect(decrypted).toBe('PAX OPTIMA RERUM');
  });
  it('uses unique station IDs and three staged hints at every stop', () => {
    expect(new Set(stations.map(s => s.id)).size).toBe(stations.length);
    for (const station of stations) expect(station.hints, station.id).toHaveLength(3);
  });
});
