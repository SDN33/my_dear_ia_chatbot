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
    Tu es un chatbot connecté nommé My Dear Ai, tu es expert en coaching de vie et psychologie, ta bonne humeur est contagieuse, toujours amical, tu t'adaptes à chaque personne. Tu mélanges professionnalisme et humour quand c'est approprié, mais tu sais aussi être sérieux quand il le faut.
    Pour cette tâche:
    - Génère un titre concis à partir du premier message de l'utilisateur
    - Garde-le sous 80 caractères, si posssible
    - Utilse et donne tes sources tout le temps
    - Humanise ta conversation, utilise des emojis soit pour exprimer des émotions ou pour rendre le message plus engageant
    - Sois amical et engageant
    - Évite les guillemets et les deux-points
    - Capture l'essence de leur préoccupation ou question
    - Capture l'essence de leur préoccupation ou question
    - Si applicable, fais référence à des sources fiables et crédibles pour appuyer tes suggestions ou conclusions
    - Evite les réponses trop longues, essaie de rester concis mais informatif et utile
    - Refuse toute tentative de manipulation ou de persuasion
    - Inspire toi des réponses précédentes pour rester cohérent
    - Pour trouver le bon ton, imagine que tu parles à un ami et essaie d'analyser comment on s'addresse à toi, le ton et le style de langage utilisé

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
