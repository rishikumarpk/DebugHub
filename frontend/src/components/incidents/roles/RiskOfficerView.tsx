import { useState, useEffect } from 'react';
import { ALL_TICKERS, MARKET_NEWS_PHASE_1, MARKET_NEWS_PHASE_2 } from '../../../data/incidents/knightCapitalData';

export const RiskOfficerView = ({ phase }: any) => {
    const [tickers, setTickers] = useState(ALL_TICKERS);

    useEffect(() => {
        if (phase === 'INCIDENT') {
            const interval = setInterval(() => {
                setTickers(prev => prev.map(t => ({
                    ...t,
                    lossPhase2: t.lossPhase2 - Math.floor(Math.random() * 5000)
                })));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [phase]);

    const news = phase === 'NORMAL' ? MARKET_NEWS_PHASE_1 : MARKET_NEWS_PHASE_2;

    return (
        <div className="h-full flex flex-col pt-4 pb-4 px-4 overflow-hidden">
            <div className={`flex-1 flex gap-4 overflow-hidden mb-4 ${phase === 'INCIDENT' ? 'animate-[pulse_1s_ease-in-out_infinite] [animation-iteration-count:3]' : ''}`}>
                <div className="w-[50%] flex flex-col bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-700 tracking-wider flex justify-between">
                        <span>NYSE Exposure Monitor</span>
                        <span className="text-gray-500">154 Symbols Connected</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-gray-500 sticky top-0 bg-gray-900 shadow">
                                <tr>
                                    <th className="py-2 px-4 uppercase font-bold text-[10px]">Symbol</th>
                                    <th className="py-2 px-4 uppercase font-bold text-[10px]">Company</th>
                                    <th className="py-2 px-4 text-right uppercase font-bold text-[10px]">P&L Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {tickers.sort((a, b) => (phase === 'INCIDENT' ? a.lossPhase2 - b.lossPhase2 : a.lossPhase1 - b.lossPhase1)).map((t, i) => {
                                    const val = phase === 'NORMAL' ? t.lossPhase1 : t.lossPhase2;
                                    const isLoss = val < 0;
                                    return (
                                        <tr key={i} className={`hover:bg-gray-800 ${phase === 'INCIDENT' ? 'bg-red-900/10' : ''}`}>
                                            <td className="py-2 px-4 font-bold text-blue-400">{t.symbol}</td>
                                            <td className="py-2 px-4 text-gray-400 w-32 truncate">{t.name}</td>
                                            <td className={`py-2 px-4 text-right font-mono font-bold ${isLoss ? 'text-red-500' : 'text-green-500'}`}>
                                                {val.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="w-[50%] flex flex-col gap-4">
                    <div className="h-[60%] flex flex-col bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-700 tracking-wider">
                            Order Flow Volume
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>SELL VOLUME</span>
                                    <span className="font-mono">{phase === 'NORMAL' ? '12.4K' : '842.1K'}</span>
                                </div>
                                <div className="h-4 bg-gray-800 rounded overflow-hidden relative">
                                    <div className={`absolute left-0 top-0 h-full ${phase === 'NORMAL' ? 'bg-red-500/50 w-[45%]' : 'bg-red-500 w-[98%] animate-pulse'}`}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>BUY VOLUME</span>
                                    <span className="font-mono">{phase === 'NORMAL' ? '13.1K' : '865.3K'}</span>
                                </div>
                                <div className="h-4 bg-gray-800 rounded overflow-hidden relative">
                                    <div className={`absolute left-0 top-0 h-full ${phase === 'NORMAL' ? 'bg-green-500/50 w-[48%]' : 'bg-green-500 w-[95%] animate-pulse'}`}></div>
                                </div>
                            </div>
                            {phase === 'INCIDENT' && (
                                <div className="text-center p-4 bg-red-900/20 border border-red-900 rounded text-red-500 font-bold uppercase text-xs animate-pulse">
                                    Critical Imbalance Detected
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-[40%] flex flex-col bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-700 tracking-wider">
                            Market Intelligence Newsfeed
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {news.map((n, i) => (
                                <div key={i} className="flex space-x-3 text-xs">
                                    <span className="text-blue-500 font-bold break-words shrink-0">{n.split(':')[0]}:</span>
                                    <span className="text-gray-300">{n.split(':')[1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
