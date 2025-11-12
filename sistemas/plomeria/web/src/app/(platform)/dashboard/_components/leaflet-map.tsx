'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapJob } from '@/lib/types';
import { ORDER_STATE_CONFIG } from '@/lib/constants';
import { useMemo } from 'react';

const DefaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  jobs: MapJob[];
  fallback: MapJob[];
}

export default function LeafletMap({ jobs, fallback }: LeafletMapProps) {
  const points = jobs.length > 0 ? jobs : fallback;
  const center = useMemo(() => {
    if (points.length === 0) return [19.4326, -99.1332] as [number, number];
    return [points[0].lat, points[0].lng] as [number, number];
  }, [points]);

  if (points.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        No hay trabajos con geolocalización aún.
      </div>
    );
  }

  return (
    <MapContainer center={center} zoom={11} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      {points.map((job) => (
        <Marker key={job.id} position={[job.lat, job.lng]}>
          <Popup>
            <div className="space-y-1 text-sm text-slate-800">
              <p className="font-semibold">{job.address}</p>
              <p>{job.service_type}</p>
              <span
                className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  color: ORDER_STATE_CONFIG[job.status].color,
                  backgroundColor: ORDER_STATE_CONFIG[job.status].bg,
                }}
              >
                {ORDER_STATE_CONFIG[job.status].label}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
