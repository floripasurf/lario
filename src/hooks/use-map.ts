'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '@/lib/maplibre/config';

interface UseMapOptions {
  container: HTMLElement | null;
  styleUrl: string;
  center?: [number, number];
  zoom?: number;
  onMoveEnd?: (center: { lat: number; lng: number }, zoom: number) => void;
  onClick?: (lat: number, lng: number) => void;
}

export function useMap({ container, styleUrl, center, zoom, onMoveEnd, onClick }: UseMapOptions) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!container || !styleUrl || mapRef.current) return;

    const map = new maplibregl.Map({
      container,
      style: styleUrl,
      center: center || DEFAULT_CENTER,
      zoom: zoom || DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      attributionControl: {},
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      setLoaded(true);
    });

    if (onMoveEnd) {
      map.on('moveend', () => {
        const c = map.getCenter();
        onMoveEnd({ lat: c.lat, lng: c.lng }, map.getZoom());
      });
    }

    if (onClick) {
      map.on('click', (e) => {
        onClick(e.lngLat.lat, e.lngLat.lng);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setLoaded(false);
    };
  }, [container, styleUrl]);

  const flyTo = useCallback((lat: number, lng: number, z?: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: z || 14 });
  }, []);

  const fitBounds = useCallback((bounds: [[number, number], [number, number]], padding = 50) => {
    mapRef.current?.fitBounds(bounds, { padding });
  }, []);

  return { map: mapRef.current, loaded, flyTo, fitBounds };
}
