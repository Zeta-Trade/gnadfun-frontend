import { useEffect, useRef, useState } from 'react';

type Props = {
  min: number; // unix seconds
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
};

export default function RangeSlider({ min, max, from, to, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [left, setLeft] = useState(from);
  const [right, setRight] = useState(to);
  const dragging = useRef<'left' | 'right' | null>(null);

  useEffect(() => { setLeft(from); setRight(to); }, [from, to]);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const valueForClientX = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(rect.right, clientX));
    const ratio = (x - rect.left) / rect.width;
    return Math.round(min + ratio * (max - min));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !trackRef.current) return;
      const v = valueForClientX(e.clientX);
      if (dragging.current === 'left') {
        const nv = Math.min(v, right - 1);
        setLeft(nv);
        onChange(nv, right);
      } else {
        const nv = Math.max(v, left + 1);
        setRight(nv);
        onChange(left, nv);
      }
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [left, right, min, max, onChange]);

  return (
    <div className="w-full mt-2">
      <div ref={trackRef} className="relative h-12 bg-[#0f2440] rounded overflow-hidden">
        <div className="absolute inset-0 flex items-center px-3 text-white/60 text-xs pointer-events-none">
          <div className="w-full flex justify-between">
            <span>{new Date(left * 1000).toLocaleTimeString()}</span>
            <span>{new Date(right * 1000).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Background bar */}
        <div className="absolute left-0 right-0 bottom-3 h-3 bg-[#0b1530]" />

        {/* Selected range highlight */}
        <div
          className="absolute bottom-3 h-3 bg-[#2f4170]"
          style={{ left: `${pct(left)}%`, width: `${pct(right) - pct(left)}%` }}
        />

        {/* Left handle */}
        <div
          onMouseDown={(e) => { dragging.current = 'left'; e.preventDefault(); }}
          className="absolute bottom-0 w-4 h-8 -translate-x-1/2 bg-white/10 rounded top-2 left-0 cursor-ew-resize"
          style={{ left: `${pct(left)}%` }}
        />

        {/* Right handle */}
        <div
          onMouseDown={(e) => { dragging.current = 'right'; e.preventDefault(); }}
          className="absolute bottom-0 w-4 h-8 -translate-x-1/2 bg-white/10 rounded top-2 left-0 cursor-ew-resize"
          style={{ left: `${pct(right)}%` }}
        />
      </div>
    </div>
  );
}
