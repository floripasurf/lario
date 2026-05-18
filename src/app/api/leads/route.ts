import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  const { listing_id } = await request.json() as { listing_id: string };

  if (!listing_id) {
    return NextResponse.json({ error: 'listing_id required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Hash IP for privacy (no raw IP stored)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const ipHash = createHash('sha256').update(ip + listing_id).digest('hex').slice(0, 16);
  const userAgent = request.headers.get('user-agent')?.slice(0, 200) || null;

  const { error } = await supabase.from('lead_clicks').insert({
    listing_id,
    ip_hash: ipHash,
    user_agent: userAgent,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
