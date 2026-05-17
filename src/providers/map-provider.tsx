'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface MapContextType {
  styleUrl: string;
}

const MapContext = createContext<MapContextType>({
  styleUrl: '',
});

export function MapProvider({ children }: { children: ReactNode }) {
  const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY || ''}`;

  return (
    <MapContext.Provider value={{ styleUrl }}>
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);
