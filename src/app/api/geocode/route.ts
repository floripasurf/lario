import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { geocodeAddress } from '@/lib/geocoding/nominatim';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  if (!query || query.length < 3) {
    return NextResponse.json({ error: 'Query deve ter pelo menos 3 caracteres' }, { status: 400 });
  }

  const normalized = query.trim().toLowerCase();
  const admin = createAdminClient();

  // Check cache
  const { data: cached } = await admin
    .from('geocoding_cache')
    .select('*')
    .eq('query_normalized', normalized)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    return NextResponse.json({
      data: {
        lat: cached.lat,
        lng: cached.lng,
        displayName: cached.display_name,
        address: cached.address_data,
      },
    });
  }

  // Fetch from Nominatim
  const result = await geocodeAddress(query);
  if (!result) {
    return NextResponse.json({ error: 'Endereço não encontrado' }, { status: 404 });
  }

  // Cache result
  await admin.from('geocoding_cache').upsert({
    query_normalized: normalized,
    lat: result.lat,
    lng: result.lng,
    display_name: result.displayName,
    address_data: result.address,
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'query_normalized' });

  return NextResponse.json({ data: result });
}
