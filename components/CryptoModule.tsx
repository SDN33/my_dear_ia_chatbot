import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from 'lucide-react';

interface CryptoRate {
  rate: number;
  high?: number;
  low?: number;
  vol?: number;
}

interface CryptoData {
  success: boolean;
  rates: Record<string, CryptoRate>;
  error?: {
    info: string;
  };
}

const CryptoModule = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const topCryptos = useMemo(() => ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'], []);
  const API_KEY = process.env.NEXT_PUBLIC_COINLAYER_API_KEY;
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours cache

  const fetchCryptoData = useCallback(async () => {
    const now = Date.now();
    const lastFetchDate = new Date(lastFetchTime).setHours(0, 0, 0, 0);
    const todayDate = new Date(now).setHours(0, 0, 0, 0);

    if (lastFetchDate === todayDate) {
      return; // Skip if we already fetched today
    }


    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.coinlayer.com/live?access_key=${API_KEY}&symbols=${topCryptos.join(',')}&expand=1`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.info || 'Failed to fetch crypto data');
      }

      setCryptoData(data);
      setLastFetchTime(now);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY, topCryptos, lastFetchTime]);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchCryptoData, CACHE_DURATION]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    if (!change) return '0.00%';
    return `${(change * 100).toFixed(2)}%`;
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
      <div className="text-xs text-gray-500 px-2 pb-1">
      Dernière mise à jour : {lastFetchTime ? new Date(lastFetchTime).toLocaleString('fr-FR') : 'Chargement...'}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full p-2">
      {topCryptos.map((symbol) => {
        const crypto = cryptoData?.rates[symbol];
        if (!crypto) return null;

        const priceChange = crypto.high && crypto.low
        ? (crypto.rate - crypto.low) / crypto.low
        : 0;

        const isPositive = priceChange >= 0;

        return (
        <Card key={symbol} className="flex flex-col justify-between p-3">
          <div className="flex items-center justify-between">
          <div className="font-semibold">{symbol}</div>
          <span className="ml-1 text-gray-500 text-right text-xs -mr-28">Ce jour</span>

          {priceChange !== 0 && (
            <div className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpIcon className="size-3 mr-1" /> : <ArrowDownIcon className="size-3 mr-1" />}
            {formatChange(Math.abs(priceChange))}
            </div>
          )}
          </div>
          <div className="text-sm mt-2">
            <div className="flex flex-col">
            <div className="font-medium">{formatPrice(crypto.rate)}</div>
            <div className="text-xs text-gray-500">
            {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            }).format(crypto.rate * 0.92)}
            </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
          Vol: {crypto.vol ? new Intl.NumberFormat().format(crypto.vol) : 'N/A'}
          </div>
        </Card>
        );
      })}
      </div>
    </div>
  );
};

export default CryptoModule;
