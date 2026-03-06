import { useState, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Play, Check, Bug, ShieldCheck } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SplitPathView from '../components/ui/SplitPathView';
import { API_URL, getAuthHeaders } from '../config';

interface Challenge {
    id: string;
    date: string;
    language: string;
    bugType: string;
    difficulty: string;
    context: string;
    buggyCode: string;
    correctCode?: string; // Optional, only for internal use/mock
    expectedOutput: string;
    hint1: string;
    hint2: string;
    hint3: string;
}

export function Challenge() {
    const { user } = useAuthStore();
    const { editorFontSize } = useSettingsStore();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [hintsRevealed, setHintsRevealed] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [running, setRunning] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);

    const [isAlreadySolved, setIsAlreadySolved] = useState<boolean>(false);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [showSplitView, setShowSplitView] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/api/challenges/today`, {
            credentials: 'include',
            headers: getAuthHeaders()
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setChallenge(d.data);
                    setCode(d.data.buggyCode);
                    if (d.data.isSolved) {
                        setIsAlreadySolved(true);
                        // Removed setSuccess(true) here to prevent premature "Bug Fixed" modal
                    }
                }
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    // Timer logic
    useEffect(() => {
        if (!success && !loading && challenge) {
            const timer = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [success, loading, challenge]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // MOCK DATA for layout testing if backend fails
    const activeChallenge = challenge || {
        id: '1', date: new Date().toISOString(), language: 'python', bugType: 'logic', difficulty: 'easy',
        context: 'Part of a student grade calculator app',
        expectedOutput: '> 80.0',
        buggyCode: 'def get_average(grades):\n    total = 0\n    for g in grades:\n        total += g\n    return total / len(grades) + 1\n\nprint(get_average([70, 80, 90]))',
        hint1: 'Check the return statement.',
        hint2: 'Why are we adding 1?',
        hint3: 'Remove the +1 to get the correct average.'
    } as Challenge;

    const handleRun = async () => {
        setRunning(true);
        setOutput('Running...');
        try {
            await new Promise(r => setTimeout(r, 600));
            if (!challenge) throw new Error('Mock');
            const res = await fetch(`${API_URL}/api/challenges/${challenge.id}/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ code }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setOutput(data.data.stdout || data.data.stderr || 'No output');
            } else {
                setOutput(data.error || 'Execution failed');
            }
        } catch (e: any) {
            // Mock fallback if backend is offline
            setOutput('> ' + activeChallenge.expectedOutput.replace('> ', ''));
        }
        setRunning(false);
    };

    const handleSubmit = async () => {
        setRunning(true);
        try {
            if (!challenge) throw new Error('Mock');
            const res = await fetch(`${API_URL}/api/challenges/${challenge.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ code, hintsUsed: hintsRevealed, timeTakenMs: timeElapsed * 1000 }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(data.data.isSolved);
                setOutput(data.data.actual);
                if (data.data.attemptId) {
                    setAttemptId(data.data.attemptId);
                }
                // Refresh user data in the global store to update streak/topbar
                fetch(`${API_URL}/auth/me`, {
                    credentials: 'include',
                    headers: getAuthHeaders()
                })
                    .then(r => r.json())
                    .then(d => {
                        if (d.success) {
                            const { setUser } = useAuthStore.getState();
                            setUser(d.data);
                        }
                    });
            }
        } catch (e) {
            console.error('Submission failed', e);
            setOutput('Error: Connection lost. Please try again.');
        } finally {
            setRunning(false);
        }
    };

    const handleDownloadCard = () => {
        if (cardRef.current) {
            toPng(cardRef.current, {
                cacheBust: true,
                backgroundColor: '#030303',
                pixelRatio: 2, // Ensure high quality text
                style: {
                    margin: '0', // Reset any margins that might shift text
                }
            })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `debughub-streak-${activeChallenge?.date.split('T')[0] || 'today'}.png`;
                    link.href = dataUrl;
                    link.click();
                });
        }
    };

    if (loading) return <div className="w-full h-[calc(100vh-48px)] flex items-center justify-center p-8 text-center text-[#E0E0E073] font-body bg-[#030303]">Loading Challenge...</div>;

    const hints = [activeChallenge.hint1, activeChallenge.hint2, activeChallenge.hint3];
    const streakNum = user?.streak?.currentStreak || 0;

    return (
        <div className="w-full h-[calc(100vh-48px)] flex flex-col relative bg-[#030303]">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Bug Description (280px) */}
                <div className="w-[280px] shrink-0 bg-[#030303F2] border-r border-[#E0E0E026] p-6 overflow-y-auto flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Badge color={activeChallenge.language as any}>{activeChallenge.language.toUpperCase()}</Badge>
                            <Badge color={activeChallenge.difficulty as any}>{activeChallenge.difficulty.toUpperCase()}</Badge>
                        </div>
                        <p className="italic text-[13px] text-[#E0E0E073]">"{activeChallenge.context}"</p>
                    </div>

                    <div className="divider my-0"></div>

                    <div className="flex flex-col gap-2">
                        <span className="font-body text-[13px] font-semibold text-[#E0E0E0]">Expected Output</span>
                        <div className="font-code text-[13px] text-[#E0E0E0] bg-[#030303] border border-[#E0E0E01A] p-3 rounded-[6px]">
                            {activeChallenge.expectedOutput}
                        </div>
                    </div>

                    <div className="divider my-0"></div>

                    <div className="flex flex-col gap-3 pb-12"> {/* Added padding bottom to ensure visibility when scrolled */}
                        <span className="font-body text-[13px] font-semibold text-[#E0E0E0]">Hints</span>
                        <div className="flex flex-col gap-2">
                            {[0, 1, 2].map(idx => (
                                <div key={idx}>
                                    {hintsRevealed > idx ? (
                                        <div className="bg-[#E0E0E026] border-l-[3px] border-l-[#E0E0E0] p-3 rounded-r-[6px] font-body text-[13px] text-[#E0E0E0] break-words whitespace-pre-wrap">
                                            <span className="font-semibold text-[#E0E0E0] block mb-1">Hint {idx + 1}</span>
                                            {hints[idx]}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setHintsRevealed(idx + 1)}
                                            disabled={hintsRevealed !== idx}
                                            className="w-full text-left p-3 rounded-[6px] bg-[#03030333] hover:bg-[#03030366] border border-[#E0E0E01A] text-[#E0E0E073] text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
                                        >
                                            Reveal Hint {idx + 1}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {hintsRevealed > 0 && (
                            <span className="text-[12px] text-[#E0E0E0] font-semibold mt-2">{hintsRevealed}/3 hints used</span>
                        )}
                        {hintsRevealed >= 3 && success !== true && (
                            <button
                                onClick={async () => {
                                    if (!activeChallenge.id || activeChallenge.id === '1') {
                                        console.warn('Real challenge not loaded, fallback to mock correct code');
                                        setCode(activeChallenge.correctCode || '');
                                        return;
                                    }
                                    try {
                                        const res = await fetch(`${API_URL}/api/challenges/${activeChallenge.id}/answer`, {
                                            credentials: 'include',
                                            headers: getAuthHeaders()
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setCode(data.data.correctCode);
                                        }
                                    } catch (e) {
                                        console.error('Failed to fetch answer', e);
                                    }
                                }}
                                className="mt-4 w-full py-4 rounded-[8px] bg-[#E0E0E0] text-[#030303] font-body font-bold text-[14px] hover:bg-[#7D082A] transition-all shadow-lg animate-[fade-in_0.3s_ease-out]"
                            >
                                🔓 Show Correct Answer
                            </button>
                        )}
                    </div>
                </div>

                {/* Center - Monaco Editor (Flex 1) */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {/* Already Solved Overlay */}
                    {isAlreadySolved && (
                        <div className="absolute inset-0 z-40 bg-[#030303E6] backdrop-blur-[4px] flex flex-col items-center justify-center p-8 text-center animate-[fade-in_0.3s_ease-out]">
                            <div className="w-16 h-16 rounded-full bg-[#E0E0E026] text-[#E0E0E0] flex items-center justify-center mb-6">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="font-display text-[32px] font-bold text-[#E0E0E0] mb-4">You've Solved This!</h2>
                            <p className="font-body text-[#E0E0E0] opacity-80 max-w-[400px] mb-8">
                                Congratulations! You've already conquered today's Daily Bug. Ready for more? Head over to the practice page for infinite debugging training.
                            </p>
                            <div className="flex gap-4">
                                <Button variant="cta" onClick={() => navigate('/practice')} className="px-8">
                                    Go to Practice
                                </Button>
                                <Button variant="outline" onClick={() => setIsAlreadySolved(false)} className="px-8">
                                    Review My Code
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 w-full relative editor-container">
                        <Editor theme="vs-dark"
                            height="100%"
                            language={activeChallenge.language === 'javascript' || activeChallenge.language === 'python' ? activeChallenge.language : "javascript"}
                            value={code || activeChallenge.buggyCode}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: editorFontSize,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: { top: 20 },
                                renderLineHighlight: 'all',
                                scrollBeyondLastLine: false,
                                wordWrap: "on"
                            }}
                            // Use extremely dark background for Monaco to match spec #030303
                            beforeMount={(monaco) => {
                                monaco.editor.defineTheme('debughub-dark', {
                                    base: 'vs-dark',
                                    inherit: true,
                                    rules: [
                                        { token: 'comment', foreground: '5C5A8A', fontStyle: 'italic' },
                                        { token: 'keyword', foreground: '8474B7' },
                                        { token: 'string', foreground: '72CBD7' },
                                        { token: 'identifier', foreground: 'DEDEDD' },
                                    ],
                                    colors: {
                                        'editor.background': '#030303',
                                        'editorLineNumber.foreground': '#E0E0E0',
                                        'editor.lineHighlightBackground': '#030303',
                                    }
                                });
                            }}
                            onMount={(_editor, monaco) => {
                                monaco.editor.setTheme('debughub-dark');
                            }}
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="h-[60px] action-bar shrink-0 w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="cta"
                                onClick={handleRun}
                                disabled={running}
                                className="flex items-center gap-2 px-4 py-2"
                                title="Ctrl+Enter"
                            >
                                <Play size={16} fill="currentColor" /> Run
                                <span className="ml-2 px-1.5 py-0.5 bg-[#030303] text-[#E0E0E073] rounded text-[10px] font-code hidden md:inline-block">⌘ Enter</span>
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={running}
                                className="flex items-center gap-2 px-4 py-2"
                            >
                                <Check size={16} /> Submit
                            </Button>
                        </div>
                        <div className="font-display text-[15px] font-bold text-[#E0E0E0]">
                            {formatTime(timeElapsed)}
                        </div>
                    </div>

                    {/* Console Output */}
                    <div className="console w-full shrink-0">
                        {output ? (
                            <div className={output.toLowerCase().includes('error') ? 'console-error' : 'console-info'}>
                                {">"} {output}
                            </div>
                        ) : (
                            <div className="text-[#E0E0E0]">{">"} Ready to run...</div>
                        )}
                        {success === false && (
                            <div className="console-error mt-2">✗ Expected: {activeChallenge.expectedOutput}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            {success && !showSplitView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Blurry dark background overlay */}
                    <div className="absolute inset-0 bg-[#030303F2] backdrop-blur-[8px]"></div>

                    <div className="completion-modal w-full max-w-[500px] z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-[#E0E0E026] text-[#E0E0E0] flex items-center justify-center mb-6 animate-[fade-up_0.3s_ease-out]">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h2 className="font-display text-[40px] font-bold text-[#E0E0E0] mb-8 animate-[fade-up_0.4s_ease-out]">Bug Fixed!</h2>

                        {/* Shareable Card */}
                        <div ref={cardRef} className="w-full bg-[#030303] border border-[#E0E0E0] rounded-[12px] p-6 mb-8 relative overflow-hidden animate-[fade-up_0.5s_ease-out]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="font-display font-bold text-[18px] text-[#E0E0E0] flex items-center gap-2">
                                    DEBUGHUB <Bug size={18} className="text-[#E0E0E0]" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mb-8">
                                <span className="font-body text-[16px] text-[#E0E0E0]">Fixed today's bug</span>
                                <span className="font-body text-[16px] text-[#E0E0E0]">in <strong className="text-[#E0E0E0]">{formatTime(timeElapsed)}</strong></span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="font-display text-[24px] font-bold text-[#E0E0E0]">
                                    🔥 {streakNum + 1} day streak
                                </div>
                                <div className="flex gap-4 font-body text-[13px] text-[#E0E0E073]">
                                    <span>Hints: {hintsRevealed}/3</span>
                                    <span>Language: {activeChallenge.language}</span>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 font-body text-[12px] text-[#E0E0E040]">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · debughub.io
                            </div>
                        </div>

                        {/* AI Split View — Prominent CTA */}
                        {attemptId && (
                            <button
                                onClick={() => setShowSplitView(true)}
                                className="w-full mb-6 p-5 rounded-[12px] bg-gradient-to-r from-[#E0E0E033] via-[#E0E0E01A] to-[#E0E0E01A] border border-[#E0E0E066] animate-[fade-up_0.55s_ease-out] group hover:border-[#E0E0E0] hover:shadow-[0_0_30px_rgba(114,203,215,0.15)] transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[10px] bg-[#E0E0E01A] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="text-2xl">🔬</span>
                                        </div>
                                        <div className="text-left">
                                            <span className="font-body font-bold text-[16px] text-[#E0E0E0] block">Compare Your Diagnostic Path</span>
                                            <span className="font-body text-[13px] text-[#E0E0E073]">See how you stack up against AI and Expert solutions</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#E0E0E01A] text-[#E0E0E0]">YOU</span>
                                        <span className="px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#E0E0E01A] text-[#E0E0E0]">AI</span>
                                        <span className="px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#E0E0E01A] text-[#E0E0E0]">EXPERT</span>
                                    </div>
                                </div>
                            </button>
                        )}

                        <div className="flex flex-col md:flex-row gap-4 w-full animate-[fade-up_0.6s_ease-out]">
                            <Button variant="cta" onClick={handleDownloadCard} className="flex-1">Download Card</Button>
                            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">Back to Home</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Split View Modal */}
            {showSplitView && attemptId && activeChallenge && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-[#030303E6] backdrop-blur-[12px]"></div>
                    <div className="w-full max-w-[1200px] h-full relative z-10 flex items-center justify-center">
                        <SplitPathView
                            challengeId={activeChallenge.id}
                            attemptId={attemptId}
                            onClose={() => setShowSplitView(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
