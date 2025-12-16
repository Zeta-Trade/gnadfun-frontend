'use client';

import { useState } from 'react';
import { TokenCard } from '../components/TokenCard';
import Header from '../components/Header';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { useTokenStore } from '../store/tokenStore';
import { sortTokensByTrending, sortTokensByMarketCap, sortTokensByRecent } from '../utils/tokenSorting';
import { Clock, Flame, ChartArea } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useRealTimeTokenUpdates } from '../hooks/useRealTimeTokenUpdates';

export default function HomePage() {
  const { tokens, setTokens } = useTokenStore();
  const t = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  useRealTimeTokenUpdates(tokens, setTokens, {
    updateInterval: 2000,
    priceChangeRange: [-3, 3],
    marketCapVariation: 0.01,
  });

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingTokens = sortTokensByTrending(filteredTokens);
  const topmarketcapTokens = sortTokensByMarketCap(filteredTokens);
  const recentTokens = sortTokensByRecent(filteredTokens);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">

        {/* Tabs for different views */}
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="bg-transparent flex mb-8 gap-2">
            <TabsTrigger
              value="trending"
              className="text-sm border border-white/10 data-[state=active]:bg-purple-500/20 text-white cursor-pointer"
            >
              <Flame className="size-4" />
              {t.home.trending}
            </TabsTrigger>
            <TabsTrigger
              value="marketcap"
              className="text-sm border border-white/10 data-[state=active]:bg-purple-500/20 text-white cursor-pointer"
            >
              <ChartArea className="size-4" />
              {t.home.topMC}
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className=" text-sm border border-white/10 data-[state=active]:bg-purple-500/20 text-white cursor-pointer"
            >
              <Clock className="size-4 mr-2" />
              {t.home.recent}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-6">
              {trendingTokens.map((token, index) => (
                <TokenCard key={token.contractAddress} token={token} isFirst={index === 0} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketcap">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-4 gap-6">
              {topmarketcapTokens.map((token, index) => (
                <TokenCard key={token.contractAddress} token={token} isFirst={index === 0} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-4 gap-6">
              {recentTokens.map((token, index) => (
                <TokenCard key={token.contractAddress} token={token} isFirst={index === 0} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
