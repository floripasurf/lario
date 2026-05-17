import type { SupabaseClient } from '@supabase/supabase-js';
import { UserRepository } from './repository';
import type { CreateProfileInput, UpdateProfileInput, Profile } from './types';
import { validateCPF } from '@/lib/validation/cpf';
import { validateCRECI } from '@/lib/validation/creci';

export class UserService {
  private repo: UserRepository;

  constructor(supabase: SupabaseClient) {
    this.repo = new UserRepository(supabase);
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return this.repo.findById(userId);
  }

  async createProfile(userId: string, input: CreateProfileInput): Promise<Profile> {
    if (!validateCPF(input.cpf)) throw new Error('CPF inválido');
    if (input.creci_number && input.creci_state && !validateCRECI(input.creci_number, input.creci_state)) {
      throw new Error('CRECI inválido');
    }
    return this.repo.create(userId, input);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
    if (input.creci_number) {
      const profile = await this.repo.findById(userId);
      const state = input.creci_state || profile?.creci_state;
      if (state && !validateCRECI(input.creci_number, state)) throw new Error('CRECI inválido');
    }
    return this.repo.update(userId, input);
  }
}
