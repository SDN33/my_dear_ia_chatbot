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

// Types pour les données renvoyées par les flux ou l'API CoinGecko
interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

// Fonction utilitaire pour récupérer et parser un flux RSS
const fetchRSSFeed = async (url: string, limit: number = 5): Promise<NewsItem[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur récupération flux RSS (${response.status})`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    return Array.from(items).slice(0, limit).map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
    }));
  } catch (error) {
    console.error(`Erreur récupération flux RSS depuis ${url}:`, error);
    return [];
  }
};

// Récupération des actualités spécifiques
const fetchCryptoNews = () => fetchRSSFeed('https://fr.cointelegraph.com/rss');
const fetchGeneralNews = () => fetchRSSFeed('https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr');
const fetchFootballNews = () => fetchRSSFeed('https://rmcsport.bfmtv.com/rss/football/');

// Sauvegarde de l'identifiant du modèle AI dans les cookies
export async function saveModelId(model: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

// Fonction pour vérifier si le message parle de crypto
const checkForCryptoKeywords = (content: any[] | string): boolean => {
  const messageText = Array.isArray(content)
    ? content.filter(part => 'text' in part).map(part => part.text).join(' ')
    : content;
  const cryptoKeywords = ['bitcoin', 'ethereum', 'crypto', 'cryptomonnaie', 'blockchain'];
  return cryptoKeywords.some(keyword => messageText.toLowerCase().includes(keyword));
};

// Récupération des données crypto depuis l'API CoinGecko
const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    const targetCryptos = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano'];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${targetCryptos.join(
        ','
      )}&order=market_cap_desc&sparkline=false&locale=fr`
    );

    if (!response.ok) {
      throw new Error(`Erreur API CoinGecko: ${response.status}`);
    }

    const data: CryptoData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur récupération données crypto:', error);
    return [];
  }
};

// Génération de titres basés sur le contexte
export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}): Promise<string> {
  // Mots-clés pour différents contextes
  const cryptoKeywords = [
    'bitcoin',
    'ethereum',
    'solana',
    'binancecoin',
    'ripple',
    'cardano',
    'crypto',
    'cryptomonnaie',
    'blockchain',
    'trading',
    'investissement crypto',
  ];
  const footballKeywords = ['football', 'match', 'équipe', 'ligue', 'championnat', 'but', 'joueur'];
  const generalNewsKeywords = ['actualité', 'news', 'information', 'monde', 'politique', 'économie'];

  // Fonction pour vérifier le contexte
  const checkContext = (content: string | any[], keywords: string[]): boolean => {
    const normalizedContent =
      typeof content === 'string'
        ? content.toLowerCase()
        : content.map(part => ('text' in part ? part.text.toLowerCase() : '')).join(' ');

    return keywords.some(keyword => normalizedContent.includes(keyword));
  };

  // Récupération des données en fonction du contexte
  const getContextualData = async () => {
    try {
      if (checkContext(message.content, cryptoKeywords)) {
        const [cryptoData, cryptoNews] = await Promise.all([fetchCryptoData(), fetchCryptoNews()]);
        // Validation des paramètres crypto selon le schéma
        const cryptoParams = {
          action: 'buy', // Par défaut
          amount: 0,
          currency: '',
          account_id: ''
        };

        // Parse le message pour extraire les paramètres
        const content = Array.isArray(message.content)
          ? message.content.map(part => 'text' in part ? part.text : '').join(' ')
          : message.content;

        // Extraction basique des paramètres (à améliorer selon les besoins)
        if (content.includes('acheter')) cryptoParams.action = 'buy';
        if (content.includes('vendre')) cryptoParams.action = 'sell';

        // Recherche de montants avec regex
        const amountMatch = content.match(/\d+(\.\d+)?/);
        if (amountMatch) cryptoParams.amount = parseFloat(amountMatch[0]);

        // Recherche de devise
        for (const crypto of cryptoData) {
          if (content.toLowerCase().includes(crypto.symbol.toLowerCase())) {
            cryptoParams.currency = crypto.symbol.toUpperCase();
            break;
          }
        }

        return {
          type: 'crypto',
          data: { cryptoData, cryptoNews, parameters: cryptoParams }
        };
      } else if (checkContext(message.content, footballKeywords)) {
        const footballNews = await fetchFootballNews();
        return { type: 'football', data: { footballNews } };
      } else if (checkContext(message.content, generalNewsKeywords)) {
        const generalNews = await fetchGeneralNews();
        return { type: 'general', data: { generalNews } };
      }
      return null;
    } catch (error) {
      console.error('Erreur récupération données contextuelles:', error);
      return null;
    }
  };

  // Génération du titre via AI
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
  if (contextResult) {
    console.log(`Données contextuelles récupérées pour le type : ${contextResult.type}`);
  }

  // Add crypto data to AI prompt if relevant
  let systemPrompt = `Tu es un chatbot nommé My Dear Ai, expert en coaching et communication.
    Génère un titre concis capturant l'essence du message, en 80 caractères maximum.
    Sois amical, engageant et utilise des emojis stratégiquement.
    Adapte ton ton au contexte du message.`;

  if (checkForCryptoKeywords(message.content)) {
    const cryptoData = await fetchCryptoData();
    const bitcoinData = cryptoData.find(crypto => crypto.id === 'bitcoin');
    if (bitcoinData) {
      const priceChange = bitcoinData.price_change_percentage_24h;
      const priceTrend = priceChange >= 0 ? 'hausse' : 'baisse';
      systemPrompt += `\nLe Bitcoin est en ${priceTrend} de ${Math.abs(priceChange).toFixed(2)}% sur 24h.`;
    }
  }

  // Generate title with updated system prompt
  const { text: updatedTitle } = await generateText({
    model: customModel('gpt-4o-mini'),
    system: systemPrompt,
    prompt: JSON.stringify(message),
  });

  return updatedTitle;
}

// Suppression des messages inutiles
export async function deleteTrailingMessages({ id }: { id: string }): Promise<void> {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

// Mise à jour de la visibilité d'une discussion
export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}): Promise<void> {
  await updateChatVisiblityById({ chatId, visibility });
}
