export interface LatLng {
  lat: number;
  lng: number;
}

/** Entfernung zweier Koordinaten in Metern (Haversine). */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Grobe Himmelsrichtung von a nach b, z.B. "Nordwesten". */
export function bearingLabel(a: LatLng, b: LatLng): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(dLng);
  const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const labels = [
    'Norden', 'Nordosten', 'Osten', 'Südosten',
    'Süden', 'Südwesten', 'Westen', 'Nordwesten',
  ];
  return labels[Math.round(deg / 45) % 8];
}
