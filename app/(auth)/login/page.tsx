'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import Header from '@/components/Header';

import { login, type LoginActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Mauvais email ou mot de passe');
    } else if (state.status === 'invalid_data') {
      toast.error('Échec de validation de votre soumission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen flex-col items-center bg-background">
      <div className="w-full text-center py-4 border-b">
        <Header />
      </div>

      <div className="flex-1 w-full flex items-start pt-12 md:pt-24 justify-center">
        <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col mt-10">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16 -mb-6">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Connection à My Dear IA</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Utilisez votre email et mot de passe pour vous connecter.
            </p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>Se Connecter</SubmitButton>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {"Pas encore de compte? "}
              <Link
                href="/register"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                S&apos;inscrire
              </Link>
              {' gratuitement.'}
            </p>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
