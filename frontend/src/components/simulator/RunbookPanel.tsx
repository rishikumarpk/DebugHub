import { BookOpen } from 'lucide-react';

interface RunbookStep {
    id: string;
    text: string;
    isRedacted: boolean;
}

export function RunbookPanel() {
    // Ideally this comes from the scenario data, but simulating it inline currently
    const steps: RunbookStep[] = [
        { id: '1', text: 'Verify GATEWAY routing flags via `curl -I config/routes`', isRedacted: false },
        { id: '2', text: 'If traffic spike detected, shed load on non-critical endpoints.', isRedacted: false },
        { id: '3', text: 'REDACTED PROTOCOL: Ensure feature flag [██████_8_████] is disabled on all legacy clusters BEFORE pushing the new update.', isRedacted: true },
        { id: '4', text: 'Monitor DB connection latency in Panel 3.', isRedacted: false },
        { id: '5', text: 'If DB latency > 1500ms, immediately issue `./execute rollback_tx_engine`.', isRedacted: false }
    ];

    return (
        <div className="flex flex-col h-full font-mono">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#030303]/20 text-[#E0E0E0] shrink-0">
                <BookOpen size={14} />
                <span className="font-bold text-[11px] uppercase tracking-widest">SOP // Emergency Runbook v2.4</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 text-[10px]">
                {steps.map((step, idx) => (
                    <div key={step.id} className="flex gap-3 group">
                        <span className="text-[#E0E0E0]/50 shrink-0 w-4 text-right">0{idx + 1}</span>
                        <p className={`leading-relaxed ${step.isRedacted ? 'text-red-500/80' : 'text-[#E0E0E0]'}`}>
                            {step.isRedacted ? (
                                <span className="relative">
                                    <span className="animate-[pulse_0.1s_linear_infinite] px-1 bg-red-900/20 mix-blend-screen text-red-500 italic">
                                        [CORRUPTED SECTOR DETECTED]
                                    </span>
                                    <br />
                                    {/* The visual 'redaction' string */}
                                    <span className="opacity-90 leading-loose">Ensure feature flag <span className="bg-red-500 text-red-500">█████_8</span> is disabled on all <span className="bg-red-500 text-red-500">██████</span> BEFORE pushing the new update.</span>
                                </span>
                            ) : (
                                step.text
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
