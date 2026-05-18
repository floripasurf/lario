import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all listings owned by this user
  const { data: listings } = await supabase
    .from('listings')
    .select('id')
    .eq('owner_id', user.id);

  if (!listings || listings.length === 0) {
    return NextResponse.json({ data: {} });
  }

  const listingIds = listings.map(l => l.id);

  // Get lead counts per listing
  const { data: clicks } = await supabase
    .from('lead_clicks')
    .select('listing_id, clicked_at')
    .in('listing_id', listingIds);

  if (!clicks) {
    return NextResponse.json({ data: {} });
  }

  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const counts: Record<string, { total_leads: number; leads_7d: number; leads_30d: number }> = {};

  for (const click of clicks) {
    if (!counts[click.listing_id]) {
      counts[click.listing_id] = { total_leads: 0, leads_7d: 0, leads_30d: 0 };
    }
    counts[click.listing_id].total_leads++;
    const clickDate = new Date(click.clicked_at);
    if (clickDate >= d7) counts[click.listing_id].leads_7d++;
    if (clickDate >= d30) counts[click.listing_id].leads_30d++;
  }

  return NextResponse.json({ data: counts });
}
