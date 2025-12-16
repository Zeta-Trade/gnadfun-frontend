import { useMemo, useState } from 'react';
import RangeSlider from './RangeSlider';
import { useTradingViewChart } from '../../hooks/useTradingViewChart';
import { generateMockOHLCV } from '@/utils/mockTokenData';


export default function TradingViewChart({ className }: { className?: string }) {
  // useChartStore imported for possible toolbar interactions
  // generate demo data
  const ohlcv = useMemo(() => generateMockOHLCV(300), []);

  // convert to the format expected by the hook (time in seconds)
  const series = ohlcv.map((d) => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }));

  const { containerRef, setVisibleRange } = useTradingViewChart(series, { dark: true });

  // slider state
  const min = series[0].time;
  const max = series[series.length - 1].time;
  const [rangeFrom, setRangeFrom] = useState<number>(Math.floor(min + (max - min) * 0.2));
  const [rangeTo, setRangeTo] = useState<number>(Math.floor(min + (max - min) * 1));
  
  const onRangeChange = (from: number, to: number) => {
    // ensure ordering
    const f = Math.min(from, to);
    const t = Math.max(from, to);
    setRangeFrom(f);
    setRangeTo(t);
    // update chart visible range (lightweight-charts expects seconds)
    setVisibleRange(f as any, t as any);
  };


  return (
    <div className={`w-full h-full flex ${className || ''}`}>
      <div className="flex-1 flex flex-col">
        {/* <Toolbar/> */}

        <div className="flex-1 flex overflow-hidden rounded-xl">
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Chart container; hook mounts chart here */}
            <div ref={containerRef} className="w-full h-full" style={{ minHeight: 360 }} />
          </div>
        </div>

        <div className="">
          <RangeSlider min={min} max={max} from={rangeFrom} to={rangeTo} onChange={onRangeChange} />
        </div>
      </div>
    </div>
  );
}
