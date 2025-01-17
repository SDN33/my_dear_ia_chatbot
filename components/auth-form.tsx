import React, { useState } from 'react';
import { validate } from 'email-validator'; // Import de la validation d'email
import sanitizeHtml from 'sanitize-html'; // Import de sanitize-html
import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState<string>(defaultEmail);
  const [passwordValue, setPasswordValue] = useState<string>('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeHtml(event.target.value, {
      allowedTags: [],
      allowedAttributes: {},
    });

    setEmailValue(sanitizedEmail);

    if (!validate(sanitizedEmail)) {
      if (sanitizedEmail !== '') {
        setEmailError('Veuillez entrer une adresse email valide.');
      }
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = sanitizeHtml(event.target.value, {
      allowedTags: [],
      allowedAttributes: {},
    });

    setPasswordValue(sanitizedPassword);
  };

  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="email@mydear.xyz"
          autoComplete="email"
          required
          autoFocus
          value={emailValue} // Définit la valeur contrôlée
          onChange={handleEmailChange} // Gestionnaire pour permettre les modifications
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Mot de passe
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          placeholder="********"
          required
          value={passwordValue} // Définit la valeur contrôlée
          onChange={handlePasswordChange} // Gestionnaire pour permettre les modifications
        />
      </div>

      {children}
    </Form>
  );
}
