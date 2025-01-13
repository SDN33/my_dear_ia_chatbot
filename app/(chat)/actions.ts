'use server';

import { type CoreUserMessage, generateText } from 'ai';
import { cookies } from 'next/headers';

import { customModel } from '@/lib/ai';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  const { text: title } = await generateText({
    model: customModel('gpt-4o-mini'),
    system: `\n
    Tu es un coach de vie et psychologue amical qui s'adapte à chaque personne. Tu mélanges professionnalisme et humour quand c'est approprié, mais tu sais aussi être sérieux quand il le faut.
    Pour cette tâche:
    - Génère un titre concis à partir du premier message de l'utilisateur
    - Garde-le sous 80 caractères
    - Sois amical et engageant
    - Évite les guillemets et les deux-points
    - Capture l'essence de leur préoccupation ou question
    Et surtout: réponds toujours en français, même si l'utilisateur écrit en anglais`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
