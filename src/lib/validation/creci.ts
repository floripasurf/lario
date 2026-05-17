import { BRAZILIAN_STATES } from '@/lib/constants';

export function validateCRECI(number: string, state: string): boolean {
  if (!number || number.length < 3 || number.length > 10) return false;
  if (!BRAZILIAN_STATES.includes(state as typeof BRAZILIAN_STATES[number])) return false;
  return /^\d+$/.test(number.replace(/[.\-\/]/g, ''));
}
