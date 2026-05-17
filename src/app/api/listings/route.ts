import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ListingService } from '@/domains/listing/service';
import { createListingSchema, listingFiltersSchema } from '@/domains/listing/schemas';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const service = new ListingService(supabase);
  const searchParams = request.nextUrl.searchParams;

  const filters = listingFiltersSchema.parse({
    transaction_type: searchParams.get('transaction_type') || undefined,
    property_type: searchParams.get('property_type') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
  });

  const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
  const offset = Number(searchParams.get('offset') || 0);

  const listings = await service.list(filters, limit, offset);
  return NextResponse.json({ data: listings });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const service = new ListingService(supabase);

  try {
    const listing = await service.create(user.id, parsed.data);
    return NextResponse.json({ data: listing }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
