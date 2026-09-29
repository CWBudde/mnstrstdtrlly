import { describe, expect, it } from 'vitest';
import { distanceMeters, type LatLng } from './geo';
import { stations } from '../data/stations';
import survey from '../../docs/evidence/osm-stations.json';

// A crossing regression, including overlap, must fail even when coordinates change.
function orientation(a: LatLng, b: LatLng, c: LatLng): number {
  return (b.lng - a.lng) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lng - a.lng);
}
function onSegment(a: LatLng, b: LatLng, c: LatLng): boolean {
  return Math.abs(orientation(a, b, c)) < 1e-12 &&
    c.lat >= Math.min(a.lat, b.lat) && c.lat <= Math.max(a.lat, b.lat) &&
    c.lng >= Math.min(a.lng, b.lng) && c.lng <= Math.max(a.lng, b.lng);
}
function intersects(a: LatLng, b: LatLng, c: LatLng, d: LatLng): boolean {
  const abC = orientation(a, b, c), abD = orientation(a, b, d);
  const cdA = orientation(c, d, a), cdB = orientation(c, d, b);
  return (abC * abD < 0 && cdA * cdB < 0) ||
    onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b);
}
function crossings(points: LatLng[]): number {
  let count = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 2; j < points.length - 1; j++) {
      if (intersects(points[i], points[i + 1], points[j], points[j + 1])) count++;
    }
  }
  return count;
}

describe('rally route', () => {
  it('uses the documented OSM extract for every station coordinate', () => {
    expect(Object.keys(survey.stations).sort()).toEqual(stations.map(s => s.id).sort());
    for (const station of stations) {
      expect(station.coords, station.id).toEqual(survey.stations[station.id as keyof typeof survey.stations].coords);
    }
  });
  it('detects crossing and overlapping routes with independent geometry fixtures', () => {
    expect(crossings([{lat:0,lng:0},{lat:1,lng:1},{lat:0,lng:1},{lat:1,lng:0}])).toBe(1);
    expect(crossings([{lat:0,lng:0},{lat:0,lng:2},{lat:0,lng:3},{lat:0,lng:1}])).toBe(1);
    expect(crossings([{lat:0,lng:0},{lat:0,lng:1},{lat:1,lng:1},{lat:1,lng:2}])).toBe(0);
  });
  it('starts at the lake and finishes near the historic Rathaus', () => {
    expect(stations[0].id).toBe('aasee');
    expect(distanceMeters(stations[stations.length - 1].coords, {lat:51.9616002,lng:7.6281828})).toBeLessThan(20);
  });
  it('has no crossings or repeated non-adjacent segments', () => {
    expect(crossings(stations.map(s => s.coords))).toBe(0);
  });
  it('does not skip a closer stop in favour of a detour', () => {
    for (let i = 0; i < stations.length - 2; i++) {
      const here = stations[i];
      expect(distanceMeters(here.coords, stations[i + 1].coords), here.id)
        .toBeLessThanOrEqual(distanceMeters(here.coords, stations[i + 2].coords));
    }
  });
  it('keeps the GPS target consistent with its marker on a mapped public path', () => {
    const station = stations.find(s => s.task.kind === 'geo')!;
    expect(station.task.kind).toBe('geo');
    if (station.task.kind !== 'geo') return;
    expect(station.task.target).toEqual(station.coords);
    expect(distanceMeters(station.coords, {lat:51.9612679,lng:7.6146837})).toBeLessThan(1);
    expect(station.task.radiusMeters).toBeGreaterThan(0);
  });
});
