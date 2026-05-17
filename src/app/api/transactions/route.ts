import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TransactionService } from '@/domains/transaction/service';
import { ListingService } from '@/domains/listing/service';
import { declareTransactionSchema } from '@/domains/transaction/schemas';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const service = new TransactionService(supabase);
  const transactions = await service.getBySeller(user.id);
  return NextResponse.json({ data: transactions });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = declareTransactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Verify user owns the listing
  const listingService = new ListingService(supabase);
  const listing = await listingService.getById(parsed.data.listing_id);

  if (!listing || listing.owner_id !== user.id) {
    return NextResponse.json({ error: 'Imóvel não encontrado ou não autorizado' }, { status: 403 });
  }

  const transactionService = new TransactionService(supabase);

  try {
    const transaction = await transactionService.declare(user.id, parsed.data);
    // Update listing status
    await listingService.update(parsed.data.listing_id, user.id, {
      status: listing.transaction_type === 'venda' ? 'sold' : 'rented',
    });
    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
