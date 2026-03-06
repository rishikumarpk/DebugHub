import { useEffect, useState } from 'react';

interface RevenueGraphProps {
    revenueLost: number;
    burnRatePerSec: number;
}

export function RevenueGraph({ revenueLost, burnRatePerSec }: RevenueGraphProps) {
    const [dataPoints, setDataPoints] = useState<number[]>([]);

    // Sample the burn rate every second to build a sparkline graph
    useEffect(() => {
        setDataPoints(prev => {
            const next = [...prev, burnRatePerSec];
            // Keep last 40 data points (40 seconds of history visible)
            if (next.length > 40) return next.slice(next.length - 40);
            return next;
        });
    }, [burnRatePerSec, revenueLost]);

    // Calculate max to scale the SVG
    const maxBurn = Math.max(...dataPoints, 100000); // 100k minimum ceiling

    return (
        <div className="flex flex-col gap-1 font-mono w-full">
            <div className="flex justify-between items-end text-[10px] text-[#E0E0E0]">
                <span className="uppercase opacity-70">Bleed Rate History</span>
                <span className="text-red-500 font-bold">${burnRatePerSec.toLocaleString()}/s</span>
            </div>
            <div className="w-full h-[60px] border border-[#E0E0E0]/30 bg-black relative flex items-end justify-between px-1 pb-1 pt-4 overflow-hidden group">
                {/* Horizontal reference lines */}
                <div className="absolute top-1/2 left-0 w-full border-b border-dashed border-[#E0E0E0]/20"></div>
                <div className="absolute top-1 left-1 text-[8px] text-[#E0E0E0]/50">MAX_BURN</div>

                {dataPoints.map((val, i) => {
                    const heightPercent = Math.max((val / maxBurn) * 100, 2); // At least 2% height so it's visible
                    const isSpiking = val > 150000;
                    return (
                        <div
                            key={i}
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full mx-[1px] transition-all duration-300 ${isSpiking ? 'bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'bg-red-900/60 group-hover:bg-red-800'}`}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
