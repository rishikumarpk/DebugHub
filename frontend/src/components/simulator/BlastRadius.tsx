import { AlertTriangle, Database, Globe, Server } from 'lucide-react';

interface BlastRadiusProps {
    metrics: {
        errorRate: number;
        latencyMs: number;
    };
}

export function BlastRadius({ metrics }: BlastRadiusProps) {
    // Determine system overall health based on state or metrics
    const isCritical = metrics.errorRate > 0.1 || metrics.latencyMs > 2000;
    const isWarning = metrics.errorRate > 0.05 || metrics.latencyMs > 1000;

    // Hardcode a mock architecture graph for the visualizer
    // This gives the impression of a deep system map
    return (
        <div className="w-full h-full p-2 flex flex-col items-center justify-center relative overflow-hidden bg-[#030303]/5 font-mono">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#E0E0E0 1px, transparent 1px)',
                backgroundSize: '16px 16px'
            }}></div>

            <div className="relative w-full max-w-[400px] h-[160px] flex items-center justify-between z-10">
                {/* Node 1: Edge / Gateway */}
                <div className="flex flex-col items-center gap-1 z-10 w-[80px]">
                    <div className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center bg-black transition-colors duration-500 ${isCritical ? 'border-red-500 text-red-500 animate-[pulse_1s_infinite]' : 'border-green-500 text-green-500'}`}>
                        <Globe size={20} />
                    </div>
                    <span className="text-[9px] text-[#E0E0E0] uppercase font-bold tracking-wider">GATEWAY</span>
                    <span className={`text-[8px] ${isCritical ? 'text-red-500' : 'text-green-500'}`}>{isCritical ? 'ERR_503' : 'OK'}</span>
                </div>

                {/* Connection Line 1 */}
                <div className="flex-1 h-[2px] relative overflow-hidden">
                    <div className={`w-full h-full ${isCritical ? 'bg-red-500/20' : 'bg-green-500/20'}`}></div>
                    <div className={`absolute top-0 left-0 h-full w-1/3 ${isCritical ? 'bg-red-500/80 animate-[ping_1.5s_infinite]' : 'bg-green-500/80 animate-[ping_3s_infinite]'}`}></div>
                </div>

                {/* Node 2: App Tier (SMARS / Core) */}
                <div className="flex flex-col items-center gap-1 z-10 w-[80px]">
                    <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center bg-black transition-colors duration-500 ${isCritical || isWarning ? 'border-yellow-500 text-yellow-500 animate-[pulse_0.5s_infinite]' : 'border-green-500 text-green-500'}`}>
                        <Server size={20} />
                    </div>
                    <span className="text-[9px] text-[#E0E0E0] uppercase font-bold tracking-wider">ROUTER_TX</span>
                    <span className={`text-[8px] ${isCritical || isWarning ? 'text-yellow-500' : 'text-green-500'}`}>{metrics.latencyMs}ms</span>
                </div>

                {/* Connection Line 2 */}
                <div className="flex-1 h-[2px] relative overflow-hidden">
                    <div className={`w-full h-full ${isCritical ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}></div>
                    <div className={`absolute top-0 left-0 h-full w-1/3 ${isCritical ? 'bg-red-500/80 animate-[ping_1s_infinite]' : 'bg-yellow-500/80 animate-[ping_2s_infinite]'}`} style={{ animationDirection: 'reverse' }}></div>
                </div>

                {/* Node 3: Database / State */}
                <div className="flex flex-col items-center gap-1 z-10 w-[80px]">
                    <div className={`w-12 h-12 border-2 flex items-center justify-center bg-black shadow-[0_0_15px_rgba(255,0,0,0.2)] transition-colors duration-500 ${isCritical ? 'border-red-600 text-red-500 animate-pulse' : isWarning ? 'border-yellow-500 text-yellow-500' : 'border-[#E0E0E0] text-[#E0E0E0]'}`}>
                        <Database size={24} />
                    </div>
                    <span className="text-[9px] text-[#E0E0E0] uppercase font-bold tracking-wider">STATE_DB</span>
                    <span className={`text-[8px] ${isCritical ? 'text-red-500' : 'text-[#E0E0E0]'}`}>{(metrics.errorRate * 100).toFixed(1)}% DROPPED</span>
                </div>
            </div>

            {/* Overall Blast Radius Alert */}
            {isCritical && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-900/20 border border-red-500/50 px-3 py-1 rounded">
                    <AlertTriangle size={12} className="text-red-500" />
                    <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">CASCADING FAILURE DETECTED</span>
                </div>
            )}
        </div>
    );
}
