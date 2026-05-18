export type UserType = 'pf' | 'corretor';

export interface Profile {
  id: string;
  user_type: UserType;
  full_name: string;
  cpf: string;
  phone: string;
  email: string | null;
  phone_verified: boolean;
  email_verified: boolean;
  creci_number: string | null;
  creci_state: string | null;
  creci_verified: boolean;
  reputation_score: number;
  reputation_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  user_type: UserType;
  full_name: string;
  cpf: string;
  phone: string;
  email: string;
  creci_number?: string;
  creci_state?: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  phone?: string;
  creci_number?: string;
  creci_state?: string;
}
