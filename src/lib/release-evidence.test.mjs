import { describe, expect, it } from 'vitest';
import { validateReleaseEvidence } from '../../scripts/release-evidence.mjs';

const now = new Date('2026-09-29T12:00:00Z');
const image = Buffer.from('89504e470d0a1a0a', 'hex');
const readFile = path => {
  if (path === 'docs/evidence/visit.png') return image;
  if (path === 'docs/evidence/report.md') return Buffer.from('Field report with observation notes and GPS measurements.');
  throw new Error('missing file');
};
function evidence() {
  return {
    version: 'rally-v3',
    firstWalk: { date: '2026-09-29', report: 'docs/evidence/report.md' },
    secondWalk: { date: '2026-09-29', report: 'docs/evidence/report.md' },
    blindTest: { date: '2026-09-29', report: 'docs/evidence/report.md', durationMinutes: 145,
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
    value.stations.briefkasten.photo = 'docs/evidence/report.md';
    expect(validateReleaseEvidence(value, options).length).toBeGreaterThan(0);
  });
});
