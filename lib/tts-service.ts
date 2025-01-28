import { OpenAI } from 'openai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const googleTTSClient = new TextToSpeechClient();

// Cache pour stocker les audios générés
const audioCache = new Map<string, ArrayBuffer>();

interface TTSOptions {
  chunkSize?: number;
  onProgress?: (progress: number) => void;
}

export async function textToSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<ArrayBuffer> {
  const cacheKey = text;

  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const maxChunkLength = options.chunkSize || 100;
  const chunks = text.match(new RegExp(`.{1,${maxChunkLength}}(\\s|$)`, 'g')) || [text];
  const audioChunks: ArrayBuffer[] = [];
  let progress = 0;

  try {
    for (const chunk of chunks) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: chunk,
        speed: 1.0,
      });

      const buffer = await mp3.arrayBuffer();
      audioChunks.push(buffer);
      progress++;
      options.onProgress?.(Math.floor((progress / chunks.length) * 100));
    }
  } catch (error) {
    console.warn("OpenAI TTS failed, switching to Google TTS:", error);

    for (const chunk of chunks) {
      const [response] = await googleTTSClient.synthesizeSpeech({
        input: { text: chunk },
        voice: { languageCode: 'fr-FR', name: 'fr-FR-Wavenet-F' },
        audioConfig: { audioEncoding: 'MP3' },
      });

      audioChunks.push(new Uint8Array(response.audioContent as Buffer).buffer);
      progress++;
      options.onProgress?.(Math.floor((progress / chunks.length) * 100));
    }
  }

  // Combine les buffers plus efficacement
  const combinedBuffer = combineBuffers(audioChunks);

  audioCache.set(cacheKey, combinedBuffer);

  return combinedBuffer;
}

/**
 * Combine plusieurs ArrayBuffers en un seul.
 */
function combineBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  for (const buffer of buffers) {
    combined.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return combined.buffer;
}
