import { mockHolders } from '../../utils/mockTokenData';
import { Droplets } from 'lucide-react';
import Pagination from '../Pagination';

export default function HoldersPanel() {
  return (
    <div className="p-4">
      <div className='border border-white/70 md:space-y-2 p-3 rounded-md mb-4'>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white text-base font-semibold">Top holders</h4>
        </div>
        <Pagination data={mockHolders} itemsPerPage={10}>
          {(paginatedHolders) => (
            <div className="space-y-2 min-h-80">
              {paginatedHolders.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    {h.isLiquidityPool && <Droplets size={14} className="text-blue-400" />}
                    <div className="text-white/70">{h.address}</div>
                  </div>
                  <div className="text-white font-semibold">{h.percentage.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          )}
        </Pagination>
      </div>
    </div>
  );
}
