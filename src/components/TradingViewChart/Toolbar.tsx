import { } from 'react';
import { useChartStore } from '../../store/chartStore';
import classNames from 'classnames';

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '6h', '12h', '1D', '5D', '1M', '6M', '1Y', 'All'];


export default function Toolbar() {
    const { timeframe, setTimeframe } = useChartStore();

    return (
        <div className="absolute top-28 z-20 bg-transparent text-white" style={{position:"absolute", top: "130px", zIndex: "100"}}>
            <div className="flex items-center gap-2 p-2">
                <div className="flex-1 flex items-center gap-4">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={classNames('text-xs py-1 px-3 rounded-lg font-medium transition cursor-pointer', {
                                'text-[#eab308]': timeframe === tf,
                                'text-white/60 hover:text-white hover:bg-white/10': timeframe !== tf,
                            })}
                            style={timeframe === tf ? { color: 'yellow' } : {}}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
