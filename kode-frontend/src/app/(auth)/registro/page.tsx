import { RegisterForm } from '@/components/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crear Cuenta | KODE',
    description: 'Crea tu cuenta KODE',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
