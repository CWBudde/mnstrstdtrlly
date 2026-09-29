import { fileURLToPath } from 'node:url';
import { normalize } from 'node:path';

/** Checks recorded human evidence. File validation cannot attest who took a photograph. */
export function validateReleaseEvidence(evidence, { stationIds, readFile, now = new Date() }) {
  const errors = [];
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const value = object(evidence) ? evidence : {};
  const dateValid = date => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date && parsed <= now;
  };
  // Match the file reader, including URL aliases and redundant filesystem separators.
  const evidenceRoot = new URL('../', import.meta.url);
  const canonicalPath = path => normalize(fileURLToPath(new URL(path, evidenceRoot)));
  const hasFile = (path, photo = false) => {
    if (typeof path !== 'string' || !path.startsWith('docs/evidence/') || path.includes('..') || path.includes('\\')) return false;
    try {
      canonicalPath(path); // Validate URL-to-file conversion before using the path as a key.
      const contents = readFile(path);
      if (!contents?.length) return false;
      if (!photo) return contents.toString('utf8').trim().length > 0;
      // Lightweight container checks catch placeholders and interrupted uploads.
      // They do not decode pixels or establish that an image is genuine field evidence.
      if (contents.length >= 58 && contents.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
        return contents.readUInt32BE(8) === 13 && contents.subarray(12, 16).toString() === 'IHDR'
          && contents.readUInt32BE(16) > 0 && contents.readUInt32BE(20) > 0
          && contents.subarray(-12).equals(Buffer.from('0000000049454e44ae426082', 'hex'));
      }
      if (contents.length >= 32 && contents.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'))) {
        return contents.subarray(-2).equals(Buffer.from('ffd9', 'hex'))
          && contents.includes(Buffer.from('ffda', 'hex'));
      }
      if (contents.length >= 30 && contents.subarray(0, 4).toString() === 'RIFF'
        && contents.subarray(8, 12).toString() === 'WEBP') {
        const chunkLength = contents.readUInt32LE(16);
        return contents.readUInt32LE(4) === contents.length - 8
          && ['VP8 ', 'VP8L', 'VP8X'].includes(contents.subarray(12, 16).toString())
          && chunkLength >= 5 && 20 + chunkLength + (chunkLength % 2) <= contents.length;
      }
      return false;
    } catch { return false; }
  };
  const reportPaths = new Set();
  const checkReport = (report, name) => {
    if (!object(report) || !dateValid(report.date) || !hasFile(report.report)) {
      errors.push(`${name}: datierter Begehungs-/Testbericht fehlt.`);
    } else if (reportPaths.has(canonicalPath(report.report))) {
      errors.push(`${name}: eigener Bericht erforderlich; Berichtspfad wird bereits verwendet.`);
    } else {
      reportPaths.add(canonicalPath(report.report));
    }
  };
  if (value.version !== 'rally-v3') errors.push('Nachweise müssen ausdrücklich die aktuelle Rallye v3 betreffen.');
  checkReport(value.firstWalk, 'Begehung 1');
  checkReport(value.secondWalk, 'Begehung 2');
  checkReport(value.blindTest, 'Blindtest');
  const blind = object(value.blindTest) ? value.blindTest : {};
  if (!Number.isFinite(blind.durationMinutes) || blind.durationMinutes < 120 || blind.durationMinutes > 180) errors.push('Blindtest: Dauer muss zwischen 120 und 180 Minuten liegen.');
  if (!Number.isInteger(blind.emergencySolves) || blind.emergencySolves < 0 || blind.emergencySolves > 2) errors.push('Blindtest: höchstens zwei Notfall-Auflösungen zulässig.');
  if (!Array.isArray(blind.remotelySolvableStations) || blind.remotelySolvableStations.length !== 0) errors.push('Blindtest: Ortsbindung aller Stationen noch nicht bestätigt.');
  const records = object(value.stations) ? value.stations : {};
  const photoPaths = new Set();
  for (const id of stationIds) {
    const record = object(records[id]) ? records[id] : {};
    if (!dateValid(record.date) || !hasFile(record.photo, true)) {
      errors.push(`${id}: datiertes Begehungsfoto fehlt.`);
    } else if (photoPaths.has(canonicalPath(record.photo))) {
      errors.push(`${id}: eigenes Begehungsfoto erforderlich; Fotopfad wird bereits verwendet.`);
    } else {
      photoPaths.add(canonicalPath(record.photo));
    }
    if (record.answerVerified !== true || record.coordsVerified !== true || record.accessVerified !== true) errors.push(`${id}: Antwort, Koordinate oder Zugänglichkeit nicht vor Ort bestätigt.`);
    if (id === 'briefkasten' && record.gpsTested !== true) errors.push(`${id}: GPS-Empfang muss vor Ort getestet sein.`);
  }
  return errors;
}
