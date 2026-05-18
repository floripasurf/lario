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
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Anunciar imovel</h1>
      <p className="text-muted-foreground mb-8">Gratis para publicar. Voce so paga se vender.</p>

      {/* Step indicator */}
      <nav aria-label="Progresso do formulario" className="mb-8">
        <div className="flex gap-1.5 mb-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i === step ? 'bg-primary' : i < step ? 'bg-primary/40' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { if (i < step) setStep(i); }}
                disabled={i > step}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                  i === step
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : i < step
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium tabular-nums">
            {step + 1}/{STEPS.length}
          </span>
        </div>
      </nav>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6 md:p-8 space-y-5">
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
                  <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${uploading ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50 hover:border-primary/20'}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-primary font-medium">Enviando fotos...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                          <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" /></svg>
                        </div>
                        <p className="text-foreground font-medium text-sm">Clique para adicionar fotos</p>
                        <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG ou WebP (max. 5MB cada, ate 20 fotos)</p>
                      </>
                    )}
                  </div>
                </Label>
                <input id="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
              </div>
              {photos.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">{photos.length} {photos.length === 1 ? 'foto adicionada' : 'fotos adicionadas'}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {photos.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group ring-1 ring-border/50">
                        <img src={url} alt={`Foto ${i + 1}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                        <button
                          className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-destructive text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-90"
                          onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        >x</button>
                      </div>
                    ))}
                  </div>
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
              <CardHeader className="px-0 pt-0"><CardTitle>Revisar anuncio</CardTitle></CardHeader>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-medium">{form.transaction_type === 'venda' ? 'Venda' : 'Aluguel'} - {PROPERTY_TYPE_LABELS[form.property_type]}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Titulo</span>
                  <span className="font-medium text-right max-w-[60%]">{form.title}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Preco</span>
                  <span className="font-semibold text-primary">R$ {parseFloat(form.price || '0').toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-medium">{form.area_m2} m&sup2;</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Endereco</span>
                  <span className="font-medium text-right max-w-[60%]">{form.address_street}, {form.address_number} - {form.address_neighborhood}, {form.address_city}/{form.address_state}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Fotos</span>
                  <span className="font-medium">{photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</span>
                </div>
              </div>
              {photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-2 pb-1">
                  {photos.slice(0, 6).map((url, i) => (
                    <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-border/50">
                      <img src={url} alt={`Foto ${i + 1}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                  {photos.length > 6 && (
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                      +{photos.length - 6}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex justify-between pt-6 border-t border-border/50">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="min-w-[100px]">
              Voltar
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="min-w-[100px]">Proximo</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="min-w-[160px]">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Publicando...
                  </span>
                ) : 'Publicar anuncio'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
