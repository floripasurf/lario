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
    <div className="container mx-auto px-4 py-8 max-w-lg animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
      <p className="text-muted-foreground mb-8">Gerencie suas informacoes pessoais</p>

      {/* Avatar / Identity section */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-muted/30 rounded-2xl border border-border/50">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10 shrink-0">
          <span className="text-xl font-bold text-primary">
            {(form.full_name || 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-lg truncate">{form.full_name || 'Usuario'}</p>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
        </div>
        {profile?.user_type === 'corretor' && (
          <Badge variant="outline" className="ml-auto shrink-0">
            <Shield className="h-3 w-3 mr-1" />
            {profile.creci_verified ? 'Verificado' : 'Pendente'}
          </Badge>
        )}
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Nome completo</Label>
            <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">CPF <span className="text-xs text-muted-foreground font-normal">(nao editavel)</span></Label>
            <Input value={profile?.cpf || ''} disabled className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(48) 99999-0000" />
          </div>

          {profile?.user_type === 'corretor' && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-4">Dados profissionais</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CRECI</Label>
                  <Input value={profile.creci_number || ''} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Estado CRECI</Label>
                  <Input value={profile.creci_state || ''} disabled className="bg-muted/50" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving} className="w-full h-11">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : 'Salvar alteracoes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
