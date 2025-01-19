import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from 'lucide-react';

interface CryptoRate {
  price_usd: number;
  volume_24h: number;
  percent_change_24h: number;
}

interface CryptoData {
  [key: string]: CryptoRate;
}

const CryptoModule = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topCryptos = useMemo(() => ['btc-bitcoin', 'eth-ethereum', 'sol-solana',], []);

  const fetchCryptoData = useCallback(async () => {
    try {
      setIsLoading(true);

      const requests = topCryptos.map((crypto) =>
        fetch(`https://api.coinpaprika.com/v1/tickers/${crypto}`).then((res) => res.json())
      );
      const responses = await Promise.all(requests);

      const data: CryptoData = {};
      responses.forEach((response) => {
        data[response.symbol] = {
          price_usd: response.quotes.USD.price,
          volume_24h: response.quotes.USD.volume_24h,
          percent_change_24h: response.quotes.USD.percent_change_24h,
        };
      });

      setCryptoData(data);
      setLastFetchTime(Date.now());

      // Générer des résumés via OpenAI
      generateSummaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [topCryptos]);

  const generateSummaries = async (data: CryptoData) => {
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.error('API key for OpenAI is missing');
      return;
    }

    const summariesTemp: Record<string, string> = {};

    // Fetch RSS feed first using a CORS proxy
    let rssText = '';
    try {
      const rssResponse = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://fr.cointelegraph.com/rss/category/market-analysis'));
      rssText = await rssResponse.text();
    } catch (error) {
      console.error('Failed to fetch RSS feed:', error);
    }
    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, 'text/xml');
    const items = Array.from(rssDoc.querySelectorAll('item'));
    const last24hNews = items
      .slice(0, 5)
      .map(item => item.querySelector('title')?.textContent || '')
      .join(' ');

    for (const [symbol, crypto] of Object.entries(data)) {
      const prompt = `En tant qu'expert trading, donnez une analyse de marché pour ${symbol} en EXACTEMENT 120 caractères (ni plus ni moins):

      Prix: ${crypto.price_usd}USD
      Volume 24h: ${crypto.volume_24h}
      Var 24h: ${crypto.percent_change_24h}%

      ne repetez pas les informations ci-dessus

      News: ${last24hNews}
      Incluez votre recommandation (achat/vente/conservation).`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-16k',
            max_tokens: 60,
            temperature: 0.7,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const result = await response.json();
        const summary = result.choices?.[0]?.message?.content || 'Résumé non disponible';
        summariesTemp[symbol] = summary;
      } catch (error) {
        summariesTemp[symbol] = 'Erreur lors de la génération du résumé.';
      }
    }
    setSummaries(summariesTemp);
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 24 * 60 * 60 * 1000); // Rafraîchir toutes les 24h
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    if (!change) return '0.00%';
    return `${change.toFixed(2)}%`;
  };

  if (isLoading && !cryptoData) {
    return (
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs text-gray-500 px-2">
        Dernière mise à jour : {lastFetchTime ? new Date(lastFetchTime).toLocaleString('fr-FR') : 'Chargement...'}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full p-2">
        {Object.entries(cryptoData ?? {}).map(([symbol, crypto]) => {
          // Skip Solana on mobile
          if (windowWidth < 768 && symbol.toLowerCase() === 'sol') return null;

          const isPositive = crypto.percent_change_24h >= 0;

          return (
        <Card key={symbol} className="flex flex-col justify-between p-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{symbol.toUpperCase()}</div>
            <div
          className={`flex items-center text-xs ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
            >
          {isPositive ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
          {formatChange(crypto.percent_change_24h)}
            </div>
          </div>
          <div className="text-xs mt-2">
            <div className="font-medium">{formatPrice(crypto.price_usd)}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Vol : {new Intl.NumberFormat().format(crypto.volume_24h)}
          </div>
            <div className="relative group">
            <div className="text-[10px] text-gray-900 mt-2">
          {summaries[symbol]
          ? `${summaries[symbol].substring(0, 100)}... `
          : 'Prévisions en cours...'}
          <button
          className="text-blue-500 hover:underline"
          onClick={(e) => {
          e.stopPropagation();
          if (windowWidth < 768) {
            alert(summaries[symbol]);
          }
          }}
          >
          voir plus
          </button>
            </div>
            {windowWidth >= 768 && (
            <div className="absolute z-50 invisible group-hover:visible -top-20 bg-white border p-2 rounded-md shadow-lg w-64 text-xs">
            {summaries[symbol]}
            </div>
            )}
            </div>
        </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoModule;
