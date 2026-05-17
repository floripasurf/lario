'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OtpInput } from '@/components/auth/otp-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function VerifyContent() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const redirect = searchParams.get('redirect') || '/';
  const isRegister = searchParams.get('register') === 'true';
  const supabase = createClient();

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError('');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    // If registering, create profile
    if (isRegister) {
      const stored = sessionStorage.getItem('register_data');
      if (stored) {
        const data = JSON.parse(stored);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: data.full_name,
            cpf: data.cpf,
            phone: data.phone,
            user_type: data.user_type,
            creci_number: data.creci_number || null,
            creci_state: data.creci_state || null,
          });
        }
        sessionStorage.removeItem('register_data');
      }
    }

    router.push(redirect);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Verificar codigo</CardTitle>
        <CardDescription>
          Digite o codigo enviado para {phone}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OtpInput onComplete={handleVerify} />
        {loading && <p className="text-center text-sm text-muted-foreground">Verificando...</p>}
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div>Carregando...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
