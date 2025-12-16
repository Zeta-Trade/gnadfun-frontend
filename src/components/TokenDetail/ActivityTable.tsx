import { handleCopyAddress } from '@/utils/utils';
import { mockTransactions } from '../../utils/mockTokenData';
import Pagination from '../Pagination';
import { Copy } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

export default function ActivityTable() {

  const { formatAccount } = useWallet();

  return (
    <div className="bg-[#0d0d0d] rounded-[12px] shadow-sm p-6 mt-4">
      {/* <h3 className="text-white font-semibold mb-4" style={{ fontSize: "1.5em", fontWeight: "700" }}>Transactions</h3> */}
      <Pagination data={mockTransactions} itemsPerPage={10}>
        {(paginatedData) => (
          <div className="overflow-auto rounded">
            <table className="w-full text-sm" style={{ textAlign: "left", fontSize: "15px" }}>
              <thead className='text-white' >
                <tr className="text-white/60" style={{ color: "#FFFFFFB3" }}>
                  <th className="py-2">Time</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">USD</th>
                  <th className="px-3 py-2">MarketCap</th>
                  <th className="px-3 py-2">MON</th>
                  <th className="px-3 py-2">Address</th>
                </tr>
              </thead>
              <tbody className='text-white'>
                {paginatedData.map((tx, idx) => (
                  <tr key={tx.id} className={`${idx % 2 === 0 ? 'bg-white/2' : ''} hover:bg-white/5 transition-colors`}>
                    <td className="py-2 text-white/80">{tx.time}</td>
                    <td className="px-3 py-2"><span className={`py-1 rounded-full text-xs font-semibold ${tx.type === 'Sell' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{tx.type.toUpperCase()}</span></td>
                    <td className="px-3 py-2 text-white/80">{tx.usd}</td>
                    <td className="px-3 py-2 text-white/80">{tx.tokens}</td>
                    <td className="px-3 py-2 text-white/80">{tx.bnb}</td>
                    <td className="flex justify-between align-middle items-center w-54 gap-x-2 px-3 py-2 text-white/60 font-mono">
                      <div>
                        {formatAccount(tx.address)}
                      </div>
                      <button
                        onClick={() => handleCopyAddress(tx?.address ?? '')}
                        className="p-1 rounded transition-colors hover:text-white cursor-pointer"
                        title="Copy contract address"
                      >
                        <Copy size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Pagination>
    </div>
  );
}
