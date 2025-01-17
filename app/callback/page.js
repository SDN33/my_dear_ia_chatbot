'use client';

import SpotifyPlayer from '@/components/BestMusic.tsx';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('state');
    router.push(`/chat/${chatId}`);
  }, [router]);

  return <SpotifyPlayer />;
}
