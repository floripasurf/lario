import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateCRECI } from '@/lib/validation/creci';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { creci_number, creci_state } = await request.json();

  if (!validateCRECI(creci_number, creci_state)) {
    return NextResponse.json({ error: 'CRECI inválido' }, { status: 400 });
  }

  // In v1, just save. Manual verification by admin later.
  const { error } = await supabase
    .from('profiles')
    .update({ creci_number, creci_state, creci_verified: false })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { message: 'CRECI registrado. Verificação pendente.' } });
}
