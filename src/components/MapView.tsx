import { useEffect, useRef } from 'react';
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

export default function MapView({ stations, currentIndex, solvedIds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layer = L.layerGroup().addTo(map);
    const visible: L.LatLngExpression[] = [];

    stations.forEach((station, i) => {
      const solved = solvedIds.includes(station.id);
      const isCurrent = i === currentIndex;
      // Noch nicht erreichte Stationen bleiben verborgen – keine Spoiler.
      if (!solved && !isCurrent) return;
      // Finale teilt sich die Koordinaten mit der Aasee-Station.
      const pos: L.LatLngExpression = [station.coords.lat, station.coords.lng];
      visible.push(pos);
      L.marker(pos, { icon: makeIcon(isCurrent && !solved ? 'current' : 'done') })
        .addTo(layer)
        .bindPopup(`<strong>${station.label}</strong><br>${station.name}`);
    });

    if (visible.length === 1) {
      map.setView(visible[0], 16);
    } else if (visible.length > 1) {
      map.fitBounds(L.latLngBounds(visible), { padding: [40, 40] });
    }

    return () => {
      layer.remove();
    };
  }, [stations, currentIndex, solvedIds]);

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" />
      <p className="map-note">
        Die Karte zeigt nur bereits erreichte Stationen und euer aktuelles Ziel – keine Spoiler!
      </p>
    </div>
  );
}
