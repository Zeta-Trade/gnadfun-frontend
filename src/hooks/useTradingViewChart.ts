import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';

type CandlestickPoint = { time: UTCTimestamp; open: number; high: number; low: number; close: number };
type VolumePoint = { time: UTCTimestamp; value: number; color?: string };

export function useTradingViewChart(
  ohlcv: Array<CandlestickPoint & { volume: number }>,
  options?: { dark?: boolean; simulateLive?: boolean; tickIntervalMs?: number }
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const simTimerRef = useRef<number | null>(null);

  // Append a single OHLCV point (time in seconds)
  const appendPoint = (pt: CandlestickPoint & { volume: number }) => {
    try {
      if (candleSeriesRef.current) candleSeriesRef.current.update({ time: pt.time, open: pt.open, high: pt.high, low: pt.low, close: pt.close } as any);
      if (volumeSeriesRef.current) volumeSeriesRef.current.update({ time: pt.time, value: pt.volume, color: pt.close >= pt.open ? '#4caf50' : '#f44336' } as any);
    } catch (e) {}
  };

  // Live simulator (for demo). It updates the chart by creating synthetic bars periodically.
  const startSimulation = (intervalMs = options?.tickIntervalMs || 3000) => {
    stopSimulation();
    if (!chartRef.current || !candleSeriesRef.current || !volumeSeriesRef.current) return;
    // derive last point from series data (we stored initial ohlcv in closure)
    let last = ohlcv[ohlcv.length - 1];
    simTimerRef.current = window.setInterval(() => {
      const nextTime = (last.time as number) + 60 * 60; // assume hourly resolution
      const change = (Math.random() - 0.5) * 2;
      const open = last.close;
      const close = Math.max(0.1, +(open + change).toFixed(2));
      const high = Math.max(open, close) + Math.random() * 1.2;
      const low = Math.min(open, close) - Math.random() * 1.2;
      const volume = Math.round(Math.random() * 1200 + 20);
      const pt = { time: nextTime as UTCTimestamp, open, high, low, close, volume };
      appendPoint(pt);
      last = pt;
    }, intervalMs) as unknown as number;
  };

  const stopSimulation = () => {
    if (simTimerRef.current) {
      window.clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous
    if (chartRef.current) {
      try { chartRef.current.remove(); } catch (e) {}
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { color: options?.dark ? '#7c2ff7ff' : '#ffffff' },
        textColor: options?.dark ? '#e6eef8' : '#222222',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      rightPriceScale: { scaleMargins: { top: 0.15, bottom: 0.2 } },
      timeScale: { borderColor: 'rgba(255,255,255,0.06)' },
    });

    // Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
      borderVisible: false,
    });

    // Volume histogram
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    // Prepare data
    const candleData: CandlestickPoint[] = ohlcv.map((d) => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close }));
    const volumeData: VolumePoint[] = ohlcv.map((d) => ({ time: d.time, value: d.volume, color: d.close >= d.open ? '#4caf50' : '#f44336' }));

    candleSeries.setData(candleData as any);
    volumeSeries.setData(volumeData as any);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // start simulator if requested
    if (options?.simulateLive) {
      // start after a short delay to ensure chart is fully ready
      setTimeout(() => startSimulation(), 500);
    }

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      try { chart.remove(); } catch (e) {}
      chartRef.current = null;
    };
  }, [ohlcv, options?.dark]);


  // Expose API: container ref and helpers
  const setVisibleRange = (from: UTCTimestamp, to: UTCTimestamp) => {
    if (!chartRef.current) return;
    try { chartRef.current.timeScale().setVisibleRange({ from, to }); } catch (e) {}
  };

  const resetZoom = () => {
    if (!chartRef.current) return;
    try { chartRef.current.timeScale().fitContent(); } catch (e) {}
  };

  return {
    containerRef,
    chartRef,
    setVisibleRange,
    resetZoom,
    // control live simulation externally
    startSimulation,
    stopSimulation,
  };
}

export type { CandlestickPoint };
