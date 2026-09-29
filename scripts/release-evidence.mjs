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
  const hasFile = (path, photo = false) => {
    if (typeof path !== 'string' || !path.startsWith('docs/evidence/') || path.includes('..') || path.includes('\\')) return false;
    try {
      const contents = readFile(path);
      if (!contents?.length) return false;
      if (!photo) return contents.toString('utf8').trim().length > 0;
      return contents.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) ||
        contents.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex')) ||
        (contents.subarray(0, 4).toString() === 'RIFF' && contents.subarray(8, 12).toString() === 'WEBP');
    } catch { return false; }
  };
  const checkReport = (report, name) => {
    if (!object(report) || !dateValid(report.date) || !hasFile(report.report)) errors.push(`${name}: datierter Begehungs-/Testbericht fehlt.`);
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
  for (const id of stationIds) {
    const record = object(records[id]) ? records[id] : {};
    if (!dateValid(record.date) || !hasFile(record.photo, true)) errors.push(`${id}: datiertes Begehungsfoto fehlt.`);
    if (record.answerVerified !== true || record.coordsVerified !== true || record.accessVerified !== true) errors.push(`${id}: Antwort, Koordinate oder Zugänglichkeit nicht vor Ort bestätigt.`);
    if (id === 'briefkasten' && record.gpsTested !== true) errors.push(`${id}: GPS-Empfang muss vor Ort getestet sein.`);
  }
  return errors;
}
