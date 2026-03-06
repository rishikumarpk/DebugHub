import { Terminal, Clock, DollarSign, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { IncidentScenario } from '../../data/incidents/types';

interface PostMortemReviewProps {
    scenario: IncidentScenario;
    gameOverReason: 'BANKRUPT' | 'STABILIZED' | null;
    revenueLost: number;
    timeElapsedSeconds: number;
    logs: string[];
    onExit: () => void;
}

export function PostMortemReview({ scenario, gameOverReason, revenueLost, timeElapsedSeconds, logs, onExit }: PostMortemReviewProps) {
    const isWin = gameOverReason === 'STABILIZED';

    // Extract user actions from logs to build the "What Happened" timeline
    const userActions = logs.filter(l => l.includes('> User Action:'));

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col font-mono overflow-y-auto">
            <div className="max-w-[1200px] w-full mx-auto p-8 flex flex-col gap-6">

                {/* Header Banner */}
                <div className={`p-6 border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${isWin ? 'border-green-500/50 bg-green-900/10' : 'border-red-500/50 bg-red-900/10'}`}>
                    <div className="flex flex-col gap-2">
                        <span className={`text-[12px] font-bold tracking-widest uppercase ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                            [ POST-MORTEM ANALYTICS COMPILED ]
                        </span>
                        <h1 className={`text-3xl font-bold uppercase ${isWin ? 'text-green-400' : 'text-red-500'}`}>
                            {isWin ? 'INCIDENT RESOLVED' : 'CASCADING FAILURE // BANKRUPTCY'}
                        </h1>
                        <p className="text-[#E0E0E0] text-[14px]">Scenario: {scenario.title}</p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-[#E0E0E0] uppercase">Time to Resolution</span>
                            <div className="flex items-center gap-2 text-2xl font-bold text-white">
                                <Clock size={20} className="text-[#E0E0E0]" /> {formatTime(timeElapsedSeconds)}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-[#E0E0E0] uppercase">Total Revenue Lost</span>
                            <div className={`flex items-center gap-2 text-2xl font-bold ${isWin ? 'text-yellow-500' : 'text-red-500'}`}>
                                <DollarSign size={20} className={isWin ? 'text-yellow-500' : 'text-red-500'} />
                                {revenueLost.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column: Timelines */}
                    <div className="flex flex-col gap-6">
                        {/* Player's Timeline */}
                        <div className="border border-[#E0E0E0]/30 bg-black p-6">
                            <div className="flex items-center gap-2 text-[#E0E0E0] border-b border-[#E0E0E0]/30 pb-2 mb-4">
                                <Activity size={16} />
                                <h2 className="text-[14px] uppercase font-bold tracking-widest">Your Command Timeline</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {userActions.length === 0 ? (
                                    <p className="text-[#E0E0E0]/50 italic text-[12px]">No actions taken.</p>
                                ) : (
                                    userActions.map((action, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-[#E0E0E0]"></div>
                                                {i !== userActions.length - 1 && <div className="w-[1px] h-full bg-[#E0E0E0]/30 mt-1"></div>}
                                            </div>
                                            <div className="text-[12px] text-[#030303] pb-4">
                                                {action.replace('> User Action: ', '')}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Optimal / Historical Path */}
                        <div className="border border-cyan-900/50 bg-cyan-900/10 p-6">
                            <div className="flex items-center gap-2 text-cyan-500 border-b border-cyan-900/50 pb-2 mb-4">
                                <CheckCircle2 size={16} />
                                <h2 className="text-[14px] uppercase font-bold tracking-widest">Optimal Historical Path</h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {scenario.postmortemData.historicalTimeline.map((item, i) => (
                                    <div key={i} className="flex gap-3 text-[12px] text-cyan-100 items-start">
                                        <span className="text-cyan-600 mt-1">&gt;</span>
                                        <p className="leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-cyan-900/30 text-[10px] text-cyan-500/70 italic">
                                * Fastest recorded team resolution: 4m 32s
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Analysis */}
                    <div className="flex flex-col gap-6">
                        {/* Root Cause */}
                        <div className="border border-yellow-900/50 bg-yellow-900/10 p-6">
                            <div className="flex items-center gap-2 text-yellow-500 border-b border-yellow-900/50 pb-2 mb-4">
                                <AlertTriangle size={16} />
                                <h2 className="text-[14px] uppercase font-bold tracking-widest">True Root Cause</h2>
                            </div>
                            <p className="text-[13px] text-yellow-100 leading-relaxed">
                                {scenario.postmortemData.realRootCause}
                            </p>
                            <div className="mt-4 bg-black/50 p-3 border border-yellow-900/50 text-[11px] text-[#030303]">
                                <span className="text-yellow-500 font-bold block mb-1">Missed 'Tells':</span>
                                The fatal log signature `[FATAL] TX_ENGINE routing loop` was present in the RAW_LOGS panel prior to the database failing over.
                            </div>
                        </div>

                        {/* Lessons Learned */}
                        <div className="border border-[#030303]/20 bg-black p-6">
                            <div className="flex items-center gap-2 text-[#030303] border-b border-[#030303]/20 pb-2 mb-4">
                                <Terminal size={16} />
                                <h2 className="text-[14px] uppercase font-bold tracking-widest">Lessons Learned</h2>
                            </div>
                            <p className="text-[13px] text-[#E0E0E0] leading-relaxed italic">
                                "{scenario.postmortemData.lessonsLearned}"
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex justify-end">
                            <button
                                onClick={onExit}
                                className="px-8 py-3 bg-[#E0E0E0] text-black hover:bg-red-600 hover:text-white uppercase tracking-widest text-[14px] font-bold transition-colors"
                            >
                                CLOSE_REPORT // RETURN_TO_HUB
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
