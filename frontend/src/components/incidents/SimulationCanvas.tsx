import { useState, useEffect } from 'react';
import { TimerBar } from './shared/TimerBar';
import { PLCounter } from './shared/PLCounter';
import { CrashOverlay } from './shared/CrashOverlay';
import { DebriefScreen } from './shared/DebriefScreen';
import { SystemsEngineerView } from './roles/SystemsEngineerView';
import { RiskOfficerView } from './roles/RiskOfficerView';
import { DevOpsEngineerView } from './roles/DevOpsEngineerView';
import { DecisionBar } from './shared/DecisionBar';
import { SIM_CONFIG, DECISIONS } from '../../data/incidents/knightCapitalData';

export const SimulationCanvas = ({ role, onAbort, onReset }: any) => {
    const [phase, setPhase] = useState('NORMAL'); // NORMAL, INCIDENT, RESOLVED, FAILED
    const [timeLeft, setTimeLeft] = useState(SIM_CONFIG.timerStart);
    const [losses, setLosses] = useState(0);
    const [showCrash, setShowCrash] = useState(false);
    const [debriefData, setDebriefData] = useState<any>(null);
    const [feedbackMsg, setFeedbackMsg] = useState<{ text: string, type: 'WARNING' | 'CORRECT' } | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (phase === 'NORMAL' || phase === 'INCIDENT') {
            timer = setInterval(() => {
                setTimeLeft(t => Math.max(0, t - 1));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [phase]);

    useEffect(() => {
        let t2: ReturnType<typeof setTimeout>;
        if (phase === 'NORMAL') {
            t2 = setTimeout(() => {
                setPhase('INCIDENT');
            }, SIM_CONFIG.normalPhaseDuration * 1000);
        }
        return () => clearTimeout(t2);
    }, [phase]);

    useEffect(() => {
        let t3: ReturnType<typeof setInterval>;
        if (phase === 'INCIDENT') {
            t3 = setInterval(() => {
                setLosses(L => L - SIM_CONFIG.plossRatePerSecond);
            }, 1000);
        }
        return () => clearInterval(t3);
    }, [phase]);

    useEffect(() => {
        if (timeLeft === 0 && (phase === 'NORMAL' || phase === 'INCIDENT')) {
            handleFailure();
        }
    }, [timeLeft, phase]);

    const handleFailure = () => {
        setPhase('FAILED');
        setShowCrash(true);
        setTimeout(() => {
            setShowCrash(false);
            setDebriefData({ success: false, timeTaken: SIM_CONFIG.timerStart - timeLeft, plLost: losses });
        }, 3000);
    };

    const handleSuccess = () => {
        setPhase('RESOLVED');
        setDebriefData({ success: true, timeTaken: SIM_CONFIG.timerStart - timeLeft, plLost: losses });
    };

    const handleDecision = (decision: any) => {
        if (decision.outcome === 'FATAL') {
            handleFailure();
        } else if (decision.outcome === 'WARNING') {
            setTimeLeft(t => Math.max(0, t - SIM_CONFIG.warningTimePenalty));
            setFeedbackMsg({ text: decision.feedback, type: 'WARNING' });
            setTimeout(() => setFeedbackMsg(null), 5000);
        } else if (decision.outcome === 'CORRECT') {
            handleSuccess();
        }
    };

    if (debriefData) {
        return <DebriefScreen
            success={debriefData.success}
            timeTaken={debriefData.timeTaken}
            plLost={debriefData.plLost}
            onRetry={() => {
                setPhase('NORMAL');
                setTimeLeft(SIM_CONFIG.timerStart);
                setLosses(0);
                setDebriefData(null);
            }}
            onReset={onReset}
        />;
    }

    const renderRoleView = () => {
        switch (role) {
            case 'Systems Engineer': return <SystemsEngineerView phase={phase} onDecision={handleDecision} disabled={phase === 'FAILED' || phase === 'RESOLVED'} />;
            case 'Risk Officer': return <RiskOfficerView phase={phase} onDecision={handleDecision} disabled={phase === 'FAILED' || phase === 'RESOLVED'} />;
            case 'DevOps Engineer': return <DevOpsEngineerView phase={phase} onDecision={handleDecision} disabled={phase === 'FAILED' || phase === 'RESOLVED'} />;
            default: return <SystemsEngineerView phase={phase} onDecision={handleDecision} disabled={phase === 'FAILED' || phase === 'RESOLVED'} />;
        }
    };

    return (
        <div className={`h-[calc(100vh-64px)] overflow-hidden bg-black flex flex-col relative transition-colors duration-500 ${phase === 'RESOLVED' ? 'bg-green-900/20' : ''}`}>
            <CrashOverlay visible={showCrash} />

            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 flex-shrink-0 z-10 w-full">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded text-sm font-bold uppercase border border-blue-800">
                        {role || 'On-Call Systems Engineer'}
                    </div>
                    <div className={`text-sm font-bold uppercase tracking-widest ${phase === 'INCIDENT' ? 'text-red-500 animate-[pulse_1s_ease-in-out_infinite]' : 'text-gray-500'}`}>
                        {phase === 'INCIDENT' ? 'PRODUCTION INCIDENT ONGOING' : phase}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <PLCounter losses={losses} />
                    <TimerBar timeLeft={timeLeft} />
                    <button
                        onClick={onAbort}
                        className="ml-4 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm font-bold uppercase transition-colors"
                    >
                        Abort
                    </button>
                </div>
            </div>

            {feedbackMsg && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                    <div className={`px-6 py-4 rounded shadow-2xl border-l-4 ${feedbackMsg.type === 'WARNING' ? 'bg-amber-900/90 border-amber-500 text-amber-200' : 'bg-green-900/90 border-green-500 text-green-200'}`}>
                        <p className="font-bold">{feedbackMsg.type}</p>
                        <p className="text-sm mt-1">{feedbackMsg.text}</p>
                    </div>
                </div>
            )}

            {/* Role View Canvas (takes up remaining height) */}
            <div className="flex-1 overflow-hidden relative z-0">
                {renderRoleView()}
            </div>

            {/* Decision Bar */}
            <div className={`h-24 flex-shrink-0 z-10 relative transition-transform duration-500 ${(phase === 'NORMAL' || phase === 'RESOLVED' || phase === 'FAILED') ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                <DecisionBar
                    decisions={DECISIONS[role === 'Systems Engineer' ? 'systems_engineer' : role === 'Risk Officer' ? 'risk_officer' : 'devops_engineer']}
                    onDecision={handleDecision}
                    disabled={phase === 'NORMAL' || phase === 'RESOLVED' || phase === 'FAILED'}
                />
            </div>
        </div>
    );
};
