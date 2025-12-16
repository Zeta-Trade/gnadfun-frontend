import type { Token } from '../types/token';

export const sortTokensByTrending = (tokens: Token[]): Token[] => {
  return [...tokens].sort((a, b) => b.priceChange24h - a.priceChange24h);
};

export const sortTokensByMarketCap = (tokens: Token[]): Token[] => {
  return [...tokens].sort((a, b) => b.marketCap - a.marketCap);
};

export const sortTokensByRecent = (tokens: Token[]): Token[] => {
  return [...tokens].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
