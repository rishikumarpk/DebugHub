import { useState, useEffect } from 'react';
import { Calendar, Trophy, Zap, Code, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';

interface DailyStats {
    totalChallenges: number;
    solvedChallenges: number;
    currentStreak: number;
    avgReasoningScore: number;
}

export default function DailyChallengesTracker() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats] = useState<DailyStats>({
        totalChallenges: 30,
        solvedChallenges: 18,
        currentStreak: 12,
        avgReasoningScore: 84
    });

    useEffect(() => {
        // Fetch historical challenges and stats here
        // Mocking for now
        setTimeout(() => {
            setChallenges([
                { id: '1', date: '2024-03-20', type: 'DEBUGGING', language: 'python', difficulty: 'HARD', solved: true, score: 92 },
                { id: '2', date: '2024-03-19', type: 'CODE_REVIEW', language: 'javascript', difficulty: 'MEDIUM', solved: true, score: 78 },
                { id: '3', date: '2024-03-18', type: 'DEBUGGING', language: 'javascript', difficulty: 'EASY', solved: false, score: 0 },
                { id: '4', date: '2024-03-17', type: 'DEBUGGING', language: 'python', difficulty: 'MEDIUM', solved: true, score: 88 },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <Card className="flex flex-col p-6 bg-[#0303034D] border-[#E0E0E033] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-10`} style={{ backgroundColor: color }}></div>
            <div className="flex justify-between items-start mb-4">
                <span className="text-[#E0E0E073] text-[12px] font-bold uppercase tracking-wider">{title}</span>
                <Icon size={18} color={color} />
            </div>
            <div className="font-display text-3xl font-bold text-[#E0E0E0] mb-1">{value}</div>
        </Card>
    );

    if (loading) return <div className="p-12 text-center text-[#E0E0E073]">Loading activity...</div>;

    return (
        <div className="w-full max-w-[1200px] mx-auto p-8 animate-[fade-up_0.5s_ease-out]">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="font-display text-[40px] font-bold text-[#E0E0E0] mb-2">Daily Challenges</h1>
                    <p className="font-body text-[#E0E0E073]">Track your consistency and sharpen your diagnostic skills.</p>
                </div>
                <Link to="/daily-bug">
                    <button className="px-8 py-3 bg-[#E0E0E0] text-[#030303] font-bold rounded-[8px] hover:scale-105 transition-all shadow-[0_0_20px_rgba(114,203,215,0.3)]">
                        SOLVE TODAY'S BUG
                    </button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard title="Total Solved" value={stats.solvedChallenges} icon={Trophy} color="#E0E0E0" />
                <StatCard title="Current Streak" value={`${stats.currentStreak}d`} icon={Zap} color="#E0E0E0" />
                <StatCard title="Avg Reasoning" value={`${stats.avgReasoningScore}%`} icon={ShieldCheck} color="#E0E0E0" />
                <StatCard title="Completion" value={`${Math.round((stats.solvedChallenges / stats.totalChallenges) * 100)}%`} icon={Calendar} color="#E0E0E0" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent History */}
                <div className="lg:col-span-2">
                    <h3 className="font-body font-semibold text-[18px] text-[#E0E0E0] mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-[#E0E0E0]" />
                        Recent History
                    </h3>
                    <div className="flex flex-col gap-4">
                        {challenges.map(c => (
                            <div key={c.id} className="p-5 bg-[#030303F2] border border-[#E0E0E033] rounded-[12px] flex items-center justify-between group hover:border-[#E0E0E080] transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center ${c.type === 'DEBUGGING' ? 'bg-[#E0E0E01A]' : 'bg-[#E0E0E01A]'}`}>
                                        {c.type === 'DEBUGGING' ? <Code size={24} className="text-[#E0E0E0]" /> : <ShieldCheck size={24} className="text-[#E0E0E0]" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-body font-bold text-[#E0E0E0] text-[15px]">{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <Badge color={c.language as any}>{c.language.toUpperCase()}</Badge>
                                            <Badge color={c.difficulty as any}>{c.difficulty}</Badge>
                                        </div>
                                        <div className="text-[13px] text-[#E0E0E073] font-body">Type: {c.type === 'DEBUGGING' ? 'Logic Debug' : 'Security Audit'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {c.solved ? (
                                        <div className="flex flex-col items-end">
                                            <div className="text-[#E0E0E0] font-bold font-display text-[18px]">{c.score}% Match</div>
                                            <span className="text-[11px] text-[#E0E0E080] font-bold tracking-tighter uppercase">SUCCESSFUL</span>
                                        </div>
                                    ) : (
                                        <span className="text-[13px] text-[#E0E0E080] font-bold uppercase">MISSING</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Sidebar */}
                <div>
                    <h3 className="font-body font-semibold text-[18px] text-[#E0E0E0] mb-6 flex items-center gap-2">
                        <Trophy size={20} className="text-[#E0E0E0]" />
                        Top Performers
                    </h3>
                    <div className="bg-[#030303F2] border border-[#E0E0E033] rounded-[16px] overflow-hidden">
                        {[
                            { name: 'v0_pilot', score: 981, avatar: 'VP' },
                            { name: 'byte_ninja', score: 914, avatar: 'BN' },
                            { name: 'debug_master', score: 887, avatar: 'DM' },
                            { name: 'you', score: 842, avatar: 'U', isYou: true },
                            { name: 'pixel_doc', score: 792, avatar: 'PD' },
                        ].map((u, i) => (
                            <div key={i} className={`p-4 flex items-center justify-between border-b border-[#E0E0E01A] last:border-0 ${u.isYou ? 'bg-[#E0E0E01A]' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-[12px] font-code text-[#E0E0E040] w-4">#{i + 1}</span>
                                    <div className="w-8 h-8 rounded-full bg-[#E0E0E04D] flex items-center justify-center text-[11px] font-bold text-[#E0E0E0]">{u.avatar}</div>
                                    <span className={`text-[14px] font-medium ${u.isYou ? 'text-[#E0E0E0]' : 'text-[#E0E0E0]'}`}>{u.name}</span>
                                </div>
                                <div className="text-[14px] font-bold text-[#E0E0E0] opacity-80">{u.score}</div>
                            </div>
                        ))}
                        <div className="p-4 bg-[#030303] text-center">
                            <button className="text-[12px] text-[#E0E0E0] font-bold hover:text-[#E0E0E0] transition-colors">VIEW FULL LEADERBOARD</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
