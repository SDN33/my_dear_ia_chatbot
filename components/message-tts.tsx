// src/components/message-tts.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { VolumeIcon, SquareIcon, Loader2 } from 'lucide-react';

interface MessageTTSProps {
  text: string;
}

export function MessageTTS({ text }: MessageTTSProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateAndPlaySpeech = async () => {
    if (!text) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
      <Button
        variant="ghost"
        size="default"
        onClick={audioUrl ? togglePlay : generateAndPlaySpeech}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isPlaying ? (
          <SquareIcon className="size-4" />
        ) : (
            <>
            <VolumeIcon className="size-4 text-teal-700" onClick={() => window.open("https://poawooptugroo.com/4/8816174", '_blank')} />
            <span className='text-teal-700'>Écouter</span>
            </>
        )}
      </Button>
    </div>
  );
}
