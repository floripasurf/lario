export const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

export const DEFAULT_CENTER: [number, number] = [-48.5482, -27.5954]; // Florianopolis
export const DEFAULT_ZOOM = 13;
export const MIN_ZOOM = 8;
export const MAX_ZOOM = 18;
