import { LoginForm } from '@/features/auth/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar Sesión | KODE',
    description: 'Inicia sesión en tu cuenta KODE',
};

export default function LoginPage() {
    return <LoginForm />;
}
