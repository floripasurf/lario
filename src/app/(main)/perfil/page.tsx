'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PerfilPage() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/perfil'); return; }
    if (profile) setForm({ full_name: profile.full_name, phone: profile.phone });
  }, [user, profile, authLoading, router]);

  if (authLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/listings', { // TODO: separate profile API
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success('Perfil atualizado');
      else toast.error('Erro ao atualizar perfil');
    } catch { toast.error('Erro ao atualizar'); }
    setSaving(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Dados pessoais
            {profile?.user_type === 'corretor' && (
              <Badge variant="outline" className="ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Corretor {profile.creci_verified ? '(Verificado)' : '(Pendente)'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome completo</Label>
            <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input value={profile?.cpf || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>

          {profile?.user_type === 'corretor' && (
            <>
              <div className="space-y-2">
                <Label>CRECI</Label>
                <Input value={profile.creci_number || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Estado CRECI</Label>
                <Input value={profile.creci_state || ''} disabled />
              </div>
            </>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
