// src/lib/tts-service.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache pour stocker les audios générés
const audioCache = new Map<string, ArrayBuffer>();

export async function textToSpeech(text: string, options: {
  chunkSize?: number;
  onProgress?: (progress: number) => void;
} = {}): Promise<ArrayBuffer> {
  const cacheKey = `${text}`;

  // Vérifier le cache
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  // Diviser le texte en petits morceaux pour un streaming plus rapide
  const maxChunkLength = options.chunkSize || 100;
  const chunks = text.match(new RegExp(`.{1,${maxChunkLength}}(\\s|$)`, 'g')) || [text];

  const audioChunks: ArrayBuffer[] = [];
  let progress = 0;

  for (const chunk of chunks) {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // voix française féminine
      input: chunk,
      speed: 1.0,
    });

    const buffer = await mp3.arrayBuffer();
    audioChunks.push(buffer);

    progress += 1;
    options.onProgress?.(Math.floor((progress / chunks.length) * 100));
  }

  // Combiner tous les chunks
  const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const combinedBuffer = new Uint8Array(totalLength);

  let offset = 0;
  for (const chunk of audioChunks) {
    combinedBuffer.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }

  // Mettre en cache le résultat final
  const finalBuffer = combinedBuffer.buffer;
  audioCache.set(cacheKey, finalBuffer);

  return finalBuffer;
}
