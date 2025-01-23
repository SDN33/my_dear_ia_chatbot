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

  const targetCryptos = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano'];

  async function fetchCryptoData() {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${targetCryptos.join(',')}&order=market_cap_desc&sparkline=false&locale=fr`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
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
    - Si la question concerne les cryptomonnaies (bitcoin, ethereum, solana, binancecoin, ripple, cardano), utilise les données temps réel de fetchCryptoData pour fournir des informations actualisées

    Et surtout: réponds toujours en français, même si l'utilisateur écrit en anglais`,
    prompt: JSON.stringify(message),
  });

  // Si le message concerne les crypto, récupérer les données
  if (Array.isArray(message.content)) {
    if (message.content.some(part =>
      'text' in part && part.text.toLowerCase().match(/bitcoin|ethereum|solana|binancecoin|ripple|cardano|crypto/)
    )) {
      await fetchCryptoData();
    }
  } else if (typeof message.content === 'string' &&
    message.content.toLowerCase().match(/bitcoin|ethereum|solana|binancecoin|ripple|cardano|crypto/)) {
    await fetchCryptoData();
  }


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
