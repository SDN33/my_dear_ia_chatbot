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

  const topCryptos = useMemo(() => ['btc-bitcoin', 'eth-ethereum', 'usdt-tether', 'bnb-binance-coin', 'sol-solana', 'xrp-xrp'], []);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [topCryptos]);

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
        {Object.entries(cryptoData || {}).map(([symbol, crypto]) => {
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
              <div className="text-[10px] text-gray-500">
                {formatPrice(crypto.price_usd * 0.92)} EUR
              </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Vol : {new Intl.NumberFormat().format(crypto.volume_24h)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoModule;
