/**
 * Antworten werden normalisiert (Kleinschreibung, Umlaute ausgeschrieben,
 * alles außer a-z/0-9 entfernt) und als SHA-256-Hash mit den hinterlegten
 * Hashes verglichen. So stehen die Lösungen nicht im Klartext im Bundle.
 */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export async function sha256Hex(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function checkAnswer(input: string, answerHashes: string[]): Promise<boolean> {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;
  const hash = await sha256Hex(normalized);
  return answerHashes.includes(hash);
}
