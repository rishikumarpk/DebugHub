import { useNavigate } from 'react-router-dom';
import { allScenarios } from '../data/incidents';
import { ShieldAlert, TrendingDown, ArrowRight, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Incidents() {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-[calc(100vh-48px)] bg-[#030303] p-8 md:p-12">
            <div className="max-w-[1200px] mx-auto">

                <div className="mb-12 animate-[fade-up_0.5s_ease-out]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-[12px] bg-[#E0E0E026] flex items-center justify-center">
                            <ShieldAlert size={28} className="text-[#E0E0E0]" />
                        </div>
                        <h1 className="font-display text-[40px] font-bold text-[#E0E0E0] leading-tight">Production Incident Simulator</h1>
                    </div>
                    <p className="font-body text-[18px] text-[#E0E0E073] max-w-[800px]">
                        Step into the on-call shoes during historical software outages. Diagnose the root cause, take immediate stabilizing actions, and manage skyrocketing latency and revenue loss. Can you save the company?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allScenarios.map((scenario: any, i: number) => (
                        <div
                            key={scenario.id}
                            style={{ animationDelay: `${i * 100}ms` }}
                            className="bg-[#030303] border border-[#E0E0E040] rounded-[16px] overflow-hidden hover:border-[#E0E0E080] transition-all hover:shadow-[0_8px_32px_rgba(224,92,122,0.15)] flex flex-col group animate-[fade-up_0.5s_ease-out_both]"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[12px] font-bold tracking-wider text-[#E0E0E0] uppercase">{scenario.company}</div>
                                    <Badge color={scenario.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
                                        {scenario.difficulty}
                                    </Badge>
                                </div>

                                <h3 className="font-display font-bold text-[22px] text-[#E0E0E0] mb-2 group-hover:text-[#E0E0E0] transition-colors">
                                    {scenario.title}
                                </h3>
                                <p className="font-body text-[14px] text-[#E0E0E073] mb-6 flex-1">
                                    {scenario.date}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-[13px] font-body text-[#E0E0E0]">
                                        <TrendingDown size={16} className="text-[#E0E0E0]" />
                                        <span><strong className="text-[#E0E0E0]">Impact:</strong> {scenario.impactSummary}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[13px] font-body text-[#E0E0E0]">
                                        <Activity size={16} className="text-[#E0E0E0]" />
                                        <span><strong className="text-[#E0E0E0]">Tags:</strong> {scenario.tags.join(', ').replace(/_/g, ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-[#030303] border-t border-[#E0E0E040] flex justify-between items-center">
                                <span className="font-code text-[12px] text-[#E0E0E040]">Simulation Ready</span>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(scenario.id === 'knight-capital-2012' ? '/incidents/knight-capital' : `/simulator/${scenario.id}`)}
                                    className="border-[#E0E0E040] text-[#E0E0E0] hover:bg-[#E0E0E01A] hover:border-[#E0E0E0] px-4 py-2"
                                >
                                    Start Incident <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
