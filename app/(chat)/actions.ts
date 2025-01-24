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

// Nouvelles fonctions pour les flux d'actualités
const fetchCryptoNews = async () => {
  try {
    const response = await fetch('https://fr.cointelegraph.com/rss');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    return Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || ''
    })).slice(0, 5);
  } catch (error) {
    console.error('Erreur récupération flux RSS', error);
    return [];
  }
};

const fetchGeneralNews = async () => {
  try {
    const response = await fetch('https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    return Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || ''
    })).slice(0, 5);
  } catch (error) {
    console.error('Erreur récupération news générales', error);
    return [];
  }
};

const fetchFootballNews = async () => {
  try {
    const response = await fetch('https://rmcsport.bfmtv.com/rss/football/');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    return Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || ''
    })).slice(0, 5);
  } catch (error) {
    console.error('Erreur récupération news football', error);
    return [];
  }
};


export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

const fetchCryptoData = async () => {
  const targetCryptos = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano'];
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${targetCryptos.join(',')}&order=market_cap_desc&sparkline=false&locale=fr`
  );
  const data = await response.json();
  return data;
};

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  // Mots-clés pour différents contextes
  const cryptoKeywords = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'crypto', 'cryptomonnaie', 'blockchain', 'trading', 'investissement crypto'];
  const footballKeywords = ['football', 'match', 'équipe', 'ligue', 'championnat', 'but', 'joueur'];
  const generalNewsKeywords = ['actualité', 'news', 'information', 'monde', 'politique', 'économie'];

  // Fonction pour vérifier le contexte
  const checkContext = (content: any, keywords: string[]) => {
    if (Array.isArray(content)) {
      return content.some(part =>
        'text' in part &&
        keywords.some(keyword => part.text.toLowerCase().includes(keyword))
      );
    } else if (typeof content === 'string') {
      return keywords.some(keyword => content.toLowerCase().includes(keyword));
    }
    return false;
  };

  // Récupération des données en fonction du contexte
  const getContextualData = async () => {
    try {
      if (checkContext(message.content, cryptoKeywords)) {
        const [cryptoData, cryptoNews] = await Promise.all([
          fetchCryptoData(),
          fetchCryptoNews()
        ]);
        return { type: 'crypto', data: { cryptoData, cryptoNews } };
      } else if (checkContext(message.content, footballKeywords)) {
        const footballNews = await fetchFootballNews();
        return { type: 'football', data: { footballNews } };
      } else if (checkContext(message.content, generalNewsKeywords)) {
        const generalNews = await fetchGeneralNews();
        return { type: 'general', data: { generalNews } };
      }
      return null;
    } catch (error) {
      console.error('Erreur récupération données contextuelles', error);
      return null;
    }
  };

  const { text: title } = await generateText({
    model: customModel('gpt-4o-mini'),
    system: `Tu es un chatbot nommé My Dear Ai, expert en coaching et communication.
    Génère un titre concis capturant l'essence du message, en 80 caractères maximum.
    Sois amical, engageant et utilise des emojis stratégiquement.
    Adapte ton ton au contexte du message.`,
    prompt: JSON.stringify(message),
  });

  // Récupération des données contextuelles
  const contextResult = await getContextualData();

  // Possibilité de traitement supplémentaire basé sur le contexte
  if (contextResult) {
    // Logique supplémentaire si nécessaire
    console.log(`Données contextuelles récupérées pour le type : ${contextResult.type}`);
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
