import { useEffect } from 'react';
import type { Token } from '../types/token';

interface UseRealTimeTokenUpdatesOptions {
  updateInterval?: number;
  priceChangeRange?: [number, number];
  marketCapVariation?: number;
}

export function useRealTimeTokenUpdates(
  tokens: Token[],
  setTokens: (tokens: Token[]) => void,
  options: UseRealTimeTokenUpdatesOptions = {}
) {
  const {
    updateInterval = 2000,
    priceChangeRange = [-5, 5],
    marketCapVariation = 0.02,
  } = options;

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(
        tokens.map((token) => {
          const randomPriceChange =
            (Math.random() - 0.5) * (priceChangeRange[1] - priceChangeRange[0]) +
            (priceChangeRange[0] + priceChangeRange[1]) / 2;

          const randomMarketCapChange = (Math.random() - 0.5) * 2 * marketCapVariation;
          const newMarketCap = Math.max(
            1000,
            token.marketCap * (1 + randomMarketCapChange)
          );

          return {
            ...token,
            priceChange24h: Number(
              (token.priceChange24h + randomPriceChange).toFixed(2)
            ),
            marketCap: Math.round(newMarketCap),
            createdAt: new Date(token.createdAt),
          };
        })
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [tokens, setTokens, updateInterval, priceChangeRange, marketCapVariation]);
}
