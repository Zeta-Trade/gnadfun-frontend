export interface Token {
  id: string;
  name: string;
  symbol: string;
  contractAddress?: string;
  description: string;
  imageUrl: string;
  creator: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  holders: number;
  createdAt: Date;
  chartData: { time: string; price: number }[];
  status?: 'SOLD' | 'BOUGHT' | 'LAUNCHED';
  twitter?: string;
  telegram?: string;
  website?: string;
  // Optional IPFS metadata CID and gateway URL
  ipfsCid?: string;
  metadataUrl?: string;
}

