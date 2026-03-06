import { useState } from 'react';
import { Bell, Zap, Trophy, Users, Settings, Check, Trash2, Bug, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Notification {
    id: string;
    type: 'streak' | 'challenge' | 'community' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    { id: '1', type: 'streak', title: 'Streak Milestone!', message: "You've reached a 10-day debugging streak! Keep it going 🔥", time: '2 hours ago', read: false },
    { id: '2', type: 'challenge', title: 'New Daily Challenge', message: "Today's challenge is a MEDIUM Python bug. Give it a shot!", time: '5 hours ago', read: false },
    { id: '3', type: 'community', title: '@maya mentioned you', message: '"Check out how @you solved yesterday\'s challenge — really clean approach!"', time: '8 hours ago', read: false },
    { id: '4', type: 'system', title: 'AI Comparison Available', message: 'Your reasoning score for yesterday\'s challenge is ready. See how you compared!', time: '1 day ago', read: true },
    { id: '5', type: 'streak', title: 'Streak at Risk! ⚠️', message: "You haven't solved today's challenge yet. Don't break your 9-day streak!", time: '1 day ago', read: true },
    { id: '6', type: 'challenge', title: 'Challenge Solved!', message: 'You fixed the Python edge case bug with 92% reasoning match.', time: '2 days ago', read: true },
    { id: '7', type: 'community', title: 'New follower', message: '@debug_master started following you.', time: '2 days ago', read: true },
    { id: '8', type: 'system', title: 'Welcome to DebugHub!', message: 'Start your debugging journey by solving today\'s Daily Bug.', time: '1 week ago', read: true },
    { id: '9', type: 'challenge', title: 'Weekly Recap', message: 'You solved 5/7 challenges this week. Average reasoning score: 84%.', time: '3 days ago', read: true },
    { id: '10', type: 'community', title: 'Your bug went viral!', message: 'Your submitted bug received 28 upvotes in the Community hub.', time: '4 days ago', read: true },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'streak' | 'challenge' | 'community' | 'system'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

    const typeConfig = {
        streak: { icon: Zap, color: '#E0E0E0', bg: '#E0E0E01A' },
        challenge: { icon: Bug, color: '#E0E0E0', bg: '#E0E0E01A' },
        community: { icon: MessageCircle, color: '#E0E0E0', bg: '#E0E0E01A' },
        system: { icon: Settings, color: '#E0E0E0', bg: '#E0E0E01A' },
    };

    const filterTabs: { key: typeof filter; label: string; icon: any }[] = [
        { key: 'all', label: 'All', icon: Bell },
        { key: 'streak', label: 'Streaks', icon: Zap },
        { key: 'challenge', label: 'Challenges', icon: Trophy },
        { key: 'community', label: 'Community', icon: Users },
        { key: 'system', label: 'System', icon: Settings },
    ];

    return (
        <div className="w-full max-w-[800px] mx-auto p-8 animate-[fade-up_0.5s_ease-out]">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="font-display text-[40px] font-bold text-[#E0E0E0] mb-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center ml-3 px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-[#E0E0E0] text-[#030303] align-middle">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="font-body text-[#E0E0E073]">Stay updated on your debugging journey.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={markAllRead} className="flex items-center gap-2 text-[13px] px-4 py-2 h-auto">
                        <Check size={14} /> Mark All Read
                    </Button>
                    <Button variant="outline" onClick={clearAll} className="flex items-center gap-2 text-[13px] px-4 py-2 h-auto border-[#E0E0E080] text-[#E0E0E0] hover:bg-[#E0E0E01A]">
                        <Trash2 size={14} /> Clear All
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {filterTabs.map(tab => {
                    const isActive = filter === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-[13px] font-semibold border transition-all whitespace-nowrap ${isActive
                                ? 'bg-[#E0E0E026] border-[#E0E0E0] text-[#E0E0E0]'
                                : 'bg-transparent border-[#E0E0E033] text-[#E0E0E073] hover:text-[#E0E0E0] hover:border-[#E0E0E066]'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.key === 'all' && unreadCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#E0E0E0] text-[#030303]">{unreadCount}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notification List */}
            {filtered.length === 0 ? (
                <Card className="p-12 bg-[#0303034D] border-[#E0E0E033] text-center">
                    <Bell size={40} className="text-[#E0E0E040] mx-auto mb-4" />
                    <p className="font-body text-[15px] text-[#E0E0E073]">No notifications</p>
                    <p className="font-body text-[12px] text-[#E0E0E040] mt-1">You're all caught up!</p>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map(n => {
                        const cfg = typeConfig[n.type];
                        const Icon = cfg.icon;
                        return (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id)}
                                className={`p-5 rounded-[12px] border transition-all cursor-pointer group ${n.read
                                    ? 'bg-[#030303F2] border-[#E0E0E01A] hover:border-[#E0E0E033]'
                                    : 'bg-[#03030333] border-[#E0E0E04D] hover:border-[#E0E0E080]'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                                        <Icon size={18} color={cfg.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-body text-[14px] font-semibold ${n.read ? 'text-[#E0E0E0]' : 'text-[#E0E0E0]'}`}>{n.title}</h4>
                                                {!n.read && <div className="w-2 h-2 rounded-full bg-[#E0E0E0] shrink-0" />}
                                            </div>
                                            <span className="text-[11px] font-code text-[#E0E0E040] whitespace-nowrap">{n.time}</span>
                                        </div>
                                        <p className="font-body text-[13px] text-[#E0E0E073] leading-relaxed">{n.message}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
