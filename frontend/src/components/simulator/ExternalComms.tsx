import { MessageSquare, Twitter, AlertTriangle } from 'lucide-react';
import type { IncidentAlert } from '../../data/incidents/types';

interface ExternalCommsProps {
    timeElapsedSeconds: number;
    activeAlerts: IncidentAlert[];
}

export function ExternalComms({ timeElapsedSeconds, activeAlerts }: ExternalCommsProps) {
    // Generate a scrolling feed of comms based on elapsed time + official alerts

    return (
        <div className="flex flex-col h-full font-mono">
            {/* Live External Pressure Feed */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 mb-4">
                <span className="text-[10px] text-[#E0E0E0] uppercase">LIVE_INCOMING_TRAFFIC:</span>

                {/* Mock Baseline Pressure */}
                <div className="border border-cyan-900/40 bg-cyan-900/10 p-2 flex flex-col gap-1 relative group">
                    <Twitter size={10} className="absolute top-2 right-2 text-cyan-500 opacity-50" />
                    <span className="text-[9px] text-cyan-500 font-bold">@AngryTrader99</span>
                    <span className="text-[11px] text-[#E0E0E0] italic">"Is anyone else seeing rejected orders on the main exchange? This is costing me money."</span>
                </div>

                {/* Render Official Scenario Alerts */}
                {activeAlerts.map((alert, idx) => {
                    const isSlack = alert.type === 'slack';
                    const isSystem = alert.type === 'system';

                    return (
                        <div key={idx} className={`border p-2 flex flex-col gap-1 relative ${isSlack ? 'border-red-900/40 bg-red-900/10' : 'border-[#E0E0E0]/40 bg-[#E0E0E0]/10'}`}>
                            {isSlack ? (
                                <MessageSquare size={10} className="absolute top-2 right-2 text-red-500 opacity-50" />
                            ) : isSystem ? (
                                <AlertTriangle size={10} className="absolute top-2 right-2 text-yellow-500 opacity-50" />
                            ) : null}
                            <span className={`text-[9px] font-bold ${isSlack ? 'text-red-500' : 'text-[#E0E0E0]'}`}>
                                {isSlack ? 'INTERNAL SLACK: leadership-channel' : `ALERT: ${alert.type.toUpperCase()}`}
                            </span>
                            <span className="text-[11px] text-[#E0E0E0] font-bold">"{alert.message}"</span>
                        </div>
                    );
                })}

                {timeElapsedSeconds > 45 && (
                    <div className="border border-cyan-900/40 bg-cyan-900/10 p-2 flex flex-col gap-1 relative">
                        <Twitter size={10} className="absolute top-2 right-2 text-cyan-500 opacity-50" />
                        <span className="text-[9px] text-cyan-500 font-bold">@TechCrunch</span>
                        <span className="text-[11px] text-[#E0E0E0] italic">"Breaking: Major trading platform experiencing catastrophic routing failures resulting in millions lost."</span>
                    </div>
                )}
            </div>

            {/* Status Page Draft Area */}
            <div className="flex-1 flex flex-col gap-2 shrink-0 max-h-[140px]">
                <span className="text-[10px] text-[#E0E0E0] uppercase font-bold border-t border-[#030303]/20 pt-2">STATUS PAGE DRAFT:</span>
                <textarea
                    className="flex-1 bg-black/50 border border-[#E0E0E0]/30 p-2 text-[11px] text-[#E0E0E0] font-mono resize-none outline-none focus:border-[#E0E0E0] transition-colors"
                    placeholder="We are currently investigating reports of..."
                    defaultValue="We are currently investigating anomalous routing behavior. Our engineering team is..."
                />
                <button className="w-full py-1.5 bg-[#E0E0E0]/20 text-[#E0E0E0] border border-[#E0E0E0]/50 text-[10px] uppercase hover:bg-[#E0E0E0]/40 transition-colors font-bold tracking-widest">
                    PUBLISH_UPDATE
                </button>
            </div>
        </div>
    );
}
