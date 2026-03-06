import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { X, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

interface CreateRoomModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateRoomModal({ onClose, onCreated }: CreateRoomModalProps) {
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [difficulty, setDifficulty] = useState('EASY');
    const [summary, setSummary] = useState('');
    const [buggyCode, setBuggyCode] = useState('// paste your buggy code here');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, language, difficulty, summary, buggyCode }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                onCreated();
            } else {
                setError(data.error || 'Failed to create room');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <div className="absolute inset-0 bg-[#030303E6] backdrop-blur-[12px]" onClick={onClose}></div>
            <div className="w-full max-w-[800px] bg-[#030303] border border-[#E0E0E040] rounded-[16px] flex flex-col relative z-10 max-h-[90vh] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-[#E0E0E026]">
                    <div>
                        <h2 className="font-display text-[24px] font-bold text-[#E0E0E0]">Create Debug Room</h2>
                        <p className="font-body text-[14px] text-[#E0E0E073] mt-1">Post a bug and get help from the community.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-[#E0E0E073] hover:text-[#E0E0E0] rounded-full hover:bg-[#E0E0E026] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex flex-col gap-6 flex-1">
                    {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>}

                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] text-[#E0E0E0] font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Cannot read properties of undefined in nested object"
                            className="bg-[#03030333] border border-[#E0E0E040] rounded-[8px] py-2 px-3 text-[14px] text-[#E0E0E0] focus:outline-none focus:border-[#E0E0E0]"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-[14px] text-[#E0E0E0] font-medium">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-[#03030333] border border-[#E0E0E040] rounded-[8px] py-2 px-3 text-[14px] text-[#E0E0E0] focus:outline-none focus:border-[#E0E0E0]"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-[14px] text-[#E0E0E0] font-medium">Difficulty Estimate</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="bg-[#03030333] border border-[#E0E0E040] rounded-[8px] py-2 px-3 text-[14px] text-[#E0E0E0] focus:outline-none focus:border-[#E0E0E0]"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] text-[#E0E0E0] font-medium">Description / Context</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Describe what you were trying to do, expected behavior vs what actually happened..."
                            className="bg-[#03030333] border border-[#E0E0E040] rounded-[8px] py-2 px-3 text-[14px] text-[#E0E0E0] focus:outline-none focus:border-[#E0E0E0] min-h-[100px] resize-y"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] text-[#E0E0E0] font-medium">Buggy Code</label>
                        <div className="border border-[#E0E0E040] rounded-xl overflow-hidden h-[300px]">
                            <Editor theme="vs-dark"
                                height="100%"
                                language={language === 'cpp' || language === 'c' ? 'c' : language}
                                value={buggyCode}
                                onChange={(val) => setBuggyCode(val || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineHeight: 24,
                                    padding: { top: 16, bottom: 16 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[#E0E0E026] flex justify-end gap-3 bg-[#03030340]">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="cta" onClick={handleSubmit} disabled={loading || !title || !summary}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Room'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
