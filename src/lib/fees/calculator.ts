import { SUCCESS_FEE_PERCENTAGE } from '@/lib/constants';

export function calculateSuccessFee(priceCents: number): number {
  return Math.round(priceCents * (SUCCESS_FEE_PERCENTAGE / 100));
}

export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(cents / 100);
}
