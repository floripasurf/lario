'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROPERTY_TYPES, TRANSACTION_TYPES, BRAZILIAN_STATES } from '@/lib/constants';
import { toast } from 'sonner';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', cobertura: 'Cobertura',
  terreno: 'Terreno', sala_comercial: 'Sala Comercial', loja: 'Loja',
  galpao: 'Galpão', sitio: 'Sítio', chacara: 'Chácara', fazenda: 'Fazenda',
};

const STEPS = ['Dados', 'Endereço', 'Fotos', 'Descrição', 'Revisar'];

export default function AnunciarPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    transaction_type: 'venda' as const,
    property_type: 'apartamento' as const,
    title: '',
    description: '',
    price: '',
    condo_fee: '',
    iptu: '',
    area_m2: '',
    bedrooms: '0',
    bathrooms: '0',
    parking_spots: '0',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: 'Florianópolis',
    address_state: 'SC',
    address_zip: '',
    features: '',
  });

  const update = (field: string, value: string | null) => { if (value !== null) setForm(prev => ({ ...prev, [field]: value })); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const { data } = await res.json();

        await fetch(data.signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        setPhotos(prev => [...prev, data.publicUrl]);
      } catch {
        toast.error('Erro ao enviar foto');
      }
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Geocode address
    const addressQuery = `${form.address_street}, ${form.address_number}, ${form.address_neighborhood}, ${form.address_city}, ${form.address_state}`;
    let lat = -27.5954, lng = -48.5482;
    try {
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(addressQuery)}`);
      const geoJson = await geoRes.json();
      if (geoJson.data) { lat = geoJson.data.lat; lng = geoJson.data.lng; }
    } catch {}

    const body = {
      transaction_type: form.transaction_type,
      property_type: form.property_type,
      title: form.title,
      description: form.description,
      price_cents: Math.round(parseFloat(form.price) * 100),
      condo_fee_cents: form.condo_fee ? Math.round(parseFloat(form.condo_fee) * 100) : undefined,
      iptu_cents: form.iptu ? Math.round(parseFloat(form.iptu) * 100) : undefined,
      area_m2: parseFloat(form.area_m2),
      bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms),
      parking_spots: parseInt(form.parking_spots),
      address_street: form.address_street,
      address_number: form.address_number,
      address_complement: form.address_complement || undefined,
      address_neighborhood: form.address_neighborhood,
      address_city: form.address_city,
      address_state: form.address_state,
      address_zip: form.address_zip,
      lat, lng,
      photos,
      features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
    };

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(typeof json.error === 'string' ? json.error : 'Erro ao criar anúncio');
        setLoading(false);
        return;
      }

      toast.success('Anúncio criado com sucesso!');
      router.push('/meus-anuncios');
    } catch {
      toast.error('Erro ao criar anúncio');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Faça login para anunciar</h1>
        <Button onClick={() => router.push('/login?redirect=/anunciar')}>Entrar</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Anunciar imóvel</h1>
      <p className="text-muted-foreground mb-8">Grátis para publicar. Você só paga se vender.</p>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex-1 text-center text-xs py-2 rounded ${i === step ? 'bg-primary text-primary-foreground' : i < step ? 'bg-primary/20' : 'bg-muted'}`}>
            {s}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <>
              <CardHeader className="px-0 pt-0"><CardTitle>Dados do imóvel</CardTitle></CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de negócio</Label>
                  <Select value={form.transaction_type} onValueChange={v => update('transaction_type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t === 'venda' ? 'Venda' : 'Aluguel'}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de imóvel</Label>
                  <Select value={form.property_type} onValueChange={v => update('property_type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Título do anúncio</Label>
                <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Ex: Apartamento 3 quartos no Centro" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="500000" />
                </div>
                <div className="space-y-2">
                  <Label>Área (m²)</Label>
                  <Input type="number" value={form.area_m2} onChange={e => update('area_m2', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Quartos</Label>
                  <Input type="number" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Banheiros</Label>
                  <Input type="number" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Vagas</Label>
                  <Input type="number" value={form.parking_spots} onChange={e => update('parking_spots', e.target.value)} min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Condomínio (R$/mês)</Label>
                  <Input type="number" value={form.condo_fee} onChange={e => update('condo_fee', e.target.value)} placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <Label>IPTU (R$/ano)</Label>
                  <Input type="number" value={form.iptu} onChange={e => update('iptu', e.target.value)} placeholder="Opcional" />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <CardHeader className="px-0 pt-0"><CardTitle>Endereço</CardTitle></CardHeader>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Rua</Label>
                  <Input value={form.address_street} onChange={e => update('address_street', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input value={form.address_number} onChange={e => update('address_number', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input value={form.address_complement} onChange={e => update('address_complement', e.target.value)} placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input value={form.address_neighborhood} onChange={e => update('address_neighborhood', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={form.address_city} onChange={e => update('address_city', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={form.address_state} onValueChange={v => update('address_state', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{BRAZILIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input value={form.address_zip} onChange={e => update('address_zip', e.target.value)} placeholder="88000-000" />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="px-0 pt-0"><CardTitle>Fotos</CardTitle></CardHeader>
              <div>
                <Label htmlFor="photos" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition">
                    <p className="text-muted-foreground">{uploading ? 'Enviando...' : 'Clique para adicionar fotos'}</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou WebP (máx. 5MB cada, até 20 fotos)</p>
                  </div>
                </Label>
                <input id="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden">
                      <img src={url} alt={`Foto ${i + 1}`} className="object-cover w-full h-full" />
                      <button
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      >x</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="px-0 pt-0"><CardTitle>Descrição</CardTitle></CardHeader>
              <div className="space-y-2">
                <Label>Descrição detalhada</Label>
                <Textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Descreva o imóvel em detalhes..."
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label>Características (separadas por vírgula)</Label>
                <Input
                  value={form.features}
                  onChange={e => update('features', e.target.value)}
                  placeholder="Piscina, Churrasqueira, Academia, Portaria 24h"
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader className="px-0 pt-0"><CardTitle>Revisar anúncio</CardTitle></CardHeader>
              <div className="space-y-3 text-sm">
                <div><strong>Tipo:</strong> {form.transaction_type === 'venda' ? 'Venda' : 'Aluguel'} - {PROPERTY_TYPE_LABELS[form.property_type]}</div>
                <div><strong>Título:</strong> {form.title}</div>
                <div><strong>Preço:</strong> R$ {parseFloat(form.price || '0').toLocaleString('pt-BR')}</div>
                <div><strong>Área:</strong> {form.area_m2} m²</div>
                <div><strong>Endereço:</strong> {form.address_street}, {form.address_number} - {form.address_neighborhood}, {form.address_city}/{form.address_state}</div>
                <div><strong>Fotos:</strong> {photos.length}</div>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              Voltar
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>Próximo</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar anúncio'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
