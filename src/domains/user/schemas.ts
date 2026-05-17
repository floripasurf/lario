import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
const phoneRegex = /^\+55\d{10,11}$|^\d{10,11}$/;

export const createProfileSchema = z.object({
  user_type: z.enum(['pf', 'corretor']),
  full_name: z.string().min(3).max(100),
  cpf: z.string().regex(cpfRegex, 'CPF inválido'),
  phone: z.string().regex(phoneRegex, 'Telefone inválido'),
  creci_number: z.string().optional(),
  creci_state: z.string().length(2).optional(),
}).refine(data => {
  if (data.user_type === 'corretor') {
    return !!data.creci_number && !!data.creci_state;
  }
  return true;
}, { message: 'CRECI obrigatório para corretores', path: ['creci_number'] });

export const updateProfileSchema = z.object({
  full_name: z.string().min(3).max(100).optional(),
  phone: z.string().regex(phoneRegex, 'Telefone inválido').optional(),
  creci_number: z.string().optional(),
  creci_state: z.string().length(2).optional(),
});
