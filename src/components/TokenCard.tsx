import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, formatPrice } from "../utils/formatters";
import type { Token } from "../types/token";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { LazyImage } from "./LazyImage";

interface TokenCardProps {
  token: Token;
  isFirst?: boolean;
}

export function TokenCard({ token, isFirst = false }: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0;
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <Card
      onClick={() => navigate(`/token/${token.contractAddress}`)}
      className={`bg-white/5 border-white/10 backdrop-blur-lg overflow-hidden hover:shadow-lg hover:bg-white/10 transition-all hover:scale-105 cursor-pointer ${isFirst ? 'vibrate' : ''}`}
    >
      <div className="w-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 mb-4 p-2">
          <div className="w-full">
            <LazyImage
              src={token.imageUrl}
              alt={token.name}
              className="h-64 w-full object-fill border-2 rounded-lg border-white/20"
              animationType="fade"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold truncate">{token.name}</h3>
              <Badge variant="outline" className="border-purple-400/50 text-purple-400 font-semibold">
                ${token.symbol}
              </Badge>
            </div>
            <p className="text-white/50 text-sm line-clamp-2">{token.description}</p>
          </div>
        </div>

        {/* Price Info */}
        <div className="mb-4 p-2">
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">{t.tokenCard.price}</span>
            <span className="text-white">{formatPrice(token.price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">{t.tokenCard.change24h}</span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              <span>{isPositive ? '+' : ''}{token.priceChange24h.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="">
          <div className=" bg-white/5 p-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 mb-1">
                {/* <DollarSign className="size-4 text-white/50" /> */}
                <span className="text-white/50 text-xs">{t.tokenCard.marketCap}</span>
              </div>
              <div className="text-white text-sm">{formatNumber(token.marketCap)}</div>
            </div>
            <Progress value={Math.min(token.marketCap / 1000000000 * 100, 100)} className="py-1" />
          </div>
          {/* <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="size-4 text-white/50" />
              <span className="text-white/50 text-xs">{t.tokenCard.holders}</span>
            </div>
            <div className="text-white text-sm">{token.holders.toLocaleString()}</div>
          </div> */}
        </div>

        {/* Footer */}
        {/* <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-white/50 text-xs">
            {t.tokenCard.by} {token.creator}
          </div>
          <div className="text-white/50 text-xs">
            {getTimeAgo(token.createdAt)}
          </div>
        </div> */}
      </div>
    </Card>
  );
}