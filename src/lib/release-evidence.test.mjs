import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { normalize } from 'node:path';
import { validateReleaseEvidence } from '../../scripts/release-evidence.mjs';

const now = new Date('2026-09-29T12:00:00Z');
// Small, complete images generated with Pillow; not field evidence.
const images = Object.fromEntries(['png', 'jpeg', 'webp'].map(format =>
  [format, readFileSync(new URL(`../../tests/fixtures/evidence/valid.${format}`, import.meta.url))]));
const image = images.png;
const readFile = path => {
  if (['docs/evidence/visit.png', 'docs/evidence/aasee.png'].includes(path)) return image;
  if (['docs/evidence/walk-1.md', 'docs/evidence/walk-2.md', 'docs/evidence/blind-test.md'].includes(path)) return Buffer.from('Field report with observation notes and GPS measurements.');
  throw new Error('missing file');
};
function evidence() {
  return {
    version: 'rally-v3',
    firstWalk: { date: '2026-09-29', report: 'docs/evidence/walk-1.md' },
    secondWalk: { date: '2026-09-29', report: 'docs/evidence/walk-2.md' },
    blindTest: { date: '2026-09-29', report: 'docs/evidence/blind-test.md', durationMinutes: 145,
      emergencySolves: 1, remotelySolvableStations: [] },
    stations: { briefkasten: { date: '2026-09-29', photo: 'docs/evidence/visit.png',
      answerVerified: true, coordsVerified: true, accessVerified: true, gpsTested: true } },
  };
}
const options = { stationIds: ['briefkasten'], readFile, now };

describe('field evidence release gate', () => {
  it('accepts complete dated evidence for the current route', () => {
    expect(validateReleaseEvidence(evidence(), options)).toEqual([]);
  });
  it.each(['secondWalk', 'blindTest'])('rejects reusing the first walk report for %s', report => {
    const value = evidence(); value[report].report = value.firstWalk.report;
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
  });
  it('rejects reusing the second walk report for the blind test', () => {
    const value = evidence(); value.blindTest.report = value.secondWalk.report;
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
  });
  it('accepts distinct photo paths for different stations', () => {
    const value = evidence();
    value.stations.aasee = { ...value.stations.briefkasten, photo: 'docs/evidence/aasee.png' };
    expect(validateReleaseEvidence(value, { ...options, stationIds: ['briefkasten', 'aasee'] })).toEqual([]);
  });
  it('rejects using the same photograph for two stations', () => {
    const value = evidence(); value.stations.aasee = { ...value.stations.briefkasten };
    expect(validateReleaseEvidence(value, { ...options, stationIds: ['briefkasten', 'aasee'] }).length).toBeGreaterThan(0);
  });
  // Match verify-release.mjs: URL resolution can make different spellings read one file.
  it.each(['/walk-1.md', './walk-1.md', 'walk-1.md#blind-test', 'walk-1.md?walk=2', '%77alk-1.md'])
    ('rejects a reused report through URL alias %s', alias => {
      const value = evidence(); value.blindTest.report = `docs/evidence/${alias}`;
      expect(validateReleaseEvidence(value, { ...options, readFile: path =>
        readFile(normalize(fileURLToPath(new URL(path, 'file:///'))).slice(1)) }).length).toBeGreaterThan(0);
    });
  it.each(['/visit.png', './visit.png', 'visit.png#second-station', 'visit.png?station=2', '%76isit.png'])
    ('rejects a reused photo through URL alias %s', alias => {
      const value = evidence();
      value.stations.aasee = { ...value.stations.briefkasten, photo: `docs/evidence/${alias}` };
      expect(validateReleaseEvidence(value, { ...options, stationIds: ['briefkasten', 'aasee'],
        readFile: path => readFile(normalize(fileURLToPath(new URL(path, 'file:///'))).slice(1)) }).length).toBeGreaterThan(0);
    });
  it.each(['png', 'jpeg', 'webp'])('accepts a complete %s photograph', format => {
    expect(validateReleaseEvidence(evidence(), { ...options, readFile: path =>
      path === 'docs/evidence/visit.png' ? images[format] : readFile(path) })).toEqual([]);
  });
  it.each([
    ['PNG', Buffer.from('89504e470d0a1a0a', 'hex')],
    ['JPEG', Buffer.from('ffd8ff', 'hex')],
    ['WebP', Buffer.from('524946460400000057454250', 'hex')],
  ])('rejects a %s signature without an image', (_format, bytes) => {
    expect(validateReleaseEvidence(evidence(), { ...options, readFile: path =>
      path === 'docs/evidence/visit.png' ? bytes : readFile(path) }).length).toBeGreaterThan(0);
  });
  it.each(['png', 'jpeg', 'webp'])('rejects a truncated %s photograph', format => {
    expect(validateReleaseEvidence(evidence(), { ...options, readFile: path =>
      path === 'docs/evidence/visit.png' ? images[format].subarray(0, -1) : readFile(path) }).length).toBeGreaterThan(0);
  });
  it.each([null, {}, { version:'rally-v2' }])('rejects absent or obsolete field evidence', value => {
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
  });
  it('requires station photographs and tested public GPS access, not just a report', () => {
    const value = evidence(); value.stations.briefkasten.gpsTested = false;
    value.stations.briefkasten.photo = 'docs/evidence/remote-reference.jpg';
    expect(validateReleaseEvidence(value, options).join(' ')).toMatch(/briefkasten/);
  });
  it.each(['2026-02-30','2027-01-01','yesterday'])('rejects invalid or future dates: %s', date => {
    const value = evidence(); value.stations.briefkasten.date = date;
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
  });
  it('rejects an incomplete blind test and out-of-target results', () => {
    const value = evidence(); value.blindTest.durationMinutes = 60;
    value.blindTest.emergencySolves = 3;
    value.blindTest.remotelySolvableStations = ['briefkasten'];
    expect(validateReleaseEvidence(value, options).join(' ')).toMatch(/Blindtest/);
  });
  it('requires evidence for every current station and safely handles malformed structures', () => {
    const value = evidence(); value.stations = [];
    expect(validateReleaseEvidence(value, {...options, stationIds:['aasee','briefkasten']}).join(' ')).toMatch(/aasee/);
  });
  it('rejects links outside the evidence directory and non-image photo bytes', () => {
    const value = evidence(); value.stations.briefkasten.photo = '../private.jpg';
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
    value.stations.briefkasten.photo = 'docs/evidence/walk-1.md';
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
  });
});
