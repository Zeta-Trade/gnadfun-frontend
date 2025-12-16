import { bondingCurveData } from '../../utils/mockTokenData';
import { useTranslation } from '@/hooks/useTranslation';
import TradePanel from './TradePanel';

export default function BondingPanel() {
  const t = useTranslation();
  const data = bondingCurveData;

  return (
    <div className="p-4 space-y-4">
      <div className='border-2 border-purple-900 rounded-lg md:space-y-2 p-3 rounded-md mb-12'>
        <div className="text-center">
          <h3 className="text-white font-semibold">{t.trading.bondingCurve}</h3>
        </div>

        <div className="mb-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-md font-base-white/70">{t.trading.progress}</span>
            
            <span className="font-base-white/70 font-bold text-md">{data.progressPercent}%</span>
          </div>
          <div className="w-full bg-white/6 rounded-full h-2 overflow-hidden">
            <div className="font-base-white/70 bg-[#00ff9a] h-full" style={{ width: `${data.progressPercent}%` }} />
          </div>
          <div className="font-base-white/70 text-md flex justify-between">
            <span>{data.tokenLeft} {t.trading.left}</span>
            <span>{data.bnbCollected} BNB {t.trading.collected}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="p-3 rounded-md bg-white/5 text-center">
          <div className="font-base-white/70 text-sm">{t.trading.price}</div>
          <div className="text-white font-bold text-lg">0.0{(778).toString()}</div>
        </div>
        <div className="p-3 rounded-md bg-white/5 text-center">
          <div className="font-base-white/70 text-sm">{t.trading.marketCap}</div>
          <div className="text-white font-bold text-lg">$7297.94</div>
        </div>
        <div className="p-3 rounded-md bg-white/5 text-center">
          <div className="font-base-white/70 text-sm">{t.trading.virtualLiquidity}</div>
          <div className="text-white font-bold text-lg">$29.82</div>
        </div>
        <div className="p-3 rounded-md bg-white/5 text-center">
          <div className="font-base-white/70 text-sm">{t.trading.volume24h}</div>
          <div className="text-white font-bold text-lg">$0</div>
        </div>
      </div>

      <TradePanel />
    </div>
  );
}
