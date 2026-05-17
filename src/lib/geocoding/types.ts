export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}
