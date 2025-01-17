'use client';

import SpotifyPlayer from '@/components/BestMusic.tsx';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('state');
    const previousPath = sessionStorage.getItem('previousPath') || '/';

    if (chatId) {
      // Retourner à la page précédente avec le chatId
      router.push(`${previousPath}?authenticated=true`);
    } else {
      console.error('Chat ID not found in URL');
      router.push('/error');
    }
  }, [router]);

  return <SpotifyPlayer />;
}
