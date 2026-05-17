import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Criar Conta | Lario',
  description: 'Cadastre-se gratuitamente no Lario',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}
