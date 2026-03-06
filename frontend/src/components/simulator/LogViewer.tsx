import { useState } from 'react';
import { Filter } from 'lucide-react';

interface LogViewerProps {
    logs: string[];
    timeElapsedSeconds: number;
}

export function LogViewer({ logs, timeElapsedSeconds }: LogViewerProps) {
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'ERROR' | 'WARN' | 'TX'>('ALL');

    const filteredLogs = logs.filter(log => {
        if (activeFilter === 'ALL') return true;
        return log.includes(`[${activeFilter}]`) || (activeFilter === 'ERROR' && log.includes('FATAL'));
    });

    return (
        <div className="flex flex-col h-full font-mono text-[10px]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#030303]/20 shrink-0">
                <Filter size={12} className="text-[#E0E0E0]" />
                <div className="flex gap-2">
                    {(['ALL', 'ERROR', 'WARN', 'TX'] as const).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-2 py-0.5 border transition-colors ${activeFilter === filter
                                    ? 'bg-[#E0E0E0] text-black border-[#E0E0E0]'
                                    : 'border-[#E0E0E0]/30 text-[#E0E0E0] hover:bg-[#E0E0E0]/10'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-1">
                {filteredLogs.length === 0 ? (
                    <div className="text-[#E0E0E0]/40 italic text-center mt-4">NO MATCHING LOGS IN BUFFER</div>
                ) : (
                    filteredLogs.map((log, i) => {
                        const isErr = log.includes('ERROR') || log.includes('FATAL');
                        const isWarn = log.includes('WARN');
                        const isTx = log.includes('TX');

                        let textColor = 'text-[#E0E0E0]';
                        if (isErr) textColor = 'text-red-500 font-bold';
                        else if (isWarn) textColor = 'text-yellow-500';
                        else if (isTx) textColor = 'text-cyan-500';

                        return (
                            <div key={i} className={`flex gap-2 leading-tight ${textColor} hover:bg-[#E0E0E0]/10 cursor-crosshair px-1`}>
                                <span className="opacity-40 shrink-0 select-none">[{timeElapsedSeconds.toString().padStart(4, '0')}]</span>
                                <span className="break-all">{log}</span>
                            </div>
                        );
                    })
                )}
                {/* Fake trailing cursor pulse inline with logs */}
                <div className="flex gap-2 mt-1 px-1">
                    <span className="opacity-40 shrink-0 select-none">[{timeElapsedSeconds.toString().padStart(4, '0')}]</span>
                    <span className="w-1.5 h-3 bg-gray-500 animate-[pulse_1s_infinite]"></span>
                </div>
            </div>
        </div>
    );
}
