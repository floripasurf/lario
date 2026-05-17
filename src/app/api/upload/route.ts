import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { filename, contentType } = await request.json();

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'filename e contentType são obrigatórios' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
  }

  const ext = filename.split('.').pop() || 'jpg';
  const path = `${user.id}/${nanoid()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('listings')
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = supabase.storage.from('listings').getPublicUrl(path).data.publicUrl;

  return NextResponse.json({
    data: {
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl,
    },
  });
}
