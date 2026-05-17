import { NOMINATIM_BASE_URL, NOMINATIM_USER_AGENT } from '@/lib/constants';
import type { GeocodingResult } from './types';

export async function geocodeAddress(query: string): Promise<GeocodingResult | null> {
  const url = new URL('/search', NOMINATIM_BASE_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'br');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': NOMINATIM_USER_AGENT },
  });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.length) return null;

  const result = data[0];
  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    displayName: result.display_name,
    address: result.address ? {
      road: result.address.road,
      suburb: result.address.suburb,
      city: result.address.city || result.address.town || result.address.village,
      state: result.address.state,
      postcode: result.address.postcode,
      country: result.address.country,
    } : undefined,
  };
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
  const url = new URL('/reverse', NOMINATIM_BASE_URL);
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lng.toString());
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': NOMINATIM_USER_AGENT },
  });
  if (!res.ok) return null;

  const data = await res.json();
  return {
    lat: parseFloat(data.lat),
    lng: parseFloat(data.lon),
    displayName: data.display_name,
    address: data.address ? {
      road: data.address.road,
      suburb: data.address.suburb,
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      postcode: data.address.postcode,
      country: data.address.country,
    } : undefined,
  };
}
