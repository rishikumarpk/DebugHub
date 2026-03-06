import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Pause, SkipBack, SkipForward, Clock, Share2, CornerDownRight } from 'lucide-react';
import Button from '../components/ui/Button';

const REPLAY_EVENTS = [
    { time: '0:00', event: 'Session Started' },
    { time: '0:45', event: 'Ran Code (Failed)', error: true },
    { time: '1:12', event: '@maya joined' },
    { time: '2:30', event: 'Applied Patch (useEffect fix)', highlight: true },
    { time: '2:45', event: 'Ran Code (Success)' },
    { time: '3:00', event: 'Session Ended' }
];

export function DebugReplay() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(45); // mocked 45% progress
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [codeCode, _setCodeCode] = useState('import { useState, useEffect } from "react";\n\nfunction App() {\n  const [data, setData] = useState([]);\n  \n  useEffect(() => {\n    fetchData();\n  });\n\n  return <div>{data.length} items</div>;\n}');
    const [speed, setSpeed] = useState('1x');

    // Mock progress tick
    useEffect(() => {
        if (isPlaying) {
            const int = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 0.5));
            }, 100);
            return () => clearInterval(int);
        }
    }, [isPlaying]);

    return (
        <div className="w-full h-[calc(100vh-48px)] flex flex-col relative bg-[#030303]">

            {/* Topbar Replay Status */}
            <div className="h-[48px] bg-[#030303F2] border-b border-[#E0E0E026] flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#03030333] border border-[#E0E0E040] rounded-[20px] font-code text-[11px] font-bold text-[#E0E0E073] tracking-widest uppercase">
                        <Clock size={12} /> REPLAY MODE
                    </div>
                    <span className="font-body text-[14px] text-[#E0E0E0] font-semibold">React useEffect bug — Fixed by @maya & @raj</span>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-[28px] py-0 px-3 text-[12px] flex items-center gap-2">
                        <Share2 size={12} /> Share Replay
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">

                {/* Center Panel: Editor (Read Only) */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-[#E0E0E026] relative custom-editor-container">

                    {/* Ghost Cursor Simulation */}
                    <div
                        className="absolute z-10 w-0.5 h-4 bg-[#E0E0E0] pointer-events-none transition-all duration-300 ease-out"
                        style={{ top: '160px', left: `${150 + Math.sin(progress / 10) * 50}px` }}
                    >
                        <div className="absolute top-4 left-2 font-display text-[24px] text-[#E0E0E0] opacity-50">
                            <CornerDownRight size={20} />
                        </div>
                        <div className="absolute -top-5 left-0 bg-[#E0E0E0D9] text-[#E0E0E0] font-body font-semibold text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                            @maya (ghost)
                        </div>
                    </div>

                    <div className="flex-1 relative opacity-80 pointer-events-none">
                        <Editor theme="vs-dark"
                            height="100%"
                            language="javascript"
                            value={codeCode}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: { top: 20 },
                                readOnly: true,
                                scrollBeyondLastLine: false
                            }}
                            onMount={(_editor, monaco) => {
                                monaco.editor.setTheme('debughub-dark');
                            }}
                        />
                    </div>
                </div>

                {/* Right Panel: Key Moments */}
                <div className="w-[280px] shrink-0 bg-[#030303F2] flex flex-col">
                    <div className="p-4 border-b border-[#E0E0E026] shrink-0">
                        <div className="font-body text-[11px] font-bold text-[#E0E0E073] tracking-widest uppercase mb-1">Key Moments</div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-0 relative">
                        {/* Vertical line connecting events */}
                        <div className="absolute left-[27px] top-6 bottom-6 w-px bg-[#E0E0E026]"></div>

                        {REPLAY_EVENTS.map((ev, i) => (
                            <div key={i} className={`flex items-start gap-4 py-3 relative z-10 ${i === 3 ? 'opacity-100' : 'opacity-50'}`}>
                                <div className="font-code text-[11px] text-[#E0E0E073] pt-0.5 w-8 shrink-0 text-right">{ev.time}</div>

                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-[0_0_0_4px_#030303] ${ev.highlight ? 'bg-[#E0E0E0] shadow-[0_0_8px_#E0E0E0,0_0_0_4px_#030303]' :
                                    ev.error ? 'bg-[#E0E0E0]' : 'bg-[#E0E0E0]'
                                    }`}></div>

                                <div className="flex-1">
                                    <div className={`font-body text-[13px] ${ev.highlight ? 'text-[#E0E0E0] font-semibold' : 'text-[#E0E0E0]'}`}>
                                        {ev.event}
                                    </div>
                                    {ev.error && (
                                        <div className="text-[11px] font-code text-[#E0E0E0] mt-1 bg-[#E0E0E01a] px-1.5 py-0.5 rounded border border-[#E0E0E04D] w-fit">
                                            TypeError seen here
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Panel: Scrubber & Controls */}
            <div className="h-[80px] bg-[#030303] border-t border-[#E0E0E040] flex flex-col shrink-0 relative z-30">

                {/* Timeline Scrubber */}
                <div className="h-2 w-full bg-[#030303] relative cursor-pointer group">
                    <div className="absolute inset-y-0 left-0 bg-[#E0E0E0] pointer-events-none transition-all duration-75" style={{ width: `${progress}%` }}></div>

                    {/* Event Markers on Scrubber */}
                    {REPLAY_EVENTS.map((ev, i) => {
                        const pos = (i / (REPLAY_EVENTS.length - 1)) * 100;
                        return (
                            <div key={i} className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-full -ml-[3px] pointer-events-none ${ev.highlight ? 'bg-[#E0E0E0]' : ev.error ? 'bg-[#E0E0E0]' : 'bg-[#E0E0E0]/50'}`} style={{ left: `${pos}%` }}></div>
                        )
                    })}

                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#E0E0E0] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] -ml-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progress}%` }}></div>
                </div>

                {/* Controls */}
                <div className="flex-1 flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button className="text-[#E0E0E073] hover:text-[#E0E0E0] transition-colors"><SkipBack size={18} fill="currentColor" /></button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-10 h-10 rounded-full bg-[#E0E0E0] text-[#E0E0E0] flex items-center justify-center hover:bg-[#E0E0E0] hover:scale-105 transition-all shadow-[0_0_15px_rgba(119,97,169,0.4)]"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                            </button>
                            <button className="text-[#E0E0E073] hover:text-[#E0E0E0] transition-colors"><SkipForward size={18} fill="currentColor" /></button>
                        </div>

                        <div className="font-code text-[14px] text-[#E0E0E0] w-24">
                            01:21 <span className="text-[#E0E0E0]">/ 03:00</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {['0.5x', '1x', '2x', '4x'].map(s => (
                            <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`px-2 py-1 rounded-[4px] font-code text-[11px] font-bold ${speed === s ? 'bg-[#030303] text-[#E0E0E0]' : 'text-[#E0E0E073] hover:text-[#E0E0E0]'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Locked State Overlay Mock */}
                {/* 
                <div className="absolute inset-0 bg-[#030303E6] backdrop-blur-[2px] z-40 flex items-center justify-center border-t border-[#E0E0E04D]">
                    <div className="flex items-center gap-3 text-[#E0E0E0] font-body text-[14px] font-semibold bg-[#E0E0E01a] px-4 py-2 rounded-[8px] border border-[#E0E0E080]">
                        <AlertCircle size={16} /> Finish today's challenge to unlock Replays
                    </div>
                </div> 
                */}

            </div>
        </div>
    );
}
