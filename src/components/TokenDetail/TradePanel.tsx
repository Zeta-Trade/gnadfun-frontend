import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TradePanel() {
  const t = useTranslation();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState(0);
  // const [slippage, setSlip] = useState('0');
  const [slip, setSlip] = useState(1);
  
  const handleSlippageChange = (percent: number) => {
    if (percent === 0) {
      setSlip(0);
    } else {
      setSlip(percent);
    }
  };

  const handleAmountChange = (amount: number) => {
    setAmount(amount);
  };

  return (
    <div className='border-2 border-purple-900 bg-white/10 p-6 rounded-md bg-transparent'>
        <div className="grid grid-cols-2 mb-8">
          <button onClick={() => setMode('buy')} className={`${mode === 'buy' ? 'bg-btn-buy text-black' : 'bg-gray-500 text-white'} py-2 rounded-md cursor-pointer`}>{t.trading.buy}</button>
          <button onClick={() => setMode('sell')} className={`${mode === 'sell' ? 'bg-btn-sell text-white' : 'bg-gray-500 text-white'} py-2 rounded-md cursor-pointer`}>{t.trading.sell}</button>
        </div>
        <div id='slippage'>
        <div className='text-white/50 mb-1'>Slippage(%)</div>
        <div className="bg-white/5 p-3 rounded-md mb-4">
          <div className="flex items-center gap-3">
            <input value={slip} onChange={(e) => handleSlippageChange(Number(e.target.value))} placeholder="2" className="flex-1 bg-transparent outline-none text-white placeholder-gray-100" />
          </div>
        </div>
        </div>
        <div id='trade-amount'>
        <div className='text-white/50 mb-1'>Amount</div>
        <div className="bg-white/5 p-3 rounded-md mb-4">
          <div className="flex items-center gap-3">
            <input value={amount} onChange={(e) => handleAmountChange(Number(e.target.value))} placeholder="0" className="flex-1 bg-transparent outline-none text-white" />
            <div className="text-white/60 text-xs">{t.common.balance} 0</div>
          </div>
        </div>
        </div>
        <button className="w-full py-3 rounded-md font-semibold" disabled style={{ backgroundColor: "#ffd102ff", opacity: amount > 0 && slip > 0 ? "1" : ".8" }}>{t.common.connectWallet}</button>
      </div>
      
    // <div className="bg-white/10 p-4 rounded-md bg-gray-900">
    //   <div className="flex gap-3">
    //     <button
    //       onClick={() => setMode('buy')}
    //       className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
    //         mode === 'buy'
    //           ? 'bg-[#00ff9a] text-black'
    //           : 'bg-white/10 text-white hover:bg-white/15'
    //       }`}
    //     >
    //       {t.trading.buy}
    //     </button>
    //     <button
    //       onClick={() => setMode('sell')}
    //       className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
    //         mode === 'sell'
    //           ? 'bg-[#ff6b6b] text-white'
    //           : 'bg-white/10 text-white hover:bg-white/15'
    //       }`}
    //     >
    //       {t.trading.sell}
    //     </button>
    //   </div>

    //   <div className="flex items-center justify-between text-sm">
    //     <span className="text-white/60">{t.common.balance} 0 {mode === 'buy' ? 'ETH' : 'MANYU Musk'}</span>
    //     <button className="text-white/60 hover:text-white text-xs underline">{t.trading.slip} {/* {slip} */}%</button>
    //   </div>

    //   <div className="bg-white/5 rounded-lg p-4">
    //     <input
    //       type="text"
    //       value={amount}
    //       onChange={handleAmountChange}
    //       placeholder="0.00"
    //       className="w-full bg-transparent text-white text-lg outline-none placeholder-white/40"
    //     />
    //   </div>

    //   <div className="text-center py-2">
    //     <span className="text-white/60 text-sm">{t.trading.total}</span>
    //     <div className="text-white text-xl font-bold">{total}</div>
    //   </div>

    //   <button
    //     className={`w-full py-3 rounded-lg font-bold text-black transition-all duration-200 ${
    //       amount === '0.00' || amount === ''
    //         ? 'bg-[#7cb342] opacity-60 cursor-not-allowed'
    //         : 'bg-[#7cb342] hover:bg-[#9ccc65] opacity-100'
    //     }`}
    //     disabled={amount === '0.00' || amount === ''}
    //   >
    //     {t.common.enterAmount}
    //   </button>
    // </div>
  );
}
