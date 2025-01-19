import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from 'lucide-react';

interface CryptoRate {
  id: string;
  current_price: number;
  total_volume: number;
  price_change_percentage_24h: number;
  symbol: string;
  name: string;
  image: string;
}

const CryptoModule = () => {
  const [cryptoData, setCryptoData] = useState<CryptoRate[]>([]);
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

  const targetCryptos = useMemo(() => ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano'], []);

  const fetchCryptoData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${targetCryptos.join(',')}&order=market_cap_desc&sparkline=false&locale=fr`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCryptoData(data);
      setLastFetchTime(Date.now());
      generateSummaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [targetCryptos]);

  const generateSummaries = async (data: CryptoRate[]) => {
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.error('Clé API OpenAI manquante');
      return;
    }

    const summariesTemp: Record<string, string> = {};

    for (const crypto of data) {
      const prompt = `En tant qu'expert trading, donnez une analyse de marché pour ${crypto.name} (${crypto.symbol.toUpperCase()}) en EXACTEMENT 120 caractères (ni plus ni moins):

      Prix: ${crypto.current_price}€
      Volume 24h: ${crypto.total_volume}
      Var 24h: ${crypto.price_change_percentage_24h}%

      Incluez votre recommandation (achat/vente/conservation).`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            max_tokens: 60,
            temperature: 0.7,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const result = await response.json();
        summariesTemp[crypto.symbol] = result.choices?.[0]?.message?.content || 'Analyse non disponible';
      } catch (error) {
        summariesTemp[crypto.symbol] = 'Erreur lors de la génération de l\'analyse.';
      }
    }
    setSummaries(summariesTemp);
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 5 * 60 * 1000); // Rafraîchir toutes les 5 minutes
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number | null) => {
    if (!change) return '0,00%';
    return `${change.toFixed(2).replace('.', ',')}%`;
  };

  if (isLoading && cryptoData.length === 0) {
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
        {cryptoData.map((crypto) => {
          if (windowWidth < 768 && crypto.symbol === 'sol') return null;

          const isPositive = (crypto.price_change_percentage_24h || 0) >= 0;

            if (windowWidth < 768 && !['btc', 'eth'].includes(crypto.symbol)) return null;

            return (
            <Card key={crypto.id} className="flex flex-col justify-between p-2">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
              <img src={crypto.image} alt={crypto.name} className="w-4 h-4" />
              <div className="font-semibold text-xs">{crypto.symbol.toUpperCase()}</div>
              </div>
              <div className={`flex items-center text-[10px] ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpIcon className="size-2" /> : <ArrowDownIcon className="size-2" />}
              {formatChange(crypto.price_change_percentage_24h)}
              </div>
              </div>
              <div className="text-[10px] mt-1">
              <div className="font-medium">{formatPrice(crypto.current_price)}</div>
              </div>
              <div className="text-[10px] text-gray-500">
              Vol : {new Intl.NumberFormat('fr-FR').format(crypto.total_volume)} €
              </div>
              <div className="relative group">
              <div className="text-[9px] text-gray-900 mt-1">
              {summaries[crypto.symbol]
              ? `${summaries[crypto.symbol].substring(0, 80)}... `
              : 'Analyse en cours...'}
              <button
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                if (windowWidth < 768) {
                alert(summaries[crypto.symbol]);
                }
              }}
              >
              voir plus
              </button>
              </div>
              {windowWidth >= 768 && (
              <div className="absolute z-50 invisible group-hover:visible -top-16 bg-white border p-2 rounded-md shadow-lg w-48 text-[10px]">
              {summaries[crypto.symbol]}
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
