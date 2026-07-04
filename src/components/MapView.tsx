import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Station } from '../data/stations';

interface Props {
  stations: Station[];
  currentIndex: number;
  solvedIds: string[];
}

function makeIcon(kind: 'done' | 'current'): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="map-marker ${kind}">${kind === 'current' ? '✉' : '✓'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

const youIcon = L.divIcon({
  className: '',
  html: '<div class="map-you"><span class="map-you-dot"></span></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function MapView({ stations, currentIndex, solvedIds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [here, setHere] = useState<L.LatLngExpression | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Eigener Standort: laufend aktualisieren, solange die Karte offen ist.
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('Standort wird von diesem Browser nicht unterstützt.');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setGeoError(null);
        setHere([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setGeoError('Standort nicht verfügbar – erlaubt den Zugriff in den Browser-Einstellungen.');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Stationen & Route: bestimmen den sichtbaren Kartenausschnitt.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layer = L.layerGroup().addTo(map);
    const visible: L.LatLngExpression[] = [];
    const routePoints: L.LatLngExpression[] = [];

    stations.forEach((station, i) => {
      const solved = solvedIds.includes(station.id);
      const isCurrent = i === currentIndex;
      // Noch nicht erreichte Stationen bleiben verborgen – keine Spoiler.
      if (!solved && !isCurrent) return;
      const pos: L.LatLngExpression = [station.coords.lat, station.coords.lng];
      visible.push(pos);
      routePoints.push(pos);
      L.marker(pos, { icon: makeIcon(isCurrent && !solved ? 'current' : 'done') })
        .addTo(layer)
        .bindPopup(`<strong>${station.label}</strong><br>${station.name}`);
    });

    // Verbindet den bisher zurückgelegten Weg zwischen den Stationen.
    if (routePoints.length > 1) {
      L.polyline(routePoints, {
        color: '#8b2e2e',
        weight: 3,
        opacity: 0.7,
        dashArray: '2 10',
        lineCap: 'round',
      }).addTo(layer);
    }

    if (visible.length === 1) {
      map.setView(visible[0], 16);
    } else if (visible.length > 1) {
      map.fitBounds(L.latLngBounds(visible), { padding: [40, 40] });
    }

    return () => {
      layer.remove();
    };
  }, [stations, currentIndex, solvedIds]);

  // Eigener Standort: eigener Layer, damit GPS-Updates nicht die Kartenansicht verschieben.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !here) return;
    const marker = L.marker(here, { icon: youIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup('Euer Standort');
    return () => {
      marker.remove();
    };
  }, [here]);

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" />
      <p className="map-note">
        Die Karte zeigt nur bereits erreichte Stationen und euer aktuelles Ziel – keine Spoiler!
        Die gestrichelte Linie verbindet den bisher zurückgelegten Weg, der blaue Punkt ist euer
        aktueller Standort.
      </p>
      {geoError && <p className="map-note map-geo-error">{geoError}</p>}
    </div>
  );
}
