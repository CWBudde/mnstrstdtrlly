import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { stations } from '../src/data/stations.ts';
import { validateReleaseEvidence } from './release-evidence.mjs';

const root = new URL('../', import.meta.url);
const evidence = JSON.parse(readFileSync(new URL('docs/evidence/field-verification.json', root), 'utf8'));
const errors = validateReleaseEvidence(evidence, {
  stationIds: stations.map(station => station.id),
  readFile: path => readFileSync(fileURLToPath(new URL(path, root))),
});
if (errors.length) {
  console.error('Nicht zur Veröffentlichung freigegeben:\n' + errors.map(error => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Begehungsnachweise und Blindtest für alle Stationen vollständig.');
}
