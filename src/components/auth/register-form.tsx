'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { BRAZILIAN_STATES } from '@/lib/constants';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    phone: '',
    user_type: 'pf' as 'pf' | 'corretor',
    creci_number: '',
    creci_state: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedPhone = formData.phone.startsWith('+55')
      ? formData.phone
      : `+55${formData.phone.replace(/\D/g, '')}`;

    // Send OTP
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        data: {
          full_name: formData.full_name,
          cpf: formData.cpf.replace(/\D/g, ''),
          user_type: formData.user_type,
          creci_number: formData.creci_number || null,
          creci_state: formData.creci_state || null,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Store registration data for after verification
    sessionStorage.setItem('register_data', JSON.stringify({
      ...formData,
      phone: formattedPhone,
      cpf: formData.cpf.replace(/\D/g, ''),
    }));

    router.push(`/verify?phone=${encodeURIComponent(formattedPhone)}&register=true`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>Cadastre-se gratuitamente para anunciar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome completo</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 border rounded-md bg-muted text-sm">+55</span>
              <Input
                id="phone"
                type="tel"
                placeholder="(48) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de conta</Label>
            <Select
              value={formData.user_type}
              onValueChange={(v) => { if (v) setFormData({ ...formData, user_type: v as 'pf' | 'corretor' }); }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pf">Pessoa Fisica</SelectItem>
                <SelectItem value="corretor">Corretor de Imoveis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.user_type === 'corretor' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creci_number">CRECI</Label>
                <Input
                  id="creci_number"
                  value={formData.creci_number}
                  onChange={(e) => setFormData({ ...formData, creci_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.creci_state}
                  onValueChange={(v) => { if (v) setFormData({ ...formData, creci_state: v }); }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Criar conta'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Ja tem conta?{' '}
            <Link href="/login" className="text-primary underline">Entrar</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
