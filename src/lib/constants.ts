export const APP_NAME = 'Lario';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lario.com.br';
export const DEFAULT_SEARCH_RADIUS_KM = 2;
export const MAX_SEARCH_RADIUS_KM = 50;
export const AUTO_EXPAND_RADII_KM = [2, 5, 10];
export const LOCATION_JITTER_METERS = 200;
export const MAX_PHOTOS_PER_LISTING = 20;
export const PHOTO_MAX_SIZE_MB = 5;
export const GEOCODING_CACHE_TTL_DAYS = 90;
export const LISTING_REVALIDATE_SECONDS = 3600;
// Success fee progressiva — tabela real em pricing-preview.tsx
// Esta constante é usada apenas como fallback genérico no calculator
export const SUCCESS_FEE_PERCENTAGE = 1.5;
export const NOMINATIM_BASE_URL = process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
export const NOMINATIM_USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'lario-com-br/1.0';

export const PROPERTY_TYPES = [
  'apartamento', 'casa', 'cobertura', 'terreno', 'sala_comercial',
  'loja', 'galpao', 'sitio', 'chacara', 'fazenda'
] as const;

export const TRANSACTION_TYPES = ['venda', 'aluguel'] as const;
export const LISTING_STATUSES = ['draft', 'active', 'paused', 'sold', 'rented', 'expired'] as const;
export const USER_TYPES = ['pf', 'corretor'] as const;
export const TRANSACTION_STATUSES = ['declared', 'confirmed', 'invoiced', 'paid'] as const;

export const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
] as const;
