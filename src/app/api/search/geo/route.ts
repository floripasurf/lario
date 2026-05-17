import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SearchService } from '@/domains/search/service';
import { geoSearchSchema } from '@/domains/search/schemas';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const parsed = geoSearchSchema.safeParse({
    lat: searchParams.get('lat'),
    lng: searchParams.get('lng'),
    radius_km: searchParams.get('radius') || searchParams.get('radius_km'),
    transaction_type: searchParams.get('transaction_type') || undefined,
    property_type: searchParams.get('property_type') || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined,
    bedrooms: searchParams.get('bedrooms') || undefined,
    bathrooms: searchParams.get('bathrooms') || undefined,
    parking_spots: searchParams.get('parking_spots') || undefined,
    limit: searchParams.get('limit') || undefined,
    offset: searchParams.get('offset') || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const service = new SearchService(supabase);

  try {
    const results = await service.searchGeo(parsed.data);
    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
