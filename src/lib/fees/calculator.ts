type UserType = 'pf' | 'corretor';
type TransactionType = 'venda' | 'aluguel';

interface FeeResult {
  feeCents: number;
  label: string;
}

// Tabela progressiva de success fee (venda)
const VENDA_PF: Array<{ maxCents: number; feeCents: number }> = [
  { maxCents: 10_000_000, feeCents: 0 },         // Até R$ 100k: grátis
  { maxCents: 30_000_000, feeCents: 9_900 },      // R$ 100–300k: R$ 99
  { maxCents: Infinity, feeCents: 9_900 },         // Acima: tabela de corretor (fallback)
];

const VENDA_CORRETOR: Array<{ maxCents: number; feeCents: number }> = [
  { maxCents: 10_000_000, feeCents: 4_900 },      // Até R$ 100k: R$ 49
  { maxCents: 30_000_000, feeCents: 19_900 },     // R$ 100–300k: R$ 199
  { maxCents: 60_000_000, feeCents: 34_900 },     // R$ 300–600k: R$ 349
  { maxCents: 100_000_000, feeCents: 54_900 },    // R$ 600k–1M: R$ 549
  { maxCents: 200_000_000, feeCents: 84_900 },    // R$ 1–2M: R$ 849
  { maxCents: 500_000_000, feeCents: 129_700 },   // R$ 2–5M: R$ 1.297
  { maxCents: Infinity, feeCents: 199_700 },       // R$ 5M+: R$ 1.997 (cap)
];

// Tabela de aluguel (única, para PF e corretor)
const ALUGUEL: Array<{ maxCents: number; feeCents: number }> = [
  { maxCents: 150_000, feeCents: 4_900 },         // Até R$ 1.500/mês: R$ 49
  { maxCents: 300_000, feeCents: 9_900 },          // R$ 1.500–3.000: R$ 99
  { maxCents: 600_000, feeCents: 19_900 },         // R$ 3.000–6.000: R$ 199
  { maxCents: Infinity, feeCents: 34_900 },        // R$ 6.000+: R$ 349
];

function lookupFee(table: Array<{ maxCents: number; feeCents: number }>, priceCents: number): number {
  const tier = table.find(t => priceCents <= t.maxCents);
  return tier?.feeCents ?? table[table.length - 1].feeCents;
}

export function calculateSuccessFee(
  priceCents: number,
  transactionType: TransactionType = 'venda',
  userType: UserType = 'corretor',
): FeeResult {
  if (transactionType === 'aluguel') {
    const feeCents = lookupFee(ALUGUEL, priceCents);
    return { feeCents, label: formatBRL(feeCents) };
  }

  const table = userType === 'pf' ? VENDA_PF : VENDA_CORRETOR;
  const feeCents = lookupFee(table, priceCents);
  return { feeCents, label: feeCents === 0 ? 'Grátis' : formatBRL(feeCents) };
}

export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(cents / 100);
}
