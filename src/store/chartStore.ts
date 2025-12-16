import { create } from 'zustand';

type ChartStore = {
  activeTool: string | null;
  timeframe: string;
  setActiveTool: (t: string | null) => void;
  setTimeframe: (tf: string) => void;
};

export const useChartStore = create<ChartStore>((set) => ({
  activeTool: null,
  timeframe: '1h',
  setActiveTool: (t) => set({ activeTool: t }),
  setTimeframe: (tf) => set({ timeframe: tf }),
}));
