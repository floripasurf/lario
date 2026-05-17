'use client';

import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '@/lib/maplibre/config';

interface MapContainerProps {
  styleUrl: string;
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    price?: string;
    active?: boolean;
  }>;
  radiusCenter?: { lat: number; lng: number } | null;
  radiusKm?: number;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export function MapContainer({
  styleUrl, center, zoom, markers = [], radiusCenter, radiusKm,
  onMapClick, onMarkerClick, className = 'w-full h-full',
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: center || DEFAULT_CENTER,
      zoom: zoom || DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => setLoaded(true));

    if (onMapClick) {
      map.on('click', (e) => onMapClick(e.lngLat.lat, e.lngLat.lng));
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setLoaded(false);
    };
  }, [styleUrl]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !loaded) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    markers.forEach(({ id, lat, lng, price, active }) => {
      const el = document.createElement('div');
      el.className = `px-2 py-1 rounded-full text-xs font-semibold shadow cursor-pointer whitespace-nowrap ${
        active ? 'bg-primary text-primary-foreground scale-110' : 'bg-white text-foreground border'
      }`;
      el.textContent = price || '';
      el.onclick = (e) => {
        e.stopPropagation();
        onMarkerClick?.(id);
      };

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [markers, loaded, onMarkerClick]);

  // Update radius circle
  useEffect(() => {
    if (!mapRef.current || !loaded) return;
    const map = mapRef.current;
    const sourceId = 'radius-circle';

    if (map.getSource(sourceId)) {
      map.removeLayer('radius-fill');
      map.removeLayer('radius-border');
      map.removeSource(sourceId);
    }

    if (!radiusCenter || !radiusKm) return;

    // Generate circle polygon
    const points = 64;
    const km = radiusKm;
    const coords: [number, number][] = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = km / (111.32 * Math.cos((radiusCenter.lat * Math.PI) / 180));
      const dy = km / 110.574;
      coords.push([
        radiusCenter.lng + dx * Math.cos(angle),
        radiusCenter.lat + dy * Math.sin(angle),
      ]);
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [coords] },
      },
    });

    map.addLayer({
      id: 'radius-fill',
      type: 'fill',
      source: sourceId,
      paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.1 },
    });

    map.addLayer({
      id: 'radius-border',
      type: 'line',
      source: sourceId,
      paint: { 'line-color': '#3b82f6', 'line-width': 2, 'line-dasharray': [2, 2] },
    });
  }, [radiusCenter, radiusKm, loaded]);

  // Fly to center changes
  useEffect(() => {
    if (!mapRef.current || !center) return;
    mapRef.current.flyTo({ center, zoom: zoom || 14 });
  }, [center, zoom]);

  return <div ref={containerRef} className={className} />;
}
