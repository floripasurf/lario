import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { cpf, email, phone, creci_number } = body as {
    cpf?: string;
    email?: string;
    phone?: string;
    creci_number?: string;
  };

  const supabase = createAdminClient();
  const conflicts: string[] = [];

  const checks = [];

  if (cpf) {
    checks.push(
      supabase.from('profiles').select('id').eq('cpf', cpf.replace(/\D/g, '')).limit(1).single()
        .then(({ data }) => { if (data) conflicts.push('cpf'); })
    );
  }

  if (email) {
    checks.push(
      supabase.from('profiles').select('id').eq('email', email.toLowerCase().trim()).limit(1).single()
        .then(({ data }) => { if (data) conflicts.push('email'); })
    );
  }

  if (phone) {
    const formatted = phone.startsWith('+55') ? phone : `+55${phone.replace(/\D/g, '')}`;
    checks.push(
      supabase.from('profiles').select('id').eq('phone', formatted).limit(1).single()
        .then(({ data }) => { if (data) conflicts.push('phone'); })
    );
  }

  if (creci_number) {
    checks.push(
      supabase.from('profiles').select('id').eq('creci_number', creci_number.trim()).limit(1).single()
        .then(({ data }) => { if (data) conflicts.push('creci_number'); })
    );
  }

  await Promise.all(checks);

  if (conflicts.length > 0) {
    const LABELS: Record<string, string> = {
      cpf: 'CPF',
      email: 'e-mail',
      phone: 'telefone',
      creci_number: 'CRECI',
    };
    const names = conflicts.map(c => LABELS[c] || c).join(', ');
    return NextResponse.json(
      { conflicts, message: `Já existe uma conta com este ${names}. Faça login para acessar sua conta.` },
      { status: 409 }
    );
  }

  return NextResponse.json({ conflicts: [], message: 'ok' });
}
