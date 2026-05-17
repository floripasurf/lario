import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile, CreateProfileInput, UpdateProfileInput } from './types';

export class UserRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Profile;
  }

  async create(id: string, input: CreateProfileInput): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert({ id, ...input })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  }

  async update(id: string, input: UpdateProfileInput): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  }
}
